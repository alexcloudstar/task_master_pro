import useGetToken from '@/hooks/useGetToken';
import { getAssets } from '@/services/files';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../Loader';
import ModalImage from 'react-modal-image';

const Assets = ({ projectName }: { projectName: string }) => {
  const token = useGetToken();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['project', projectName],
    queryFn: () => getAssets({ token: token as string, folder: projectName }),
    enabled: !!token && !!projectName,
  });

  if (isLoading) return <Loader />;

  if (isError) return <div>Error</div>;

  return (
    <div className='flex items-center justify-start flex-wrap gap-3'>
      {Array.isArray(data?.data) &&
        data?.data.map((asset: string, idx) => (
          <div key={asset} className='cursor-pointer'>
            <ModalImage
              small={asset}
              large={asset}
              alt={`${projectName} asset ${idx}`}
              className='size-12'
            />
          </div>
        ))}
    </div>
  );
};

export default Assets;
