import '@testing-library/jest-dom';

jest.mock('../../../../utils/helpers/extrinsic', () => {
  const actualModule = jest.requireActual('../../../../utils/helpers/extrinsic');

  return {
    ...actualModule,
    submitExtrinsic: jest.fn(),
    submitExtrinsicPromise: jest.fn(),
    getExtrinsicStatus: jest.fn()
  };
});
