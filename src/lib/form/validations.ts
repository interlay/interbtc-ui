/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TFunction } from 'react-i18next';
import * as Yup from 'yup';

type RequiredParams = {
  value?: string | number;
  name: string;
};

const required = () => {
  return Yup.mixed<string | number>().test('required', (value, ctx) => {
    if (value === undefined || value === '') {
      const { t } = ctx.options.context as { t: TFunction };

      const isNumber = typeof value === 'number';

      const translationKey = isNumber ? 'forms.please_enter_the_amount_to' : 'forms.please_enter_your_field';
      const message = t(translationKey, { field: ctx.path });

      return ctx.createError({ message });
    }

    return true;
  });
};

export { required };
export type { RequiredParams };
