import { ReactNode } from 'react';

import { useGeoblocking } from '@/utils/hooks/use-geoblocking';

type Props = {
  children: ReactNode;
};

const GeoblockingWrapper = ({ children }: Props): JSX.Element => {
  useGeoblocking();
  return <>{children}</>;
};

export { GeoblockingWrapper };
