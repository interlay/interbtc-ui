import { RouteComponentProps, Route } from 'react-router-dom';

interface LandingRouterProps {
  title: string
}

// interface LandingProps extends RouteComponentProps<LandingRouterProps> {
interface LandingProps {
  totalPolkaBTC: string;
  totalLockedDOT: string
}

export default LandingProps;
