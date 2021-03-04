
import {
  TransitionGroup,
  CSSTransition
} from 'react-transition-group';
import { Location } from 'history';

import './transition-wrapper.css';

interface Props {
  location: Location;
  children: React.ReactNode
}

/**
 * TODO: could optimize further
 * - (Re: https://css-tricks.com/animating-between-views-in-react/#profiling-the-initial-load)
 */

const TransitionWrapper = ({
  location,
  children
}: Props) => (
  <TransitionGroup>
    <CSSTransition
      key={location.key}
      classNames='fade'
      timeout={300}>
      {children}
    </CSSTransition>
  </TransitionGroup>
);

export default TransitionWrapper;
