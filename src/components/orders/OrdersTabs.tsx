import React from "react";
import OrdersList from "./OrdersList";
import type { Order } from "../../api/orders";

interface Props {
    orders: Order[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    onEdit: (order: Order) => void;
}

const tabs = [
    { key: "thinking", label: "Клиент думает" },
    { key: "new", label: "Новые (обращения)" },
    { key: "in_proccess", label: "В работе (логист/инженер)" },
    { key: "closed_finally", label: "Закрытые" },
];

const OrdersTabs: React.FC<Props> = ({ orders, activeTab, onTabChange, onEdit }) => {
    let filtered: Order[] = [];

    switch (activeTab) {
        case "thinking":
            filtered = orders.filter((o) => o.status === "thinking");
            break;
        case "new":
            filtered = orders.filter((o) => o.status === "new");
            break;
        case "in_proccess":
            filtered = orders.filter((o) => ["in_proccess", "working"].includes(o.status));
            break;
        case "closed_finally":
            filtered = orders.filter((o) =>
                ["closed_without_repeat", "closed_finally", "canceled"].includes(o.status)
            );
            break;
    }

    // Сортировка
    filtered.sort((a, b) => {
        const aTime = new Date(a.created_at ?? "").getTime();
        const bTime = new Date(b.created_at ?? "").getTime();

        if (activeTab === "in_proccess") {
            return aTime - bTime; // от старых к новым
        }
        return bTime - aTime; // от новых к старым
    });

    return (
        <div>
            <div className="flex gap-3 mb-4">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => onTabChange(t.key)}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === t.key ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <OrdersList orders={filtered} onEdit={onEdit} />
        </div>
    );
};

export default OrdersTabs;
