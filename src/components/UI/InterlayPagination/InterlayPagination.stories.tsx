
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayPagination, { Props } from './';

const PER_PAGE = 10;

const Template: Story<Props> = args => {
  const handlePageChange = ({ selected }: { selected: number }) => {
    const offset = Math.ceil(selected * PER_PAGE);
    console.log('[handlePageChange] selected => ', selected);
    console.log('[handlePageChange] offset => ', offset);
  };

  return (
    <InterlayPagination
      {...args}
      onPageChange={handlePageChange} />
  );
};

const Default = Template.bind({});
Default.args = {
  pageCount: 100,
  marginPagesDisplayed: 2,
  pageRangeDisplayed: 5
};

export {
  Default
};

export default {
  title: 'UI/InterlayPagination',
  component: InterlayPagination
} as Meta;
