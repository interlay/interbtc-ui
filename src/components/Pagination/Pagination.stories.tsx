
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';

import Pagination, { Props } from './';

const Template: Story<Props> = args => {
  const [page, setPage] = React.useState(1);

  const handleChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Pagination
      {...args}
      current={page}
      onChange={handleChange} />
  );
};

const Default = Template.bind({});
Default.args = {
  defaultCurrent: 3,
  total: 860,
  pageSize: 10
};

export {
  Default
};

export default {
  title: 'Pagination',
  component: Pagination
} as Meta;
