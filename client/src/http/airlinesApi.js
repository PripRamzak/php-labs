import axios from "axios";
import { API_URL } from "../utils/consts";

export const fetchAirlines = async () => {
    try {
        const response = await axios.get(`${API_URL}airlines.php`);

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }

        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            console.error('Ошибка от сервера:', error.response.data.error);
            throw new Error(`Ошибка при загрузке данных: ${error.response.data.error}`);
        }

        console.error('Ошибка сети или другая ошибка:', error.message);
        throw new Error('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
    }
};

export const addAirline = async (name) => {
    try {
        const response = await fetch(`${API_URL}airlines.php?method=insert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        console.log('sended');

        if (!response.ok) {
            const text = response.text();
            console.error('Ошибка от сервера:', text);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateAirline = async (id, newData) => {
    try {
        const response = await fetch(`${API_URL}airlines.php?method=update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, new_data: newData }),
        });
        if (!response.ok) {
            throw new Error('Ошибка при обновлении аэропорта');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteAirline = async (id) => {
    try {
        await axios.post(`${API_URL}airlines.php?method=delete`, {
            id: id
        });
    } catch (error) {
        throw new Error(error.message);
    }
};