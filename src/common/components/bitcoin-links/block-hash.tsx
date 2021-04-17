import React from 'react';
import * as constants from '../../../constants';
import InterlayLink from 'components/UI/InterlayLink';

export default class BitcoinBlockHash extends React.Component<{
  blockHash: string;
}> {
  render(): JSX.Element {
    return (
      <InterlayLink
        href={
          (constants.BTC_MAINNET ? constants.BTC_EXPLORER_BLOCK_API : constants.BTC_TEST_EXPLORER_BLOCK_API) +
          this.props.blockHash
        }
        target='_blank'
        rel='noopener noreferrer'>
        {this.props.blockHash}
      </InterlayLink>
    );
  }
}
