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

export const fetchAirlineImage = async (id) => {
    try {
        const response = await axios.get(`${API_URL}airlines.php?airlineId=` + id, {
            responseType: 'arraybuffer' // Указываем тип ответа
        });

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            console.error('Ошибка от сервера:', error.response.data.error);
            throw new Error(`Ошибка при загрузке данных: ${error.response.data.error}`);
        }

        console.error('Ошибка сети или другая ошибка:', error.message);
        throw new Error('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
    }
};

export const addAirline = async (airline) => {
    try {
        const response = await axios.post(`${API_URL}airlines.php?method=insert`, airline)

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }

        return response.data;
    } catch (error) {
        throw new Error(`Ошибка при добавлении данных: ${error.response.data.error}`);
    }
};

export const updateAirline = async (newData) => {
    try {
        const response = await axios.post(`${API_URL}airlines.php?method=update`, newData)
        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }

        return response.data;
    } catch (error) {
        throw new Error(`Ошибка при добавлении данных: ${error.response.data.error}`);
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