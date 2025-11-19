import { useState, useEffect } from "react";
import { apiFetch } from "../api/http.ts";

interface UseEngineerMotivationReturn {
    data: EngineerMonthlyMotivation[];
    loading: boolean;
    error: string | null;
    month: string;
    setMonth: (month: string) => void;
    refetch: () => void;
}

export interface EngineerMonthlyMotivation {
    engineer_id: number;
    engineer_name: string; // ФИО инженера
    reports_count: number;
    primary_orders_count: number;
    repeat_orders_count: number;
    orders_total_amount: number;
    repeat_orders_amount: number;
    gross_profit: number;
    average_check: number;
    motivation_percent: number;
    total_motivation_amount: number;
    aggregator_payout: number;
}

export const useEngineerMotivation = (): UseEngineerMotivationReturn => {
    const [data, setData] = useState<EngineerMonthlyMotivation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [month, setMonth] = useState<string>(() => {
        const now = new Date();
        return now.toISOString().slice(0, 7); // yyyy-mm
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiFetch(`/api/motivations/engineer?month=${month}`);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month]);

    return { data, loading, error, month, setMonth, refetch: fetchData };
};
