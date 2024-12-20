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

export const addCity = async (city) => {
    try {
        const response = await axios.post(`${API_URL}cities.php?method=insert`, city)

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }

        return response.data;
    } catch (error) {
        throw new Error(`Ошибка при добавлении данных: ${error.response.data.error}`);
    }
};

export const updateCity = async (newData) => {
    try {
        const response = await axios.post(`${API_URL}cities.php?method=update`, newData)

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }

        return response.data;
    } catch (error) {
        throw new Error(`Ошибка при добавлении данных: ${error.response.data.error}`);
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