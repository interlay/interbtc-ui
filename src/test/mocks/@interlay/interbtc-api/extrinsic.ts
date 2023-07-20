import { ExtrinsicData } from '@interlay/interbtc-api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

const EXTRINSIC: SubmittableExtrinsic<'promise', ISubmittableResult> = ({
  signAndSend: jest.fn().mockImplementation(async (_a, _b, cb) => {
    return new Promise((resolve) => {
      resolve(jest.fn());

      setTimeout(() => {
        cb({ status: { isReady: true, isInBlock: true, isFinalized: true, type: 'Finalized' } });
      }, 1);
    });
  })
} as unknown) as SubmittableExtrinsic<'promise', ISubmittableResult>;

const EXTRINSIC_DATA: ExtrinsicData = {
  extrinsic: EXTRINSIC
};

export { EXTRINSIC, EXTRINSIC_DATA };
