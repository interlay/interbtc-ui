
import {
  Story,
  Meta
} from '@storybook/react';

import IconButton, { Props } from '.';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';
import clsx from 'clsx';

const Template: Story<Props> = args => <IconButton {...args} />;

const Default = Template.bind({});
Default.args = {
  className: clsx(
    'w-12',
    'h-12'
  ),
  children: (
    <CloseIcon
      className='text-currentColor'
      width={18}
      height={18} />
  )
};

export {
  Default
};

export default {
  title: 'IconButton',
  component: IconButton
} as Meta;
