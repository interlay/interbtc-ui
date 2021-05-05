
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayButton, {
  Props,
  COLOR_VALUES,
  VARIANT_VALUES
} from './';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';

const Template: Story<Props> = args => <InterlayButton {...args} />;

const ContainedDefault = Template.bind({});
ContainedDefault.args = {
  children: 'InterlayButton',
  color: 'default',
  variant: 'contained'
};

const ContainedPrimary = Template.bind({});
ContainedPrimary.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'contained'
};

const ContainedSecondary = Template.bind({});
ContainedSecondary.args = {
  children: 'InterlayButton',
  color: 'secondary',
  variant: 'contained'
};

const ContainedPrimaryWithStartIcon = Template.bind({});
ContainedPrimaryWithStartIcon.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'contained',
  startIcon: (
    <BitcoinLogoIcon
      width={20}
      height={20} />
  )
};

const ContainedSecondaryWithStartIcon = Template.bind({});
ContainedSecondaryWithStartIcon.args = {
  children: 'InterlayButton',
  color: 'secondary',
  variant: 'contained',
  startIcon: (
    <BitcoinLogoIcon
      width={20}
      height={20} />
  )
};

const ContainedDisabled = Template.bind({});
ContainedDisabled.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'contained',
  disabled: true
};

const TextDefault = Template.bind({});
TextDefault.args = {
  children: 'InterlayButton',
  color: 'default',
  variant: 'text'
};

const TextPrimary = Template.bind({});
TextPrimary.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'text'
};

const TextSecondary = Template.bind({});
TextSecondary.args = {
  children: 'InterlayButton',
  color: 'secondary',
  variant: 'text'
};

const TextDisabled = Template.bind({});
TextDisabled.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'text',
  disabled: true
};

const OutlinedDefault = Template.bind({});
OutlinedDefault.args = {
  children: 'InterlayButton',
  color: 'default',
  variant: 'outlined'
};

const OutlinedPrimary = Template.bind({});
OutlinedPrimary.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'outlined'
};

const OutlinedSecondary = Template.bind({});
OutlinedSecondary.args = {
  children: 'InterlayButton',
  color: 'secondary',
  variant: 'outlined'
};

const OutlinedDisabled = Template.bind({});
OutlinedDisabled.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'outlined',
  disabled: true
};

export {
  ContainedDefault,
  ContainedPrimary,
  ContainedSecondary,
  ContainedPrimaryWithStartIcon,
  ContainedSecondaryWithStartIcon,
  ContainedDisabled,
  TextDefault,
  TextPrimary,
  TextSecondary,
  TextDisabled,
  OutlinedDefault,
  OutlinedPrimary,
  OutlinedSecondary,
  OutlinedDisabled
};

export default {
  title: 'UI/InterlayButton',
  component: InterlayButton,
  argTypes: {
    color: {
      control: {
        type: 'radio',
        options: COLOR_VALUES
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: VARIANT_VALUES
      }
    }
  }
} as Meta;
