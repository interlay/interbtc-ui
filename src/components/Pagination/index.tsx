
import RCPagination, { PaginationProps } from 'rc-pagination';
import 'rc-pagination/assets/index.css'; // TODO: should style properly using tailwindcss

const Pagination = (props: Props): JSX.Element => {
  return (
    <RCPagination {...props} />
  );
};

export type Props = PaginationProps;

export default Pagination;
