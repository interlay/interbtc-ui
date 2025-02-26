import i18n from 'i18next';

import yup, { AddressType } from '../yup.custom';

const BOB_RECIPIENT_FIELD = 'bob-destination';

type BobFormData = {
  [BOB_RECIPIENT_FIELD]?: string;
};

const bobSchema = (): yup.ObjectSchema<any> =>
  yup.object().shape({
    [BOB_RECIPIENT_FIELD]: yup
      .string()
      .required(i18n.t('forms.please_enter_your_field', { field: 'recipient' }))
      .address(AddressType.ETHEREUM)
  });

export { BOB_RECIPIENT_FIELD, bobSchema };
export type { BobFormData };
