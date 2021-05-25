
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';

import ErrorModal, { Props } from './';

const Template: Story<Props> = args => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={handleOpen}>
        Open
      </button>
      <ErrorModal
        {...args}
        open={open}
        onClose={handleClose} />
    </>
  );
};

const Default = Template.bind({});
Default.args = {
  title: 'Title',
  description: 'Description'
};

export {
  Default
};

export default {
  title: 'ErrorModal',
  component: ErrorModal
} as Meta;
