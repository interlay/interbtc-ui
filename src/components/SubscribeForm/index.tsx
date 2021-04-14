
import clsx from 'clsx';

import InterlayInput from 'components/UI/InterlayInput';
import InterlayButton from 'components/UI/InterlayButton';

interface Props {
  endpoint: string;
}

// TODO: should add validation & UX
const SubscribeForm = ({ endpoint }: Props): JSX.Element => (
  <form
    className={clsx(
      'flex',
      'w-full',
      'max-w-sm',
      'space-x-3'
    )}
    action={endpoint}
    method='post'>
    <InterlayInput placeholder='your@email.com' />
    <InterlayButton
      variant='contained'
      color='primary'
      type='submit'>
      subscribe
    </InterlayButton>
  </form>
);

export default SubscribeForm;
