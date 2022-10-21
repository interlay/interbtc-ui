import { TFunction } from 'i18next';
import * as z from 'zod';

type Validation<T = unknown> = {
  validate: (params: T) => boolean;
  issue: (t?: TFunction) => z.IssueData;
};

export type { Validation };
