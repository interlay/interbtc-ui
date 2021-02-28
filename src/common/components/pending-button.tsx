import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { FaHourglass } from 'react-icons/fa';

export default class ButtonMaybePending extends React.Component<
  ButtonProps & {
    // ray test touch <
    isPending?: boolean;
    // isPending: boolean;
    // ray test touch >
  }
> {
  render() {
    const attributes = { ...this.props };
    delete attributes.isPending;
    return (
      <Button
        disabled={this.props.isPending || this.props.disabled}
        {...attributes}>
        {(this.props.isPending && <FaHourglass></FaHourglass>) || this.props.children}
      </Button>
    );
  }
}
