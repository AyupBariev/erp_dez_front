import {apiFetch} from "./http.ts";

export interface Engineer {
    id: number;
    first_name: string;
    second_name?: string;
    username: string;
    phone?: string;
    telegram_id?: number;
    is_approved?: boolean;
    is_working?: boolean;
}

export interface CreateEngineerRequest {
    first_name: string;
    second_name?: string;
    username: string;
    phone?: string;
    telegram_id?: number;
}

export async function getEngineers(date: string): Promise<Engineer[]> {
    return apiFetch(`/api/engineers?date=${date}`);
}

// ✅ Создать инженера
export async function createEngineer(payload: CreateEngineerRequest) {
    return apiFetch("/api/engineers", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// ✅ Активировать инженера
export async function approveEngineer(engineerId: number) {
    return apiFetch("/api/engineers/accept-engineer", {
        method: "POST",
        body: JSON.stringify({ engineer_id: engineerId }),
    });
}