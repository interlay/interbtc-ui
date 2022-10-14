import { TFunction } from 'react-i18next';
import * as z from 'zod';

type ValidationFunction<T = unknown> = (ctx: z.RefinementCtx, t: TFunction, params: T) => void;

export type { ValidationFunction };
