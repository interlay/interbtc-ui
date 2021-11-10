const query = `
  {
    issuesConnection(orderBy: id_ASC) {
      totalCount
    }
  }
`;

export default query;
