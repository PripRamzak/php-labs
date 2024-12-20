import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Image, Modal } from 'react-bootstrap';
import { fetchAirlineImage, updateAirline } from '../../http/airlinesApi';

function UpdateAirline({ show, onHide, airline }) {
    const [name, setName] = useState('')
    const [img, setImg] = useState('')
    const [file, setFile] = useState(null)
    const [alert, setAlert] = useState('')

    const handleOnShow = () => {
        if (!Object.keys(airline).length !== 0) {
            setName(airline.name);
        }
    }

    const loadImage = async () => {
        if (airline) {
            const airline_img = await fetchAirlineImage(airline.id);
            console.log(airline_img);
            if (airline_img) {
                const blob = new Blob([airline_img], { type: 'image/jpeg' }); // Убедитесь, что тип изображения правильный
                const reader = new FileReader();

                reader.onloadend = () => {
                    setImg(reader.result);
                };

                reader.readAsDataURL(blob);
            }
        }
    };

    const update = async () => {
        try {
            const formData = new FormData()
            formData.append('updated_id', airline.id)
            formData.append('name', name.trim())
            if (file)
                formData.append('img', file)
            const result = await updateAirline(formData);
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            throw new Error(e.message);
        }

        setAlert('');

        onHide();
    }

    useEffect(() => {
        loadImage();
    }, [airline])

    return (
        <Modal
            show={show}
            onHide={onHide}
            onShow={handleOnShow}
            size="lg"
            centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Обновить инфорамцию о авиакомпании
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='d-flex flex-column'>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} placeholder={'Название города'} />
                    <Form.Label className='mt-2'>Изображение авиакомпании</Form.Label>
                    <Form.Control type='file' onChange={(e) => setFile(e.target.files[0])} />
                    <Form.Label className='mt-2'>Изображение авиакомпании сейчас</Form.Label>
                    {img &&
                        <Image className='mt-1' width={300} height={200} src={img} />}
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>

                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={onHide}>Закрыть</Button>
                <Button variant="outline" onClick={update}>Обновить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateAirline;
