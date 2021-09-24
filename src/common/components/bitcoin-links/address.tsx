// ray test touch <<
import React from 'react';
import { shortAddress } from '../../../common/utils/utils';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_ADDRESS_API } from 'config/bitcoin';

export default class BitcoinAddress extends React.Component<{
  btcAddress: string;
  shorten?: boolean;
}> {
  render(): JSX.Element {
    return (
      <InterlayLink
        href={BTC_ADDRESS_API + this.props.btcAddress}
        target='_blank'
        rel='noopener noreferrer'>
        {this.props.shorten && this.props.btcAddress ?
          shortAddress(this.props.btcAddress) :
          this.props.btcAddress}
      </InterlayLink>
    );
  }
}
// ray test touch >>
