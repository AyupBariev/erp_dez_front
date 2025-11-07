import type {OrderStatus} from "../api/orders.ts";

export const ORDER_STATUSES: { key: OrderStatus; label: string }[] = [
    { key: "new", label: "Новый" },
    { key: "in_proccess", label: "Логист выдал" },
    { key: "working", label: "Инженер принял" },
    { key: "closed_without_repeat", label: "На рассмотрении" },
    { key: "closed_finally", label: "Успешно закрыт" },
    { key: "canceled", label: "Отменено" },
];

export const getStatusLabel = (status: OrderStatus): string => {
    return ORDER_STATUSES.find(s => s.key === status)?.label || "Неизвестный статус";
};

export const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
        new: "#1976d2", // синий
        in_proccess: "#ed6c02", // оранжевый
        working: "#2e747d", // зеленый
        closed_without_repeat: "#9c27b0", // фиолетовый
        closed_finally: "#2e7d32", // зеленый
        canceled: "#d32f2f", // красный
    };
    return colors[status];
};