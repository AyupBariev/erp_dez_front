import { useState, useEffect } from "react";
import { apiFetch } from "../api/http.ts";
import { format } from "date-fns";

interface UseEngineerMotivationReturn {
    data: EngineerMonthlyMotivation[];
    loading: boolean;
    error: string | null;
    from: Date;
    setFrom: (date: Date) => void;
    to: Date;
    setTo: (date: Date) => void;
    refetch: () => void;
}

export interface EngineerMonthlyMotivation {
    engineer_id: number;
    engineer_name: string;
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
    net_profit?: number;
    total_amount?: number;
}

export const useEngineerMotivation = (): UseEngineerMotivationReturn => {
    const [data, setData] = useState<EngineerMonthlyMotivation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Устанавливаем диапазон по умолчанию: с 1-го числа текущего месяца по сегодня
    const [from, setFrom] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [to, setTo] = useState<Date>(() => new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Форматируем даты для запроса
            const fromFormatted = format(from, "yyyy-MM-dd");
            const toFormatted = format(to, "yyyy-MM-dd");

            const response = await apiFetch(
                `/api/motivations/engineer?from=${fromFormatted}&to=${toFormatted}`
            );
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
            console.error("Error fetching motivation data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Убрали зависимости, чтобы не обновлялось при каждом изменении дат

    // Валидация дат
    const handleSetFrom = (date: Date) => {
        if (date > to) {
            // Если начальная дата больше конечной, устанавливаем конечную дату на следующий день
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setTo(nextDay);
        }
        setFrom(date);
    };

    const handleSetTo = (date: Date) => {
        if (date < from) {
            // Если конечная дата меньше начальной, устанавливаем начальную дату на предыдущий день
            const prevDay = new Date(date);
            prevDay.setDate(prevDay.getDate() - 1);
            setFrom(prevDay);
        }
        setTo(date);
    };

    return {
        data,
        loading,
        error,
        from,
        setFrom: handleSetFrom,
        to,
        setTo: handleSetTo,
        refetch: fetchData
    };
};