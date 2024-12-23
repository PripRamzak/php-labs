import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Image, Modal } from 'react-bootstrap';
import { fetchAirlineImage, updateAirline } from '../../http/airlinesApi';

function UpdateAirline({ show, onHide, airline }) {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [file, setFile] = useState(null)
    const [alert, setAlert] = useState('')

    const handleOnShow = () => {
        if (!Object.keys(airline).length !== 0) {
            setName(airline.name);
        }
    }

    const checkFileAccess = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new window.Image();
                img.src = e.target.result;

                img.onerror = () => {
                    reject(new Error('Файл изображения повреждён'));
                };
                img.onload = () => {
                    resolve(true); // Файл успешно прочитан и изображение корректно
                }; // Файл успешно прочитан
            };

            reader.onerror = () => {
                // Здесь мы не можем различить ошибки, но можем уведомить пользователя
                reject(new Error('Не удалось прочитать файл. Он может быть удалён или у вас нет доступа к нему'));
            };

            // Пытаемся прочитать файл как URL
            reader.readAsDataURL(file);
        });
    };

    const loadImage = async () => {
        if (airline) {
            const airline_img = await fetchAirlineImage(airline.id);
            console.log(airline_img);
            if (airline_img) {
                const blob = new Blob([airline_img], { type: 'image/jpeg' }); // Убедитесь, что тип изображения правильный
                const reader = new FileReader();

                reader.onloadend = () => {
                    setImage(reader.result);
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
            if (file) {
                await checkFileAccess(file);
                formData.append('img', file)
            }
            const result = await updateAirline(formData);
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            setAlert(e.message);
            return;
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
                    {image &&
                        <Image className='mt-1' width={300} height={200} src={image} />}
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
