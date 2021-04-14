
import {
  Story,
  Meta
} from '@storybook/react';

import { Page, PageProps } from './Page';
import * as HeaderStories from './Header.stories';

const Template: Story<PageProps> = args => <Page {...args} />;

const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args
};

const LoggedOut = Template.bind({});
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args
};

export {
  LoggedIn,
  LoggedOut
};

export default {
  title: 'Example/Page',
  component: Page
} as Meta;
