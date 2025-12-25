// hooks/useRepeatRequests.ts
import { useEffect, useState } from "react";
import { apiFetch } from "../api/http.ts";

export interface RepeatRequest {
    id: number;
    order_id: number;
    engineer_id: number;
    description: string;
    requested_at: string;
    scheduled_at: string;
    confirmed: boolean;
    status: string;
    repeat_order_id?: number;
}

export function useRepeatRequests() {
    const [data, setData] = useState<RepeatRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch("/api/repeat-requests?status=pending");
            setData(res || []);
        } catch (err: any) {
            setError(err.message || "Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const confirm = async (repeat_request_id: number, payload: any) => {
        try {
            await apiFetch(`/api/repeat-requests/${repeat_request_id}/confirm`, {
                method: "POST",
                body: JSON.stringify(payload),
            });
            await fetchData(); // обновляем список после подтверждения
        } catch (err: any) {
            setError(err.message || "Ошибка при подтверждении");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, confirm };
}
