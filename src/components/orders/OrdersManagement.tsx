import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import OrdersTabs from "./OrdersTabs";
import OrderForm from "./OrderForm";
import { getOrders } from "../../api/orders";
import type { Order } from "../../api/orders";

const OrdersManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState("all");
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
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h5">Заказы</Typography>
                <Button variant="contained" onClick={handleCreate}>
                    Создать заказ
                </Button>
            </Box>

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
        </Box>
    );
};

export default OrdersManagement;
