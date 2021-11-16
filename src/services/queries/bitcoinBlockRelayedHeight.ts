const query = (): string => `
  query ($backingHeight: Int!) {
    relayedBlocks(orderBy: backingHeight_DESC, where: {backingHeight_eq: $backingHeight}) {
      relayedAtHeight {
        active
      }
    }
  }
`;

export default query;
