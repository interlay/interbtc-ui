import React from 'react';
import { shortTxId } from '../../../common/utils/utils';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_ADDRESS_API } from 'config/blockchain';

export default class BitcoinTransaction extends React.Component<{
  txId: string;
  shorten?: boolean;
}> {
  render(): JSX.Element {
    return (
      <div>
        {this.props.txId ? (
          <InterlayLink
            href={BTC_ADDRESS_API + this.props.txId}
            target='_blank'
            rel='noopener noreferrer'>
            {this.props.shorten ? shortTxId(this.props.txId) : this.props.txId}
          </InterlayLink>
        ) : (
          'Pending...'
        )}
      </div>
    );
  }
}
