import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Spinner } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { fetchWeights } from '../http/weightsApi';
import UpdateWeights from './modals/UpdateWeights';

const Weights = observer(({ loading, setLoading }) => {
    const [weights, setWeights] = useState(null);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    const getWeights = async () => {
        try {
            const data = await fetchWeights();
            if (data !== false) {
                setWeights(data);
            } else {
                throw new Error('Не удалось получить данные о весах');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
        finally {
            if (loading)
                setLoading(false)
        }
    }


    useEffect(() => {
        getWeights();
    }, []);

    if (loading)
        return;

    return (
        <Container>
            <h2 className='mt-4 text-center'>Веса критериев сортировки</h2>
            <Table bordered className='mt-3'>
                <thead>
                    <tr>
                        <th>Город отправления</th>
                        <th>Город прибытия</th>
                        <th>Авиакомпания</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {weights &&
                        <tr>
                            <td>{weights.departure_city_weight}</td>
                            <td>{weights.arrival_city_weight}</td>
                            <td>{weights.airline_weight}</td>
                            <td>
                                <Button onClick={() => setUpdateModalVisible(true)}>
                                    Редактировать
                                </Button>
                            </td>
                        </tr>
                    }
                </tbody>
            </Table>
            <UpdateWeights
                show={updateModalVisible}
                onHide={() => { setUpdateModalVisible(false); getWeights(); }}
                weights={weights} />
        </Container >
    );
})

export default Weights;
