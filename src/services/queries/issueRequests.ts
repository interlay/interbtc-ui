const query = (where?: string): string => `
  query ($limit: Int!, $offset: Int) {
    issues(orderBy: request_timestamp_DESC, limit: $limit, offset: $offset, where:{${where ? `, ${where}` : ''}}) {
      id
      request {
        amountWrapped
        timestamp
        height {
          absolute
          active
        }
      }
      userParachainAddress
      vaultParachainAddress
      vaultBackingAddress
      vaultWalletPubkey
      bridgeFee
      griefingCollateral
      status
      refund {
        amountPaid
        btcAddress
        btcFee
        executionHeight {
          absolute
          active
        }
        executionTimestamp
        id
        requestHeight {
          absolute
          active
        }
        requestTimestamp
      }
      execution {
        height {
          absolute
          active
        }
        amountWrapped
        timestamp
      }
      cancellation {
        timestamp
        height {
          absolute
          active
        }
      }
    }
  }
`;

export default query;
