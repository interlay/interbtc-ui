// ray test touch <<
import React from 'react';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_BLOCK_API } from 'config/bitcoin';

export default class BitcoinBlockHash extends React.Component<{
  blockHash: string;
}> {
  render(): JSX.Element {
    return (
      <InterlayLink
        href={BTC_BLOCK_API + this.props.blockHash}
        target='_blank'
        rel='noopener noreferrer'>
        {this.props.blockHash}
      </InterlayLink>
    );
  }
}
// ray test touch >>
