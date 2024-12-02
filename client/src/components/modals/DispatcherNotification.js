import React from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { deleteRequest } from '../../http/dispatcherRequestApi';

function DispatcherNotification({ show, onHide, request }) {
    const handleDelete = async (requestId) => {
        try {
            await deleteRequest(requestId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Уведомление
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    request &&
                    <p>{request.status == 'approved' ? "Ваша заявка одобрена" : "Ваша заявка отклонена"}</p>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={() => { handleDelete(request.id); onHide(); }}>OK</Button>
                <Button variant="outline" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DispatcherNotification;
