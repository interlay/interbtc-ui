import React from 'react';
import * as constants from '../../../constants';

export default class BitcoinBlockHash extends React.Component<{
  blockHash: string;
}> {
  render() {
    return (
      <a
        href={
          (constants.BTC_MAINNET ? constants.BTC_EXPLORER_BLOCK_API : constants.BTC_TEST_EXPLORER_BLOCK_API) +
          this.props.blockHash
        }
        target='_blank'
        rel='noopener noreferrer'>
        {this.props.blockHash}
      </a>
    );
  }
}
