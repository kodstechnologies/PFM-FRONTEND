import { ReactElement } from 'react';

export type AppRoute = {
  path: string;
  element: ReactElement;
  layout: 'default' | 'blank';
  role?: string; // optional: 'super-admin', 'manager', etc.
};
