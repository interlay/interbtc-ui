import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Grid, GridItem } from './';

export const Default: ComponentStory<typeof Grid> = () => (
  <Grid>
    <GridItem mobile={{ span: 4, start: 1 }} desktop={{ span: 4, start: 4 }}>
      <h2>Grid content</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis nam minima non modi consequuntur corporis est
        itaque, exercitationem amet, fugiat optio, facilis repellendus inventore vero perferendis. Possimus porro eaque
        facere.
      </p>
    </GridItem>
  </Grid>
);

export default {
  title: 'Layout/Grid',
  component: Grid,
  subcomponents: { GridItem }
} as ComponentMeta<typeof Grid>;
