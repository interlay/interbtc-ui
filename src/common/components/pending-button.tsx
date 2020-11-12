import React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { FaHourglass } from "react-icons/fa";

export default class ButtonMaybePending extends React.Component<
    ButtonProps & {
        isPending: boolean;
    }
> {
    render() {
        return (
            <Button disabled={this.props.isPending || this.props.disabled} {...this.props}>
                {(this.props.isPending && <FaHourglass></FaHourglass>) || this.props.children}
            </Button>
        );
    }
}
