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

export type TProject = {
  id?: number;
  title: string;
  description: string;
  color: string;
  created_by_id: number;
  created_at: Date;
  updated_at: Date;
};
