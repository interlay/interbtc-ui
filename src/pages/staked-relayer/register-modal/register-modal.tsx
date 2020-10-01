import React, { ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

type RegisterModalType = {
  onClose: () => void;
  show: boolean;
};

type RegisterForm = {
  stake: number;
};

export default function ReportModal(props: RegisterModalType): ReactElement {
  const { register, handleSubmit, errors } = useForm<RegisterForm>();
  const polkaBTC = useSelector((state: StoreType) => state.api);
  const stakedRelayer = useSelector((state: StoreType) => state.relayer);

  const onSubmit = handleSubmit(async ({ stake }) => {
    try {
      await stakedRelayer.registerStakedRelayer(stake);
    } catch (error) {
      console.log(error);
    }
    props.onClose();
  });

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">Stake</div>
            <div className="col-12">
              <input
                name="stake"
                type="number"
                className={
                  "custom-input" + (errors.stake ? " error-borders" : "")
                }
                ref={register({
                  // TODO: validate minimum
                  required: true,
                })}
              ></input>
              {errors.stake && (
                <div className="input-error">
                  {errors.stake.type === "required"
                    ? "stake is required"
                    : errors.stake.message}
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
