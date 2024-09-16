import { LucideProps } from 'lucide-react';

export type TRoute = {
  id: string;
  to: string;
  label: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
};

export type TToken = {
  token: string;
};
