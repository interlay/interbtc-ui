import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Grid, GridItem } from './';

export const OneItem: ComponentStory<typeof Grid> = (args) => (
  <Grid {...args}>
    <GridItem mobile={{ span: 1, start: 2 }} desktop={{ span: 2, start: 3 }} />
  </Grid>
);

export default {
  title: 'Layout/Grid',
  component: Grid,
  subcomponents: { GridItem }
} as ComponentMeta<typeof Grid>;
