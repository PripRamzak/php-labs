import { $authHost, $host } from "./index"
import { jwtDecode } from 'jwt-decode'
import { API_URL } from "../utils/consts";

export const registration = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}users.php?method=register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
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

    if (result.error) {
        console.error('Ошибки сервера:', result.error);
        return { error: result.error };
    }

    return result;
}