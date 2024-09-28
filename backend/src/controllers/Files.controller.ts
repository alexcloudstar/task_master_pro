import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { env } from '../../config';
import { Request, Response } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
	region: env.AWS_REGION ?? '',
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID ?? '',
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? '',
	},
});

export const getFile = async (req: Request, res: Response) => {
	const { folder, file } = req.params;

	if (!folder || !file) {
		return res.status(400).json({
			message: 'Name is required',
		});
	}

	try {
		const params = {
			Bucket: env.AWS_BUCKET,
			Key: `${folder}/${file}`,
			Expires: 3600,
		};

		const command = new GetObjectCommand(params);
		const signedUrl = await getSignedUrl(client, command);

		return res.status(200).json({
			url: signedUrl,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const uploadFile = async (req: Request, res: Response) => {
	const { folder } = req.params;

	if (!req.file) {
		return res.status(400).json({
			message: 'File is required',
		});
	}

	const params = {
		Bucket: env.AWS_BUCKET,
		Key: `${folder}/${req.file.originalname}-${Date.now()}`,
		Body: req.file.buffer,
		ContentType: req.file.mimetype,
        Size: req.file.size,
	};

	try {
		const command = new PutObjectCommand(params);
		await client.send(command);

		const signedUrl = await getSignedUrl(
			client,
			new GetObjectCommand({
				Bucket: env.AWS_BUCKET,
				Key: params.Key,
			}),
		);

		return res.status(200).json({
			url: signedUrl,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};
