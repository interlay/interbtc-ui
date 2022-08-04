const btcBlocksQuery = (where?: string): string => `
  query ($limit: Int!, $offset: Int) {
    relayedBlocks(
      orderBy: backingHeight_DESC,
      limit: $limit,
      offset: $offset,
      where:{${where ? `, ${where}` : ''}}
    ) {
      relayedAtHeight {
        absolute
        active
      }
      blockHash
      backingHeight
      timestamp
      relayer
    }
  }
`;

export default btcBlocksQuery;
