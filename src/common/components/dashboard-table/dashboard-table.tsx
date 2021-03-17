import { ReactElement, useMemo } from 'react';
import { TableDisplayParams } from '../../types/util.types';
import { useTranslation } from 'react-i18next';
import { getAccents } from '../../../pages/dashboard/dashboard-colors';
// TODO: should follow SVG usage best practices
import iconExternalLink from '../../../assets/img/icons/Icon-external-link.svg';
import iconConfirm from '../../../assets/img/icons/Icon_confirm.svg';
import iconCancel from '../../../assets/img/icons/Icon_cancel.svg';
import iconPending from '../../../assets/img/icons/Icon_pending.svg';
import TablePageSelector from '../table-page-selector/table-page-selector';
import InterlayLink from 'components/InterlayLink';

const blueAccent = getAccents('d_blue');

/**
 * Helper component to display a blue link with icon.
 **/
type StyledLinkDataProps = {
  data: string;
  target?: string;
  newTab?: boolean;
};

// TODO: should follow external link security best practices
function StyledLinkData(props: StyledLinkDataProps): ReactElement {
  // TODO: make into actual hyperlink
  return (
    <InterlayLink
      href={props.target}
      target={props.newTab ? '_blank' : ''}
      rel='noopener noreferrer'>
      <p style={{ color: blueAccent.color }}>
        {props.data}
        <img
          style={{
            filter: blueAccent.filter
          }}
          className='external-link'
          src={iconExternalLink}
          alt='' />
      </p>
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
          className='external-link'
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

export default function DashboardTable<D extends DataWithID, C>(props: DashboardTableProps<D, C>): ReactElement {
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
