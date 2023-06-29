import { ExtrinsicData } from '@interlay/interbtc-api';

const DEFAULT_EXTRINSIC: ExtrinsicData = {
  extrinsic: ({
    signAndSend: jest.fn().mockImplementation((_, cb) => {
      cb({ status: { isReady: true, isUsurped: true } });
      return jest.fn();
    })
  } as unknown) as ExtrinsicData['extrinsic']
};

export { DEFAULT_EXTRINSIC };
