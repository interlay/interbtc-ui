import { TFunction } from 'i18next';
import * as z from 'zod';

type Validation<V = unknown, I = unknown> = {
  validate: (params: V) => boolean;
  issue: (t: TFunction, params?: I) => z.IssueData;
};

export type { Validation };
