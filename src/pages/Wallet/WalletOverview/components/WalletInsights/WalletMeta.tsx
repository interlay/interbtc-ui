import { mergeProps } from '@react-aria/utils';
import { useCopyToClipboard } from 'react-use';

import { ArrowTopRightOnSquare, DocumentDuplicate, PencilSquare } from '@/assets/icons';
import { shortAddress } from '@/common/utils/utils';
import { CTA, Dd, DlGroup, Dt, Flex, P, Tooltip, WalletIcon } from '@/component-library';
import { AuthCTA } from '@/components';
import { useSubstrateState } from '@/lib/substrate';
import { useCopyTooltip } from '@/utils/hooks/use-copy-tooltip';

const WalletMeta = (): JSX.Element => {
  const { selectedAccount } = useSubstrateState();

  const [, copy] = useCopyToClipboard();
  const { buttonProps, tooltipProps } = useCopyTooltip();

  if (!selectedAccount) {
    return (
      <Flex direction='column' gap='spacing4' alignItems='flex-start'>
        <P weight='bold'>No Account Connected</P>
        <AuthCTA size='small'>Connect Account</AuthCTA>
      </Flex>
    );
  }

  const handleCopy = () => copy(selectedAccount.address);

  return (
    <Flex direction='column' gap='spacing4'>
      <Flex alignItems='center' justifyContent='space-between' gap='spacing2'>
        <Flex alignItems='center' gap='spacing2'>
          <WalletIcon size='xl' name={selectedAccount.meta.source as string} />
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <Dt weight='bold' color='primary'>
              {selectedAccount.meta.name}
            </Dt>
            <Dd>{shortAddress(selectedAccount.address)}</Dd>
          </DlGroup>
        </Flex>
        <Flex>
          <Tooltip {...tooltipProps}>
            <CTA variant='text' size='x-small' {...mergeProps(buttonProps, { onPress: handleCopy })}>
              <DocumentDuplicate size='s' color='tertiary' />
            </CTA>
          </Tooltip>
          <CTA variant='text' size='x-small'>
            <PencilSquare size='s' color='tertiary' />
          </CTA>
          <CTA variant='text' size='x-small'>
            <ArrowTopRightOnSquare size='s' color='tertiary' />
          </CTA>
        </Flex>
      </Flex>
      <Flex gap='spacing4'>
        <CTA size='small'>Fund Wallet</CTA> <CTA size='small'>View History</CTA>
      </Flex>
    </Flex>
  );
};

export { WalletMeta };
