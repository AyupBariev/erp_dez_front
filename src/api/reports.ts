import { apiFetch } from "./http.ts";

export interface ReportPayload {
    token: string;
    finish_price: string;
    has_repeat: boolean; // true — "Да", false — "Нет"
    repeat_date?: string; // YYYY-MM-DDTHH:mm
    repeat_note: string;
}

export interface ReportResponse {
    success: boolean;
    message?: string;
    status?: string;
}

/**
 * Получение данных о заказе по токену (report_link)
 * (Инженер открывает ссылку с токеном — ERP подтягивает информацию)
 */
export const getReportLinkInfo = async (token: string) => {
    const data = await apiFetch(`/api/reports/link/${token}`);
    return data.data;
};

/**
 * Отправка отчёта инженером
 */
export const submitReport = async (payload: ReportPayload): Promise<ReportResponse> => {
    const data = await apiFetch(`/api/reports/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return data;
};
