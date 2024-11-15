import axios from "axios";
import { API_URL } from "../utils/consts";

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}users.php?`);

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


export const registration = async (user) => {
    try {
        const response = await fetch(`${API_URL}users.php?method=register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Сервер вернул ошибку:', text);
            try {
                const result = JSON.parse(text);
                if (result.error) {
                    throw new Error(result.error);
                }
            } catch (parseError) {
                throw new Error('Ошибка при добавлении пользователя');
            }
        }

        const result = await response.json();

        if (result.error) {
            console.error('Ошибки сервера:', result.error);
            return { error: result.error };
        }

        return result;
    }
    catch (error) {
        console.error('Ошибка:', error);
        if (error.message.includes('Failed to fetch')) {
            return { error: 'Ошибка при добавлении пользователя: Ошибка подключения к базе данных' };
        }
        return { error: [error.message] };
    }
}

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}users.php?method=login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('Сервер вернул ошибку:', text);
        try {
            const result = JSON.parse(text);
            if (result.error) {
                throw new Error(result.error);
            }
        } catch (parseError) {
            throw new Error('Ошибка при добавлении пользователя');
        }
    }

    const result = await response.json();
    console.log(result);

    if (result.error) {
        console.error('Ошибки сервера:', result.error);
        return { error: result.error };
    }

    return result;
}

export const updateUser = async (id, newData) => {
    try {
        const response = await fetch(`${API_URL}users.php?method=update`, {
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