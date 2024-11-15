import axios from "axios";
import { API_URL } from "../utils/consts";

export const fetchRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}dispatcher_requests.php?`);

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

export const fetchRequestByUserId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}dispatcher_requests.php?userId=` + id);

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

export const addRequest = async (request) => {
    try {
        const response = await fetch(`${API_URL}dispatcher_requests.php?method=insert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const text = response.text();
            console.error('Ошибка от сервера:', text);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateRequest = async (id, newData) => {
    try {
        const response = await fetch(`${API_URL}dispatcher_requests.php?method=update`, {
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

export const deleteRequest = async (id) => {
    try {
        await axios.post(`${API_URL}dispatcher_requests.php?method=delete`, {
            id: id
        });
    } catch (error) {
        throw new Error(error.message);
    }
};