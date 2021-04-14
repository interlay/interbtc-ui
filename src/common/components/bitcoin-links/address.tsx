import React from 'react';
import * as constants from '../../../constants';
import { shortAddress } from '../../../common/utils/utils';
import InterlayLink from 'components/UI/InterlayLink';

export default class BitcoinAddress extends React.Component<{
  btcAddress: string;
  shorten?: boolean;
}> {
  render(): JSX.Element {
    return (
      <InterlayLink
        href={
          (constants.BTC_MAINNET ?
            constants.BTC_EXPLORER_ADDRESS_API :
            constants.BTC_TEST_EXPLORER_ADDRESS_API) + this.props.btcAddress
        }
        target='_blank'
        rel='noopener noreferrer'>
        {this.props.shorten && this.props.btcAddress ?
          shortAddress(this.props.btcAddress) :
          this.props.btcAddress}
      </InterlayLink>
    );
  }
}
