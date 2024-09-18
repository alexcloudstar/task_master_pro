import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-sky-950 group-[.toaster]:border-sky-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-sky-950 dark:group-[.toaster]:text-sky-50 dark:group-[.toaster]:border-sky-800',
          description:
            'group-[.toast]:text-sky-500 dark:group-[.toast]:text-sky-400',
          actionButton:
            'group-[.toast]:bg-sky-900 group-[.toast]:text-sky-50 dark:group-[.toast]:bg-sky-50 dark:group-[.toast]:text-sky-900',
          cancelButton:
            'group-[.toast]:bg-sky-100 group-[.toast]:text-sky-500 dark:group-[.toast]:bg-sky-800 dark:group-[.toast]:text-sky-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
