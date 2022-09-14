const mockApiCreateType = jest.fn(<T extends unknown>(type: string, data: T) => data);

export { mockApiCreateType };
