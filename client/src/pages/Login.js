import React, { useContext, useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { NavLink, useNavigate } from 'react-router-dom';
import { REGISTRATION_ROUTE, MAIN_ROUTE } from '../utils/consts';
import { login } from '../http/userApi';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const Login = observer(() => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [alert, setAlert] = useState('')

    const click = async () => {
        try {
            const response = await login(username.trim(), password);

            if (response.error) {
                console.log('Ошибки:', response.error);
                setAlert(response.error);
            }
            else {
                localStorage.setItem('user', JSON.stringify({ username, password }));
                navigate(MAIN_ROUTE);
            }
        }
        catch (e) {
            console.error('Ошибка при входе:', e.message);
            setAlert('Ошибка входа');
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: window.innerHeight - 54 }}>
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{'Авторизация'}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control className="mt-4" placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} />
                    <Form.Control className="mt-3" placeholder="Пароль" value={password} onChange={p => setPassword(p.target.value)} type='password' />
                    <Row className="mt-3">
                        <Col className='mt-2 ms-1'>Нет аккаунта? <NavLink to={REGISTRATION_ROUTE} onClick={() => setAlert(false)}>Зарегистрируйтесь</NavLink></Col>
                        <Col md="auto">
                            <Button variant="success" onClick={click}>
                                Войти
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

export default Login;
