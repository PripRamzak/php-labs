import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Image, Modal } from 'react-bootstrap';
import { updateCity } from '../../http/cityApi';
import { API_URL } from '../../utils/consts';

function UpdateCity({ show, onHide, city }) {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [file, setFile] = useState(null)
    const [alert, setAlert] = useState('')

    const handleOnShow = () => {
        if (!Object.keys(city).length !== 0) {
            setName(city.name);
            setImage(city.img)
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

    const update = async () => {
        try {
            const formData = new FormData()
            formData.append('updated_id', city.id)
            formData.append('name', name.trim())
            if (file) {
                await checkFileAccess(file)
                formData.append('img', file)
            }
            const result = await updateCity(formData);
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            setAlert(e.message);
            return;
        }

        onHide();
    }

    useEffect(() => {
        setAlert('');
    }, [show]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            onShow={handleOnShow}
            size="lg"
            centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Обновить инфорамцию о городе
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='d-flex flex-column'>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} placeholder={'Название города'} />
                    <Form.Label className='mt-2'>Изображение города</Form.Label>
                    <Form.Control type='file' onChange={(e) => setFile(e.target.files[0])} />
                    <Form.Label className='mt-2'>Изображение города сейчас</Form.Label>
                    <Image className='mt-1' width={300} height={200} src={API_URL + "../img/cities/" + image} />
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

export default UpdateCity;
