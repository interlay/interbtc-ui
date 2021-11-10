const query = `
  query ($limit: Int!, $offset: Int) {
    redeems(orderBy: createdAt_ASC, limit: $limit, offset: $offset) {
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
