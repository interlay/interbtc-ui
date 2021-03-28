
// ray test touch <
import {
  ReactElement,
  useMemo
} from 'react';
import { useTranslation } from 'react-i18next';

import InterlayLink from 'components/UI/InterlayLink';
import { TableDisplayParams } from 'common/types/util.types';
import { getAccents } from 'pages/dashboard/dashboard-colors';
import TablePageSelector from '../table-page-selector/table-page-selector';
import { ReactComponent as ExternalLinkIcon } from 'assets/img/icons/external-link.svg';
// TODO: should follow SVG usage best practices
// ray test touch <
import iconConfirm from 'assets/img/icons/Icon_confirm.svg';
import iconCancel from 'assets/img/icons/Icon_cancel.svg';
import iconPending from 'assets/img/icons/Icon_pending.svg';
// ray test touch >

/**
 * Helper component to display a blue link with icon.
 **/
type StyledLinkDataProps = {
  data: string;
  target?: string;
  newTab?: boolean;
};

function StyledLinkData(props: StyledLinkDataProps): ReactElement {
  // TODO: make into actual hyperlink
  return (
    <InterlayLink
      className='text-interlayBlue'
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
// eslint-disable-next-line no-unused-vars
enum StatusCategories {
  // eslint-disable-next-line no-unused-vars
  Bad,
  // eslint-disable-next-line no-unused-vars
  Warning,
  // eslint-disable-next-line no-unused-vars
  Ok,
  // eslint-disable-next-line no-unused-vars
  Neutral,
}
type StatusComponentProps = {
    text: string;
    category: StatusCategories;
};

function StatusComponent({ text, category }: StatusComponentProps): ReactElement {
  const icon =
    category === StatusCategories.Ok ?
      iconConfirm :
      category === StatusCategories.Bad ?
        iconCancel :
        iconPending;
  const color =
    category === StatusCategories.Ok ? 'd_green' : category === StatusCategories.Bad ? 'd_red' : 'd_yellow';
  return (
    <div className='status-container'>
      {category === StatusCategories.Neutral ? '' : (
        <img
          // ray test touch <
          className='ml-1 w-3.5 h-3.5'
          // ray test touch >
          src={icon}
          alt='' />
      )}
      <p
        style={category === StatusCategories.Neutral ? {} : { color: getAccents(color).color }}
        className='status'>
        {text}
      </p>
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
        {props.headings.map((heading, i) => (
          <div style={{ gridColumn: i + 1 }}>
            <div className='line'></div>
            <div className='data-container'>{heading}</div>
            <div className='line'></div>
            {props.pageData.map(point => (
              <div>
                <div className='data-container'>{props.dataPointDisplayer(point)[i]}</div>
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
// ray test touch >
