import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { deleteAirline } from '../http/airlinesApi';
import CreateAirline from './modals/CreateAirline';
import UpdateAirline from './modals/UpdateAirline';
import { SearchInput } from './SearchInput';

const Airlines = observer(({ airlines, getAirlines }) => {
    const [filtredAirlines, setFiltredAirlines] = useState([]);
    const [selectedAirline, setSelectedAirline] = useState({});
    const [searchedAirline, setSearchedAirline] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    useEffect(() => {
        setFiltredAirlines(airlines);
    }, [airlines]);

    const handleSearchChange = (e) => {
        setSearchedAirline(e.target.value);
        const filtred = airlines.filter((Airline) => Airline.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setFiltredAirlines(filtred);
    }

    const handleDelete = async (AirlineId) => {
        try {
            await deleteAirline(AirlineId);
            getAirlines();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    return (
        <Container>
            {/* <h4 className='mt-2'>Авиакомпании</h4> */}
            <SearchInput value={searchedAirline} onChange={handleSearchChange} placeholder={'Название авиакомпании'} />
            <Table bordered className='mt-2'>
                <thead>
                    <tr>
                        <th>Авиакомпания</th>
                        <th>
                            <Button onClick={() => setCreateModalVisible(true)}>
                                Добавить
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filtredAirlines.map(Airline =>
                            <tr key={Airline.id}>
                                <td>{Airline.name}</td>
                                <td>
                                    <Button onClick={() => { setUpdateModalVisible(true); setSelectedAirline(Airline) }}>
                                        Редактировать
                                    </Button>
                                    <Button className='ms-3' variant='outline-danger' onClick={() => handleDelete(Airline.id)}>
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            <CreateAirline show={createModalVisible} onHide={() => { setCreateModalVisible(false); getAirlines(); }} />
            <UpdateAirline show={updateModalVisible} onHide={() => { setUpdateModalVisible(false); getAirlines(); }} airline={selectedAirline} />
        </Container >
    );
})

export default Airlines;
