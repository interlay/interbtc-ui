import clsx from 'clsx';

import { shortAddress } from '@/common/utils/utils';
import CopyToClipboardButton from '@/legacy-components/CopyToClipboardButton';

interface Props extends React.ComponentPropsWithRef<'div'> {
  address: string;
  shortenAddress?: boolean;
  className?: string;
}

const AddressWithCopyUI = ({ address, shortenAddress = true, className, ...rest }: Props): JSX.Element => {
  return (
    <div className={clsx('flex', 'items-center', 'space-x-1', 'font-medium', className)} {...rest}>
      <span>{shortenAddress ? shortAddress(address) : address}</span>
      <CopyToClipboardButton text={address} />
    </div>
  );
};

export default AddressWithCopyUI;
