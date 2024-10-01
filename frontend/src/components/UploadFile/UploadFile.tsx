import { ChangeEvent, useRef } from 'react';
import { Button } from '../ui/button';
import { ImageUp } from 'lucide-react';
import { UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

type TUploadFileProps = {
  mutation: UseMutationResult<
    {
      url: string;
    },
    Error,
    FormData,
    unknown
  >;
};

const UploadFile = ({ mutation }: TUploadFileProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUpload = () => inputRef.current?.click();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await mutation.mutateAsync(formData);
      toast.success('File uploaded successfully');
    } catch {
      toast.error('File upload failed. Please try again.');
    }
  };

  return (
    <>
      <div className='input-group'>
        <input
          ref={inputRef}
          type='image/*'
          onChange={handleFileChange}
          hidden
        />
        <Button onClick={onUpload}>
          <ImageUp className='mr-2 size-4' /> Upload Image
        </Button>
      </div>
    </>
  );
};

export default UploadFile;
