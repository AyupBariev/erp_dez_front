import React, { useEffect, useState } from "react";
import OrdersTabs from "./OrdersTabs";
import type { Order } from "../../api/orders";
import { getOrders } from "../../api/orders";
import OrderForm from "./OrderForm.tsx";

const OrdersManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState("thinking");
    const [showForm, setShowForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error("Ошибка загрузки заказов", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleEdit = (order: Order) => {
        setSelectedOrder(order);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedOrder(null);
        setShowForm(true);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Заказы</h2>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Создать заказ
                </button>
            </div>

            <OrdersTabs
                orders={orders}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onEdit={handleEdit}
            />

            {showForm && (
                <OrderForm
                    order={selectedOrder}
                    onCancel={() => setShowForm(false)}
                    onSave={fetchOrders}
                />
            )}
        </div>
    );
};

export default OrdersManagement;
