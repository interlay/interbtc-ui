import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { NumberInput } from '@/component-library';

const validateString = z.string().min(1, { message: 'Required' });

const schema = z.object({
  testInput: validateString
});

type AddCollateralForm = z.infer<typeof schema>;

const AddCollateral = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddCollateralForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: AddCollateralForm) => console.log(data, errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <NumberInput {...register('testInput')} />
      {/* <NumberInput error={errors?.testInput?.message} {...register('testInput')} /> */}
      <input type='submit' />
    </form>
  );
};

export { AddCollateral };
