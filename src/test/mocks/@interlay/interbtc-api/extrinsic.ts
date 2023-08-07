import { ExtrinsicData } from '@interlay/interbtc-api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

const EXTRINSIC: SubmittableExtrinsic<'promise', ISubmittableResult> = ({
  signAsync: jest.fn().mockResolvedValue({
    send: jest.fn().mockImplementation(async (callback) => {
      return new Promise((resolve) => {
        resolve(jest.fn());

        setTimeout(() => {
          callback({ status: { isReady: true, isInBlock: true, isFinalized: true, type: 'Finalized' } });
        }, 1);
      });
    }),
    hadDryRun: false
  })
} as unknown) as SubmittableExtrinsic<'promise', ISubmittableResult>;

const EXTRINSIC_DATA: ExtrinsicData = {
  extrinsic: EXTRINSIC
};

export { EXTRINSIC, EXTRINSIC_DATA };
