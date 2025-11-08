import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Alert,
    Typography,
    Stack, TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { getOrders, createOrder, updateOrder } from "../../api/orders";
import type { Order, CreateOrderRequest } from "../../api/orders";
import OrdersTabs from "../../components/orders/OrdersTabs";
import OrderForm from "../../components/orders/OrderForm";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false); // Отдельное состояние для формы
    const [toast, setToast] = useState({ show: false, success: true, message: "" });
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const loadOrders = async () => {
        try {
            setLoading(true);

            const data = await getOrders(selectedDate);
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
    }, [selectedDate]); // перезагружаем при смене даты

    // --- Создание нового заказа ---
    const handleCreate = () => {
        setEditingOrder(null);
        setShowModal(true);
    };

    // --- Редактирование ---
    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setShowModal(true);
    };

    // --- Универсальное сохранение (создание + обновление) ---
    const handleSave = async (formData: CreateOrderRequest, orderNumber?: number) => {
        try {
            setFormLoading(true);

            if (orderNumber) {
                // Обновление существующего заказа
                await updateOrder(orderNumber, formData);
                setToast({ show: true, success: true, message: "Заказ успешно обновлён!" });
            } else {
                // Создание нового заказа
                await createOrder(formData);
                setToast({ show: true, success: true, message: "Заказ успешно создан!" });
            }

            setShowModal(false);
            await loadOrders();
        } catch (err) {
            console.error("Ошибка при сохранении заказа:", err);
            setToast({ show: true, success: false, message: "Ошибка при сохранении заказа" });
        } finally {
            setFormLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingOrder(null);
    };

    return (
        <Box sx={{ p: 1 }}>
            {/* Заголовок */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <RefreshIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>Заказы</Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        size="small"
                    />

                    <Button variant="contained" startIcon={<AddIcon />} color="success" onClick={handleCreate}>
                        Создать заказ
                    </Button>
                </Stack>
            </Stack>

            {/* Основная карточка */}
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <OrdersTabs
                        orders={orders}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onEdit={handleEdit}
                    />
                )}
            </Card>

            {/* Диалог создания/редактирования */}
            <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="div">
                        {editingOrder
                            ? `Редактировать заказ №${editingOrder.erp_number}`
                            : "Создать заказ"}
                    </Typography>
                    <IconButton onClick={handleCloseModal} disabled={formLoading}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <OrderForm
                        order={editingOrder}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                        formLoading={formLoading}
                    />
                </DialogContent>
            </Dialog>

            {/* Уведомление */}
            <Snackbar open={toast.show} autoHideDuration={4000} onClose={() => setToast({ ...toast, show: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={() => setToast({ ...toast, show: false })} severity={toast.success ? "success" : "error"} sx={{ width: "100%" }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Orders;
