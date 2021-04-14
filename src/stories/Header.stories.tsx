
import {
  Story,
  Meta
} from '@storybook/react';

import { Header, HeaderProps } from './Header';

const Template: Story<HeaderProps> = (args: HeaderProps) => <Header {...args} />;

const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {}
};

const LoggedOut = Template.bind({});
LoggedOut.args = {};

export {
  LoggedIn,
  LoggedOut
};

export default {
  title: 'Example/Header',
  component: Header
} as Meta;
