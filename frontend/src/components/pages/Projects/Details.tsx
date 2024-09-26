import { Loader } from "@/components/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useGetToken from "@/hooks/useGetToken";
import { getProject } from "@/services/projects";
import { useQuery } from "@tanstack/react-query";

type TDetailsProps = {
    isOpen: boolean;
    toggleModal: () => void;
    projectId: number;
}

const Details = ({isOpen, toggleModal, projectId}: TDetailsProps) => {
  const token = useGetToken();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getProject({ token: token as string, id: projectId }),
    enabled: !!token && !!projectId,
  });

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <div>Error</div>;
    }

    console.log(data);

    return (
        <AlertDialog open={isOpen} onOpenChange={toggleModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default Details;
