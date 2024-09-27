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
} from "@/components/ui/alert-dialog"
import useGetToken from "@/hooks/useGetToken";
import { getProject } from "@/services/projects";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUp } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";


type TDetailsProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void
    projectId: number;
}

const Details = ({isOpen, setIsOpen, projectId}: TDetailsProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useGetToken();

  const formSchema = z.object({
        description: z.string(),
  });


    const onSubmit = async (values: z.infer<typeof formSchema>) => {}

  const { isLoading, isError, data } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getProject({ token: token as string, id: projectId }),
    enabled: !!token && !!projectId,
  });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
        },
    });

    const onUpload = () => {
        setIsSubmitting(true);
    };

    useEffect(() => {
        if (data) {
            form.setValue('description', data.description);
        }
    }, [data, form]);

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <div>Error</div>;
    }

    console.log(data);

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{
                        data?.title
                    }</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id='create_project'
                    className='space-y-4'
                  >
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project description</FormLabel>
                          <FormControl>
                                    <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                        {
                            isSubmitting ? <Button disabled className="cursor-not-allowed">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
    :

                        <Button onClick={onUpload}>
                            <ImageUp className="mr-2 h-4 w-4" /> Upload Image
                        </Button>
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting} className="cursor-not-allowed">{
                        isSubmitting ? 
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
: 'Cancel'
                    }</AlertDialogCancel>
                    <AlertDialogAction disabled={isSubmitting} className="cursor-not-allowed">{
                        isSubmitting ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
: 'Save'
                    }</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default Details;
