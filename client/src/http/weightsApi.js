import axios from "axios";
import { API_URL } from "../utils/consts";

export const fetchWeights = async () => {
    try {
        const response = await axios.get(`${API_URL}weights.php`);

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

export const updateWeights = async (newData) => {
    try {
        const response = await fetch(`${API_URL}weights.php?method=update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ new_data: newData }),
        });
        if (!response.ok) {
            throw new Error('Ошибка при обновлении билета');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};