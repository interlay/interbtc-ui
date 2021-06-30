
import {
  ReactElement,
  useMemo
} from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';
import { TableDisplayParams } from 'common/types/util.types';
import TablePageSelector from '../table-page-selector/table-page-selector';
import { ReactComponent as ExternalLinkIcon } from 'assets/img/icons/external-link.svg';
import { ReactComponent as CheckCircleIcon } from 'assets/img/icons/check-circle.svg';
import { ReactComponent as CancelIcon } from 'assets/img/icons/cancel.svg';
import { ReactComponent as ErrorIcon } from 'assets/img/icons/error.svg';

/**
 * Helper component to display a blue link with icon.
 **/
type StyledLinkDataProps = {
  data: string;
  target?: string;
  newTab?: boolean;
};

// TODO: should not use as it's too implicit
function StyledLinkData(props: StyledLinkDataProps): ReactElement {
  // TODO: make into actual hyperlink
  return (
    <InterlayLink
      className='text-interlayDenim'
      href={props.target}
      target={props.newTab ? '_blank' : ''}
      rel='noopener noreferrer'>
      <span>{props.data}</span>
      <ExternalLinkIcon
        className='ml-1'
        width={14}
        height={14} />
    </InterlayLink>
  );
}

/**
 * Helper component to display status text, with appropriate colour and status icon
 **/
enum StatusCategories {
  Bad,
  Warning,
  Ok,
  Neutral
}

type StatusComponentProps = {
    text: string;
    category: StatusCategories;
};

// TODO: should drop it with `StatusCategories` as it's too implicit
function StatusComponent({
  text,
  category
}: StatusComponentProps): ReactElement {
  const Icon =
    category === StatusCategories.Ok ?
      CheckCircleIcon :
      category === StatusCategories.Bad ?
        CancelIcon :
        ErrorIcon;

  return (
    <div
      className={clsx(
        'flex',
        'justify-center',
        'items-center'
      )}>
      {category === StatusCategories.Neutral ? '' : (
        <Icon
          className={clsx(
            'ml-1',
            { 'text-interlayConifer': category === StatusCategories.Ok },
            { 'text-interlayCinnabar': category === StatusCategories.Bad },
            { 'text-interlayOrangePeel': category !== StatusCategories.Ok && category !== StatusCategories.Bad }
          )}
          width={14}
          height={14} />
      )}
      <span
        className={clsx(
          'ml-1',
          'font-bold',
          { 'text-interlayConifer': category === StatusCategories.Ok },
          { 'text-interlayCinnabar': category === StatusCategories.Bad },
          {
            'text-interlayOrangePeel':
              category !== StatusCategories.Ok &&
              category !== StatusCategories.Bad &&
              category !== StatusCategories.Neutral
          }
        )}>
        {text}
      </span>
    </div>
  );
}

type DataWithID = { id: string };
type SimpleDashboardTableProps<D extends DataWithID> = {
    richTable?: false;
    pageData: D[];
    headings: ReactElement[];
    dataPointDisplayer: (dataPoint: D) => ReactElement[];
    noDataEl?: ReactElement;
};
type RichDashboardTableProps<D extends DataWithID, C> = {
    richTable: true;
    pageData: D[];
    totalPages: number;
    tableParams: TableDisplayParams<C>;
    setTableParams: (params: TableDisplayParams<C>) => void;
    headings: ReactElement[];
    dataPointDisplayer: (dataPoint: D) => ReactElement[];
    noDataEl?: ReactElement;
};

type DashboardTableProps<D extends DataWithID, C> = SimpleDashboardTableProps<D> | RichDashboardTableProps<D, C>;

function DashboardTable<D extends DataWithID, C>(props: DashboardTableProps<D, C>): ReactElement {
  const { t } = useTranslation();

  const setPage = useMemo(
    () => (page: number) => (props.richTable ? props.setTableParams({ ...props.tableParams, page }) : undefined),
    [props]
  );

  return props.pageData.length > 0 ? (
    <div className='dashboard-table'>
      <div className='dashboard-table-grid'>
        {props.headings.map((heading, index) => (
          <div
            key={index}
            style={{ gridColumn: index + 1 }}>
            <div className='line'></div>
            <div className='data-container'>{heading}</div>
            <div className='line'></div>
            {props.pageData.map((point, subIndex) => (
              <div key={subIndex}>
                <div className='data-container'>{props.dataPointDisplayer(point)[index]}</div>
                <div className='line'></div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {props.richTable ? (
        <TablePageSelector
          totalPages={props.totalPages}
          currentPage={props.tableParams.page}
          setPage={setPage} />
      ) : (
        ''
      )}
    </div>
  ) : props.noDataEl === undefined ? (
    <div>{t('empty_data')}</div>
  ) : (
    props.noDataEl
  );
}

export {
  StyledLinkData,
  StatusComponent,
  StatusCategories
};

export default DashboardTable;
