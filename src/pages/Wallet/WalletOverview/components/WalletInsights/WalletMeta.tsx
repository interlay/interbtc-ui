import { mergeProps } from '@react-aria/utils';
import { useDispatch } from 'react-redux';
import { useCopyToClipboard } from 'react-use';

import { ArrowTopRightOnSquare, DocumentDuplicate, PencilSquare } from '@/assets/icons';
import { showAccountModalAction } from '@/common/actions/general.actions';
import { shortAddress } from '@/common/utils/utils';
import { CTA, Dd, DlGroup, Dt, Flex, FlexProps, P, Tooltip, WalletIcon } from '@/component-library';
import { AuthCTA } from '@/components';
import { useSubstrateState } from '@/lib/substrate';
import { useCopyTooltip } from '@/utils/hooks/use-copy-tooltip';

type WalletMetaProps = FlexProps;

const WalletMeta = (props: WalletMetaProps): JSX.Element => {
  const { selectedAccount } = useSubstrateState();
  const dispatch = useDispatch();

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
    <Flex direction='column' gap='spacing4' {...props}>
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
            <CTA
              aria-label='copy address to clipboard'
              variant='text'
              size='x-small'
              {...mergeProps(buttonProps, { onPress: handleCopy })}
            >
              <DocumentDuplicate size='s' color='tertiary' />
            </CTA>
          </Tooltip>
          <CTA
            aria-label='open select account modal'
            onPress={() => dispatch(showAccountModalAction(true))}
            variant='text'
            size='x-small'
          >
            <PencilSquare size='s' color='tertiary' />
          </CTA>
          <CTA aria-label='view transaction history' variant='text' size='x-small'>
            <ArrowTopRightOnSquare size='s' color='tertiary' />
          </CTA>
        </Flex>
      </Flex>
      <Flex gap='spacing4'>
        <CTA size='small'>Fund Wallet</CTA>
        <CTA size='small'>View History</CTA>
      </Flex>
    </Flex>
  );
};

export { WalletMeta };
