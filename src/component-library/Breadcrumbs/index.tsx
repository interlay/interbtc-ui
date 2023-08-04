import { BreadcrumbItem as LibBreadcrumbItem, BreadcrumbItemProps as LibBreadcrumbItemProps } from './BreadcrumbItem';

type BreadcrumbItemProps = Omit<LibBreadcrumbItemProps, 'isCurrent'>;

const BreadcrumbItem = (props: BreadcrumbItemProps): JSX.Element => <LibBreadcrumbItem isCurrent={false} {...props} />;

export type { BreadcrumbsProps } from './Breadcrumbs';
export { Breadcrumbs } from './Breadcrumbs';
export { BreadcrumbItem };
export type { BreadcrumbItemProps };
