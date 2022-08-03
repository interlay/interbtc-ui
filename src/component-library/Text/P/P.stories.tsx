import { Meta, Story } from '@storybook/react';

import { TextProps } from '../types';
import { P } from '.';

const Template: Story<TextProps> = (args) => <P {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus maiores cumque quidem voluptate odit explicabo asperiores itaque tenetur illum iusto possimus quae, sequi natus corporis voluptas cupiditate ipsa eius officiis?'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus maiores cumque quidem voluptate odit explicabo asperiores itaque tenetur illum iusto possimus quae, sequi natus corporis voluptas cupiditate ipsa eius officiis?'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus maiores cumque quidem voluptate odit explicabo asperiores itaque tenetur illum iusto possimus quae, sequi natus corporis voluptas cupiditate ipsa eius officiis?'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/P',
  component: P
} as Meta;
