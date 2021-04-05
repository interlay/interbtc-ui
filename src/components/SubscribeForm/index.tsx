
import clsx from 'clsx';

import InterlayInput from 'components/UI/InterlayInput';
import InterlayButton from 'components/UI/InterlayButton';

const SubscribeForm = () => (
  <form
    className={clsx(
      'flex',
      'w-full',
      'max-w-sm',
      'space-x-3'
    )}>
    <InterlayInput placeholder='your@email.com' />
    <InterlayButton
      variant='contained'
      color='primary'
      type='button'>
      subscribe
    </InterlayButton>
  </form>
);

export default SubscribeForm;
