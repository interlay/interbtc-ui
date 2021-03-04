
import clsx from 'clsx';

import { TabTypes } from 'utils/enums/tab-types';
import styles from './horizontal-line.module.css';

interface Props {
  selectedTabType: TabTypes;
}

const HorizontalLine = ({ selectedTabType }: Props) => (
  <hr
    className={clsx(
      styles['horizontal-line'],
      { [styles['horizontal-line-pink']]: selectedTabType === TabTypes.Issue },
      { [styles['horizontal-line-yellow']]: selectedTabType === TabTypes.Redeem },
      { [styles['horizontal-line-blue']]: selectedTabType === TabTypes.Transfer }
    )} />
);

export default HorizontalLine;
