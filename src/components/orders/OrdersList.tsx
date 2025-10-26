import React from "react";
import type { Order } from "../../api/orders";

interface Props {
    orders: Order[];
    onEdit: (order: Order) => void;
}

const OrdersList: React.FC<Props> = ({ orders, onEdit }) => {
    if (!orders.length) return <p>Нет заказов</p>;

    return (
        <div className="flex flex-col gap-2">
            {orders.map((o) => (
                <div
                    key={o.id}
                    onClick={() => onEdit(o)}
                    className={`p-3 border rounded-lg cursor-pointer ${
                        o.is_repeat ? "bg-yellow-100" : "bg-white"
                    }`}
                >
                    <div><strong>№ {o.erp_number}</strong> — {o.title}</div>
                    <div>{o.problem}</div>
                    <div>{o.address}</div>
                    <div>{o.scheduled_at ? new Date(o.scheduled_at).toLocaleString() : "Без даты"}</div>
                </div>
            ))}
        </div>
    );
};

export default OrdersList;
