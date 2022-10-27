import { TFunction } from 'i18next';
import * as z from 'zod';

/**
 * This type contains the structure of a validation
 * @function validate contains one or multiple conditions
 * that should return true if `params` respect condition restrictions
 * @function issue should return the necessary meta data for zod `addIssue`
 * and it's here also where error `message` is declared
 * @note This kind of validation should only be used in reusable validations
 */
type Validation<V = unknown, I = unknown> = {
  validate: (params: V) => boolean;
  issue: (t: TFunction, params?: I) => z.IssueData;
};

export type { Validation };
