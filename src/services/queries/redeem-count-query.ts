const redeemCountQuery = (where?: string): string => `
  {
    redeemsConnection(orderBy: id_ASC, where: {${where ? `, ${where}` : ''}}) {
      totalCount
    }
  }
`;

export default redeemCountQuery;
