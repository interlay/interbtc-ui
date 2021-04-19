import clsx from 'clsx';
import InterlayButton from 'components/UI/InterlayButton';
import InterlayInput from 'components/UI/InterlayInput';

interface Props {
  endpoint: string;
}

// TODO: should add validation & UX
const SubscribeForm = ({ endpoint }: Props): JSX.Element => (

  <div id='mc_embed_signup'>
    <form
      action={endpoint}
      method='post'
      id='mc-embedded-subscribe-form'
      name='mc-embedded-subscribe-form'
      target='_blank'
      noValidate>
      <div
        id='mc_embed_signup_scroll'>
        <div
          className={clsx(
            'flex',
            'w-full',
            'max-w-sm',
            'space-x-3'
          )}>
          <InterlayInput
            placeholder='your@email.com'
            id='mce-EMAIL'
            type='email'
            name='EMAIL' />
          <InterlayButton
            variant='contained'
            color='primary'
            type='submit'
            id='mc-embedded-subscribe'>
              subscribe
          </InterlayButton>
        </div>
        {/* do not remove this  */}
        {/* protection from bots*/}
        <div
          style={{ position: 'absolute', left: '-5000px' }}
          aria-hidden='true'><input
            type='text'
            name='b_4c3c3f21d3ec4c3ed94ea7353_ad217abce9'
            tabIndex={-1}
            value='' />
        </div>
      </div>
    </form>
  </div>

);

export default SubscribeForm;
