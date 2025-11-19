import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import OrdersGrid from "./OrdersGrid"; // переименуем в Grid
import type { Order } from "../../api/orders";
import {ORDER_STATUSES} from "../../utils/orderStatus.ts";

interface Props {
    orders: Order[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    onEdit: (order: Order) => void;
}

const all = [
    { key: "all", label: "Все" },
];

const tabs = [...all, ...ORDER_STATUSES];

const OrdersTabs: React.FC<Props> = ({ orders, activeTab, onTabChange, onEdit }) => {
    let filtered: Order[] = [];

    switch (activeTab) {
        case "all":
            filtered = orders;
            break;
        case "new":
            filtered = orders.filter((o) => o.status === "new");
            break;
        case "in_proccess":
            filtered = orders.filter((o) => o.status === "in_proccess");
            break;
        case "working":
            filtered = orders.filter((o) => o.status === "working");
            break;
        case "closed_without_repeat":
            filtered = orders.filter((o) => o.status === "closed_without_repeat");
            break;
        case "sent_to_cash":
            filtered = orders.filter((o) => o.status === "sent_to_cash");
            break;
        case "closed_finally":
            filtered = orders.filter((o) => o.status === "closed_finally");
            break;
        case "canceled":
            filtered = orders.filter((o) => o.status === "canceled");
            break;
    }

    // Сортировка: новые сверху для активных, старые сверху для закрытых
    filtered.sort((a, b) => {
        const aTime = new Date(a.created_at ?? "").getTime();
        const bTime = new Date(b.created_at ?? "").getTime();
        const isClosedTab = ["closed_without_repeat", "closed_finally", "canceled"].includes(activeTab);
        return isClosedTab ? bTime - aTime : aTime - bTime;
    });

    return (
        <Box>
            <Tabs
                value={activeTab}
                onChange={(_, v) => onTabChange(v)}
                sx={{ mb: 2 }}
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabs.map((t) => (
                    <Tab key={t.key} label={t.label} value={t.key} />
                ))}
            </Tabs>

            <OrdersGrid orders={filtered} onEdit={onEdit} />
        </Box>
    );
};

export default OrdersTabs;