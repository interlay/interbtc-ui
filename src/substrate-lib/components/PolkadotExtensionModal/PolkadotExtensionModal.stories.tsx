
// ray test touch <<
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';

import PolkadotExtensionModal, { Props } from '.';

const Template: Story<Props> = args => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <button onClick={handleOpen}>
        Open
      </button>
      <PolkadotExtensionModal
        {...args}
        open={open} />
    </>
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'PolkadotExtensionModal',
  component: PolkadotExtensionModal
} as Meta;
// ray test touch >>
