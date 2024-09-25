import { Row } from '@tanstack/react-table';

export type TAction = {
  title: string;
  onClick: (project_id: number) => void;
};

export type TRowActionsProps<T> = {
  row: Row<T>;
  actions: TAction[];
  copyIdentifier: keyof T;
};
