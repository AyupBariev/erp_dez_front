import React from "react";
import OrderCard from "./OrderCard";

interface Engineer {
    id: number;
    name: string;
    is_working: boolean;
}

interface Order {
    id: number;
    erp_number: number;
    scheduled_at: string;
    address: string;
}

interface Props {
    engineer: Engineer;
    orders: Order[];
    timeSlots: string[];
}

const EngineerColumn: React.FC<Props> = ({ engineer, orders, timeSlots }) => {
    return (
        <div
            className={`engineer-row ${
            engineer.is_working ? "bg-gray-100" : "bg-danger-subtle"
        }`}
>
    <div className="fw-bold p-2">{engineer.name}</div>
    {timeSlots.map((time) => {
        const slotOrders = orders.filter((o) =>
            o.scheduled_at.includes(time)
        );
        return (
            <div key={time} className="border p-2 min-h-[60px]">
            {slotOrders.map((order) => (
                    <OrderCard
                        key={order.id}
                order={order}
                engineers={[engineer]}
                onAssign={() => {}}
        />
    ))}
        </div>
    );
    })}
    </div>
);
};

export default EngineerColumn;
