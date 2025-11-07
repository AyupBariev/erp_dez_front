import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    TextField,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton, Snackbar, Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssignOrdersTable from "../../components/assignOrders/AssignOrdersTable";
import type { Order, CreateOrderRequest } from "../../api/orders";
import { getOrders, updateOrder } from "../../api/orders";
import type { Engineer } from "../../api/engineer";
import { getEngineers } from "../../api/engineer";
import OrderForm from "../../components/orders/OrderForm";

export default function AssignOrders() {
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, success: true, message: "" });

    // Добавляем эти 3 состояния
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [engs, ords]: [Engineer[], Order[]] = await Promise.all([
                    getEngineers(selectedDate),
                    getOrders(selectedDate),
                ]);
                setEngineers(engs);
                setOrders(ords);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedDate]);

    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setShowModal(true);
    };

    const handleEngineerUpdate = async () => {
        try {
            const engs = await getEngineers(selectedDate);
            setEngineers(engs);
        } catch (error) {
            console.error("Ошибка обновления инженеров:", error);
            setToast({ show: true, success: false, message: "Ошибка при обновлении данных инженеров" });
        }
    };

    const handleSave = async (formData: CreateOrderRequest, orderNumber?: number) => {
        try {
            setFormLoading(true);
            if (orderNumber) {
                const updatedOrder = await updateOrder(orderNumber, formData);

                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.erp_number === orderNumber
                            ? { ...order, ...updatedOrder }
                            : order
                    )
                );

                setToast({ show: true, success: true, message: "Заказ успешно обновлён!" });
            }
            setShowModal(false);
        } catch (error) {
            console.error("Ошибка сохранения:", error);
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
        <Box sx={{ height: '100%', overflow: 'auto' }}>
            <Card sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Маршрутка
                    </Typography>
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        size="small"
                    />
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <AssignOrdersTable
                        engineers={engineers}
                        orders={orders}
                        selectedDate={selectedDate}
                        onEditOrder={handleEdit}
                        onEngineerUpdate={handleEngineerUpdate}
                    />
                )}
            </Card>

            {/* Добавляем модалку */}
            <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>
                    Редактировать заказ
                    <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <OrderForm
                        order={editingOrder}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                        formLoading={formLoading}
                    />
                </DialogContent>
            </Dialog>
            <Snackbar
                open={toast.show}
                autoHideDuration={3000}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                    severity={toast.success ? "success" : "error"}
                    sx={{ width: "100%" }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}