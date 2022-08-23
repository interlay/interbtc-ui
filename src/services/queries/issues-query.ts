const issuesQuery = (where?: string): string => `
  query ($limit: Int!, $offset: Int) {
    issues(orderBy: request_timestamp_DESC, limit: $limit, offset: $offset, where:{${where ? `, ${where}` : ''}}) {
      id
      request {
        amountWrapped
        bridgeFeeWrapped
        timestamp
        height {
          absolute
          active
        }
      }
      userParachainAddress
      vault {
        accountId
        collateralToken {
          ... on ForeignAsset {
            asset
          }
          ... on NativeToken {
            token
          }
        }
        wrappedToken {
          ... on ForeignAsset {
            asset
          }
          ... on NativeToken {
            token
          }
        }
      }
      vaultBackingAddress
      vaultWalletPubkey
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
        bridgeFeeWrapped
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

export default issuesQuery;
