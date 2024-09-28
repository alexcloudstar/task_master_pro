import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { ImageUp } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { fileUpload } from '@/services/upload';
import useGetToken from '@/hooks/useGetToken';
import { toast } from 'sonner';

const UploadFile = ({ projectName }: { projectName: string }) => {
  const token = useGetToken();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mutation = useMutation({
    mutationFn: (fileFormData: FormData) =>
      fileUpload({
        token: token as string,
        folder: projectName,
        formData: fileFormData,
      }),
  });

  const onUpload = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) {
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
        <input ref={inputRef} type='file' onChange={handleFileChange} hidden />
        <Button onClick={onUpload}>
          <ImageUp className='mr-2 size-4' /> Upload Image
        </Button>
      </div>
    </>
  );
};

export default UploadFile;
