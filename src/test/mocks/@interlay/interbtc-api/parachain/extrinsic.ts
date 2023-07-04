import { ExtrinsicData } from '@interlay/interbtc-api';

const DEFAULT_EXTRINSIC: ExtrinsicData = {
  extrinsic: ({
    signAndSend: jest.fn().mockImplementation(async (_a, _b, cb) => {
      return new Promise((resolve) => {
        resolve(jest.fn());

        setTimeout(() => {
          cb({ status: { isReady: true, type: 'Ready' } });
        }, 1);
        setTimeout(() => {
          cb({ status: { isReady: true, isInBlock: true, type: 'InBlock' } });
        }, 2);
        setTimeout(() => {
          cb({ status: { isReady: true, isInBlock: true, isFinalized: true, type: 'Finalized' } });
        }, 3);
      });
    })
  } as unknown) as ExtrinsicData['extrinsic']
};

export { DEFAULT_EXTRINSIC };