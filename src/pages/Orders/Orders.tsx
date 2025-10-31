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
    Stack,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { getOrders, createOrder } from "../../api/orders";
import type { Order, CreateOrderRequest } from "../../api/orders";
import OrdersTabs from "../../components/orders/OrdersTabs";
import OrderForm from "../../components/orders/OrderForm";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<string>("new");
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, success: true, message: "" });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);


    // --- Загрузка заказов ---
    const loadOrders = async () => {
        try {
            setLoading(true);
            const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
            const data = await getOrders(dateString); //
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
        <Box sx={{ p: 3 }}>
            {/* Заголовок */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <RefreshIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>Заказы</Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Дата"
                            value={selectedDate}
                            onChange={(newDate: Date | null) => setSelectedDate(newDate)}
                        />
                    </LocalizationProvider>

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
            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="div">
                        {editingOrder
                            ? `Редактировать заказ №${editingOrder.erp_number}`
                            : "Создать заказ"}
                    </Typography>
                    <IconButton onClick={() => setShowModal(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <OrderForm
                        order={editingOrder}
                        onSave={handleSave}
                        onCancel={() => setShowModal(false)}
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
