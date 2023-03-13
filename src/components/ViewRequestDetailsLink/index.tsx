import { shortAddress } from '@/common/utils/utils';
import InterlayRouterLink from '@/components/UI/InterlayRouterLink';
import { TXType } from '@/types/general.d';
import { PAGES } from '@/utils/constants/links';

interface Props {
  id: string;
  txType: `${TXType}`;
}

const ViewRequestDetailsLink = ({ id, txType }: Props): JSX.Element => {
  const path = `${PAGES.TX}/${txType}/${id}`;

  return (
    <InterlayRouterLink className='hover:underline' to={path} withArrow>
      {shortAddress(id)}
    </InterlayRouterLink>
  );
};

export default ViewRequestDetailsLink;
