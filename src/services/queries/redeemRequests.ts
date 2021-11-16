const query = (where?: string): string => `
  query ($limit: Int!, $offset: Int) {
    redeems(orderBy: request_timestamp_DESC, limit: $limit, offset: $offset, where:{${where ? `, ${where}` : ''}}) {
      id
      request {
        requestedAmountBacking
        timestamp
        height {
          absolute
          active
        }
      }
      userParachainAddress
      vaultParachainAddress
      userBackingAddress
      bridgeFee
      btcTransferFee
      collateralPremium
      status
      execution {
        height {
          absolute
          active
        }
        timestamp
      }
      cancellation {
        timestamp
        slashedCollateral
        reimbursed
        height {
          absolute
          active
        }
      }
    }
  }
`;

export default query;
