
import styles from './interlay-container.module.css';

interface Props {
  children: React.ReactNode;
}

const InterlayContainer = ({ children }: Props) => (
  <div className={styles['interlay-container']}>
    {children}
  </div>
);

export default InterlayContainer;
