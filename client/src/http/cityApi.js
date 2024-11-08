import axios from "axios";
import { API_URL } from "../utils/consts";

export const fetchCities = async () => {
    try {
        const response = await axios.get(`${API_URL}cities.php`);

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

export const addCity = async (name) => {
    try {
        const response = await fetch(`${API_URL}cities.php?method=insert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name}),
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

export const updateCity = async (id, newData) => {
    try {
        const response = await fetch(`${API_URL}cities.php?table_name=rooms&method=update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, new_data: newData }),
        });
        if (!response.ok) {
            throw new Error('Ошибка при обновлении города');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteCity = async (id) => {
    try {
        await axios.post(`${API_URL}cities.php?method=delete`, {
            id: id
        });
    } catch (error) {
        throw new Error(error.message);
    }
};