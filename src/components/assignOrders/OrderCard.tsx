import React from "react";

interface Engineer {
    id: number;
    name: string;
}

interface Order {
    id: number;
    erp_number: number;
    engineer_id?: number | null;
    scheduled_at: string;
    address: string;
}

interface Props {
    order: Order;
    engineers: Engineer[];
    onAssign: (orderId: number, engineerId: number) => void;
}

const OrderCard: React.FC<Props> = ({ order, engineers, onAssign }) => {
    return (
        <div className="border rounded p-2 mb-2 bg-light">
            <div>📦 Заказ №{order.erp_number}</div>
            <div>⏰ {order.scheduled_at}</div>
            <div>📍 {order.address || "Адрес не указан"}</div>

            <select
                className="form-select mt-2"
                defaultValue={order.engineer_id ?? ""}
                onChange={(e) => onAssign(order.id, Number(e.target.value))}
            >
                <option value="">Выбрать СИ</option>
                {engineers.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                        {eng.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default OrderCard;
