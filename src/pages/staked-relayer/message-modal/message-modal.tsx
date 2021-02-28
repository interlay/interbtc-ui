import React, { ReactElement } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { StatusUpdate } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';

type MessageModalProps = {
  onClose: () => void;
  show: boolean;
  statusUpdate: StatusUpdate;
};

export default function MessageModal(props: MessageModalProps): ReactElement {
  const { t } = useTranslation();

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>{t('message')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.statusUpdate && (
          <React.Fragment>
            <div className='row'>
              <div className='col-xl-9 col-lg-8 col-md-6'>
                {props.statusUpdate.message === '' ? '-' : props.statusUpdate.message}
              </div>
            </div>
          </React.Fragment>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={props.onClose}>
          {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
