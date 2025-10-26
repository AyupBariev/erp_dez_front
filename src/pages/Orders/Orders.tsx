import React, { useEffect, useState } from "react";
import { getOrders, createOrder } from "../../api/orders";
import type { Order, CreateOrderRequest } from "../../api/orders";
import OrdersTabs from "../../components/orders/OrdersTabs";
import OrderForm from "../../components/orders/OrderForm";
import ShareToast from "../../components/share/ShareToast";
import { IconPlus, IconReload } from "@tabler/icons-react";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<string>("new");
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        success: true,
        message: "",
    });

    // --- Загрузка заказов ---
    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error("Ошибка при загрузке заказов:", err);
            setToast({ show: true, success: false, message: "Ошибка при загрузке заказов" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // --- Создание нового заказа ---
    const handleCreate = () => {
        setEditingOrder(null);
        setShowModal(true);
    };

    // --- Редактирование существующего заказа ---
    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setShowModal(true);
    };

    // --- Сохранение заказа ---
    const handleSave = async (formData: CreateOrderRequest) => {
        try {
            await createOrder(formData);
            setShowModal(false);
            await loadOrders();
            setToast({ show: true, success: true, message: "Заказ успешно сохранён!" });
        } catch (err) {
            console.error("Ошибка при сохранении заказа:", err);
            setToast({ show: true, success: false, message: "Ошибка при сохранении заказа" });
        }
    };

    return (
        <div className="p-5">
            <div className="d-flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <IconReload size={22} className="text-blue-600"/> Заказы
                </h2>

                <button
                    onClick={handleCreate}
                    className="btn btn-success d-flex align-items-center gap-2"
                >
                    <IconPlus size={18}/> Создать заказ
                </button>
            </div>

            <div className="card p-4 shadow-sm">
                {loading ? (
                    <div className="text-center text-gray-500">Загрузка заказов...</div>
                ) : (
                    <OrdersTabs
                        orders={orders}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onEdit={handleEdit}
                    />
                )}
            </div>

            {/* Модалка создания/редактирования */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] max-h-[80vh] overflow-auto">
                        <div className="flex justify-between mb-3">
                            <h3 className="text-xl font-semibold">
                                {editingOrder
                                    ? `Редактировать заказ №${editingOrder.erp_number}`
                                    : "Создать заказ"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <OrderForm
                            order={editingOrder}
                            onSave={handleSave}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}

            <ShareToast
                show={toast.show}
                success={toast.success}
                message={toast.message}
                onClose={() => setToast({...toast, show: false})}
            />
        </div>
    );
};

export default Orders;
