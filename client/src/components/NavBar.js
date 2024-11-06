import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Context } from '../index';
import { LOGIN_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const NavBar = observer(() => {
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.removeItem('user');
        navigate(LOGIN_ROUTE);
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Nav className="ms-auto">
                    <Button variant='light' onClick={() => logOut()}>Выйти</Button>
                </Nav>
            </Container>
        </Navbar>
    );
})

export default NavBar;
