import axios from "axios";
import { API_URL } from "../utils/consts";

export const fetchDispatchers = async () => {
    try {
        const response = await axios.get(`${API_URL}dispatchers.php?`);

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

export const fetchDispatcherByUserId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}dispatchers.php?userId=` + id);

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

export const deleteDispatcher = async (id) => {
    try {
        await axios.post(`${API_URL}dispatchers.php?method=delete`, {
            id: id
        });
    } catch (error) {
        throw new Error(error.message);
    }
};