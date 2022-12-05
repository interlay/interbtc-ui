import clsx from 'clsx';

import { shortAddress } from '@/common/utils/utils';
import CopyToClipboardButton from '@/components/CopyToClipboardButton';

interface Props {
  address: string;
  className?: string;
}

const AddressWithCopyUI = ({ address, className }: Props): JSX.Element => {
  return (
    <div className={clsx('flex', 'items-center', 'space-x-1', 'font-medium', className)}>
      <span>{shortAddress(address)}</span>
      <CopyToClipboardButton text={address} />
    </div>
  );
};

export default AddressWithCopyUI;
