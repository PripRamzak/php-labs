import React, { useContext, useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { NavLink, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, MAIN_ROUTE } from '../utils/consts';
import { registration } from '../http/userApi';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { encryptData } from '../utils/crypro';

const Registration = observer(() => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [alert, setAlert] = useState('')

    const click = async () => {
        

        try {
            const user = {username: username.trim(), email: email.trim(), password: password, role: 'user'};
            const response = await registration(user);

            if (response.error) {
                console.log('Ошибки:', response.error);
                setAlert(response.error);
            } 
            else 
            {
                const encryptedData = encryptData({id: response, username: username.trim(), role: 'user'});
                localStorage.setItem('user', encryptedData);
                navigate(MAIN_ROUTE);
            }
        }
        catch (e) {
            console.error('Ошибка при регистрации пользователя:', e.message);
            setAlert('Ошибка регистрации');
        }
        if (password !== confirmPassword) {
            setAlert('Пароли не совпадают!');
            return;
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: window.innerHeight - 54 }}>
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">Регистрация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control className="mt-4" placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} />
                    <Form.Control className="mt-4" placeholder="Электронная почта" value={email} onChange={e => setEmail(e.target.value)} />
                    <Form.Control className="mt-3" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} type='password' />
                    <Form.Control className="mt-3" placeholder="Подтвердите пароль"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type='password' />
                    <Row className="mt-3">
                        <Col className='mt-2 ms-1'>Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите</NavLink></Col>
                        <Col md="auto">
                            <Button variant="success" onClick={click}>
                                Зарегистрироваться
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Card>
        </Container>
    );
})

export default Registration;
