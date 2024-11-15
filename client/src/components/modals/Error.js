import React from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';

function ErrorModal({ show, onHide, error }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Ошибка
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert className='mt-3 p-1 text-center' variant='danger'>{error}</Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ErrorModal;
