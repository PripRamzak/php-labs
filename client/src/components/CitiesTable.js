import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { deleteCity } from '../http/cityApi';
import CreateCity from './modals/CreateCity';
import UpdateCity from './modals/UpdateCity';
import { SearchInput } from './SearchInput';

const CitiesTable = observer(({ loading, cities, getCities }) => {
    const [filtredCities, setFiltredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState({});
    const [searchedCity, setSearchedCity] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    useEffect(() => {
        setFiltredCities(cities);
    }, [cities]);

    const handleSearchChange = (e) => {
        setSearchedCity(e.target.value);
        const filtred = cities.filter((city) => city.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setFiltredCities(filtred);
    }

    const handleDelete = async (cityId) => {
        try {
            await deleteCity(cityId);
            getCities();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    if (loading)
        return;

    return (
        <Container>
            {/* <h4 className='mt-2'>Города</h4> */}
            <SearchInput value={searchedCity} onChange={handleSearchChange} placeholder={'Название города'} />
            <Table bordered className='mt-2'>
                <thead>
                    <tr>
                        <th>Город</th>
                        <th>
                            <Button onClick={() => setCreateModalVisible(true)}>
                                Добавить
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filtredCities.map(city =>
                            <tr key={city.id}>
                                <td>{city.name}</td>
                                <td>
                                    <Button onClick={() => { setUpdateModalVisible(true); setSelectedCity(city) }}>
                                        Редактировать
                                    </Button>
                                    <Button className='ms-3' variant='outline-danger' onClick={() => handleDelete(city.id)}>
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            <CreateCity show={createModalVisible} onHide={() => { setCreateModalVisible(false); getCities(); }} />
            <UpdateCity show={updateModalVisible} onHide={() => { setUpdateModalVisible(false); getCities(); }} city={selectedCity} />
        </Container >
    );
})

export default CitiesTable;
