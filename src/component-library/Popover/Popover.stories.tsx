import { Meta, Story } from '@storybook/react';

import { CTA } from '../CTA';
import { P } from '../Text';
import { Placement } from '../utils/prop-types';
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverHeader, PopoverProps, PopoverTrigger } from '.';

const Template: Story<PopoverProps & { placement: Placement }> = ({ placement, ...args }) => {
  return (
    <Popover {...args}>
      <PopoverTrigger>
        <CTA style={{ [placement]: 0, position: 'absolute', margin: 20 }}>Open Popover</CTA>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>Popover Header</PopoverHeader>
        <PopoverBody>
          <P>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
            quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus
            ac facilisis in, egestas eget quam.
          </P>
        </PopoverBody>
        <PopoverFooter>
          <CTA>Confirm</CTA>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

const Default = Template.bind({});
Default.args = { placement: 'right' };

export { Default };

export default {
  title: 'Overlays/Popover',
  component: Popover
} as Meta;
