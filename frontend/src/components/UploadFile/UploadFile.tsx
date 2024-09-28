import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { ImageUp } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { fileUpload } from '@/services/upload'; 
import useGetToken from '@/hooks/useGetToken';
import { toast } from 'sonner';

const UploadFile = ({
    projectName,
}: {
    projectName: string;
}) => {
  const token = useGetToken(); 
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onUpload = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const mutation = useMutation({
    mutationFn: (fileFormData: FormData) =>
      fileUpload({
        token: token as string,
        folder: projectName,
        formData: fileFormData,
      }),
    onSuccess: (result) => {
      console.log(result);
      setFile(null);
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('File upload failed. Please try again.');
    },
  });
  const handleUpload = async () => {
    if (file) {
      console.log('Uploading file...');


      const formData = new FormData();
      formData.append('file', file);

      try {
        await mutation.mutateAsync(formData);
      } catch (error) {
        console.error('Error during file upload:', error);
      }
    } else {
      toast.error('Please select a file to upload');
    }
  };

  return (
    <>
      <div className="input-group">
        <input ref={inputRef} type="file" onChange={handleFileChange} hidden />
        <Button onClick={onUpload}>
          <ImageUp className="mr-2 size-4" /> Upload Image
        </Button>
      </div>
      {file && (
        <Button onClick={handleUpload}>
          Upload File
        </Button>
      )}
    </>
  );
};

export default UploadFile;
