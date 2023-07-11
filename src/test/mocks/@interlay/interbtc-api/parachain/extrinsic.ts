import { ExtrinsicData } from '@interlay/interbtc-api';

const DEFAULT_EXTRINSIC: ExtrinsicData = {
  extrinsic: ({
    signAndSend: jest.fn().mockImplementation(async (_a, _b, cb) => {
      return new Promise((resolve) => {
        resolve(jest.fn());

        setTimeout(() => {
          cb({ status: { isReady: true, isInBlock: true, isFinalized: true, type: 'Finalized' } });
        }, 1);
      });
    })
  } as unknown) as ExtrinsicData['extrinsic']
};

export { DEFAULT_EXTRINSIC };
