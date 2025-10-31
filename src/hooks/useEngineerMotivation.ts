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
    engineer_name: string; // ФИО инженера
    reportsCount: number;
    primaryOrdersCount: number;
    repeatOrdersCount: number;
    ordersTotalAmount: number;
    repeatOrdersAmount: number;
    grossProfit: number;
    averageCheck: number;
    motivationPercent: number;
    totalMotivation: number;
    confirmedByAdmin: boolean;
    month: string; // ISO date
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
