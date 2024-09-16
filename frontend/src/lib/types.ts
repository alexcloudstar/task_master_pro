import { LucideProps } from 'lucide-react';

export type TIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

export type TRoute = {
  id: string;
  to: string;
  label: string;
  Icon: TIcon;
};

export type TToken = {
  token: string;
};
