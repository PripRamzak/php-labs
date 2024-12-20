import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Context } from '../index';
import { ADMIN_ROUTE, AIRLINES_ROUTE, CITIES_ROUTE, DISPATCHER_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, PERSONAL_ACCOUNT_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const NavBar = observer(() => {
    const navigate = useNavigate()
    const user = localStorage.getItem('user');
    const role = user ? JSON.parse(user).role : 'null';

    const logOut = () => {
        localStorage.removeItem('user');
        navigate(LOGIN_ROUTE);
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <NavLink style={{ color: 'white', textDecoration: 'none', fontSize: 32 }} to={MAIN_ROUTE}>ХаляваРейс</NavLink>
                <NavLink className='ms-5 mt-1' style={{ color: 'lightgray', textDecoration: 'none', fontSize: 24 }} to={CITIES_ROUTE}>Города</NavLink>
                <NavLink className='ms-5 mt-1' style={{ color: 'lightgray', textDecoration: 'none', fontSize: 24 }} to={AIRLINES_ROUTE}>Авиакомпании</NavLink>
                {role != 'null' ?
                    <Nav className='ms-auto'>
                        {role == 'admin' &&
                            <Button className="me-2" variant='light' onClick={() => navigate(ADMIN_ROUTE)}>Админ панель</Button>
                        }
                        {role == 'dispatcher' &&
                            <Button className="me-2" variant='light' onClick={() => navigate(DISPATCHER_ROUTE)}>Панель диспетчера</Button>
                        }
                        <Dropdown >
                            <Dropdown.Toggle variant='light'>
                                Меню
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => navigate(PERSONAL_ACCOUNT_ROUTE)}>Личный кабинет</Dropdown.Item>
                                    <Dropdown.Item onClick={() => logOut()}>Выйти</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Toggle>
                        </Dropdown>
                    </Nav>
                    :
                    <Nav>
                        <Button className="me-2" variant='light' onClick={() => navigate(LOGIN_ROUTE)}>Войти</Button>
                    </Nav>
                }
            </Container>
        </Navbar>
    );
})

export default NavBar;
