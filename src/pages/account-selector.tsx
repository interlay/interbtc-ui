import React, { useState } from "react";
import { ReactElement } from "react";
import { Button, Container, Modal, Form } from "react-bootstrap";

type AccountSelectorProps = {
    selected?: string;
    accounts?: string[];
    onSelected: (account: string) => void | Promise<void>;
};

export default function AccountSelector(props: AccountSelectorProps): ReactElement {
    const [accountValue, setAccountValue] = useState(props.selected || "");

    return (
        <Container>
            {" "}
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Select account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please select an account:</p>
                {(props.accounts || []).map((account: string) => (
                    <Form.Check
                        type="radio"
                        name="account"
                        key={account}
                        label={account}
                        value={account}
                        checked={accountValue === account}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e: any) => setAccountValue(e.currentTarget.value)}
                    />
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-primary float-right" onClick={() => props.onSelected(accountValue)}>
                    Select account
                </Button>
            </Modal.Footer>
        </Container>
    );
}
