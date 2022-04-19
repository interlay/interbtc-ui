const composableExchangeRateSubquery = (name: string, where?: string): string => `
    ${name}: oracleUpdates(
      where: {type_eq: ExchangeRate, ${where ? `, ${where}` : ''}},
      orderBy: timestamp_DESC,
      limit: 1
    ) {
      oracleId
      timestamp
      updateValue
      height {
        absolute
        active
      }
    }
`;

const oracleExchangeRatesQuery = (where?: string): string => `
  {
    ${composableExchangeRateSubquery('oracleUpdates', where)}
  }
`;

export {
  composableExchangeRateSubquery
};

export default oracleExchangeRatesQuery;
