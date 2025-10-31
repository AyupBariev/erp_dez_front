import {logoutUser} from "../utils/logoutHelper.ts";

export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("access_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, { ...options, headers });

    // если токен истёк или невалиден → выходим из системы
    if (response.status === 401) {
        logoutUser();
        return;
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка запроса: ${response.status} ${errorText}`);
    }

    // пытаемся распарсить JSON (если есть тело)
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}
