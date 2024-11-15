import axios from "axios";
import { API_URL } from "../utils/consts";

export const fetchOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}orders.php?`);

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

export const fetchOrdersByUserId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}orders.php?userId=` + id);

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

export const addOrder = async (order) => {
    try {
        const response = await fetch(`${API_URL}orders.php?method=insert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
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

export const updateOrder = async (id, newData) => {
    try {
        const response = await fetch(`${API_URL}orders.php?method=update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, new_data: newData }),
        });
        if (!response.ok) {
            throw new Error('Ошибка при обновлении заказа');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteOrder = async (id) => {
    try {
        await axios.post(`${API_URL}orders.php?method=delete`, {
            id: id
        });
    } catch (error) {
        throw new Error(error.message);
    }
};