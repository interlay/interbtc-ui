const query = (where?: string): string => `
  {
    issuesConnection(orderBy: id_ASC, where: {status_eq: Completed ${where ? `, ${where}` : ''}}) {
      totalCount
    }
  }
`;

export default query;
