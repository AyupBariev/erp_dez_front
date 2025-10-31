import { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";
import type { Order } from "../../api/orders";
import { assignOrder, cancelOrder } from "../../api/orders";
import type { Engineer } from "../../api/engineer";

interface Props {
    engineers: Engineer[];
    orders: Order[];
    selectedDate: string;
}

const HOURS = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

export default function AssignOrdersTable({ engineers, orders = [] }: Props) {
    const [ordersState, setOrdersState] = useState<Order[]>(orders);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [statusMessages, setStatusMessages] = useState<Record<number, string>>({});
    const [toast, setToast] = useState({ visible: false, success: true, message: "" });
    const [selectedEngineers, setSelectedEngineers] = useState<Record<number, number | null>>({});

    useEffect(() => {
        setOrdersState(orders);
    }, [orders]);

    const handleEngineerChange = (orderId: number, engineerId: number | null) => {
        setSelectedEngineers(prev => ({
            ...prev,
            [orderId]: engineerId,
        }));
    };

    const getOrdersForTimeSlot = (engineerId: number, hour: string) => {
        return ordersState.filter(o => {
            if (o.engineer?.id !== engineerId || !o.scheduled_at) return false;

            const orderTime = new Date(o.scheduled_at);
            const orderHours = orderTime.getHours().toString().padStart(2, '0');
            const orderTimeString = `${orderHours}:00`;

            return orderTimeString === hour;
        });
    };

    const unassignedOrders = ordersState.filter(o => !o.engineer);

    const handleAssign = async (erpNumber: number, engineerId: number | null) => {
        if (!engineerId) {
            setStatusMessages(prev => ({ ...prev, [erpNumber]: "⚠️ Выберите СИ перед назначением" }));
            return;
        }

        try {
            setLoadingId(erpNumber);
            const updatedOrder = await assignOrder(erpNumber, engineerId);
            setOrdersState(prev => prev.map(o => o.erp_number === updatedOrder.erp_number ? updatedOrder : o));
            setStatusMessages(prev => ({ ...prev, [erpNumber]: "⏳ Назначено. Ждёт подтверждения инженером." }));
            setToast({ visible: true, success: true, message: "✅ Заказ успешно назначен" });
        } catch {
            setStatusMessages(prev => ({ ...prev, [erpNumber]: "❌ Ошибка при назначении." }));
            setToast({ visible: true, success: false, message: "❌ Ошибка при назначении" });
        } finally {
            setLoadingId(null);
        }
    };

    const handleCancel = async (erpNumber: number) => {
        try {
            setLoadingId(erpNumber);
            await cancelOrder(erpNumber);
            setStatusMessages(prev => ({ ...prev, [erpNumber]: "✅ Заказ отменён клиентом." }));
            setToast({ visible: true, success: true, message: "✅ Заказ отменён клиентом" });
        } catch {
            setStatusMessages(prev => ({ ...prev, [erpNumber]: "❌ Ошибка при отмене." }));
            setToast({ visible: true, success: false, message: "❌ Ошибка при отмене" });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <Box>
            {/* Горизонтальная таблица */}
            <Paper sx={{ overflow: 'auto', mb: 3 }}>
                <Box sx={{ minWidth: 2400 }}>
                    {/* Заголовок */}
                    <Grid container sx={{ borderBottom: 2, borderColor: 'divider' }}>
                        <Grid sx={{ p: 2, width: 250, borderRight: 2, borderColor: 'divider', position: 'sticky', left: 0, bgcolor: 'background.paper' }}>
                            Инженер
                        </Grid>
                        {HOURS.map(h => (
                            <Grid key={h} sx={{ p: 2, textAlign: 'center', fontWeight: 'bold', borderRight: 2, borderColor: 'divider', flex: '0 0 120px' }}>
                                <Typography variant="body1" fontWeight="bold">{h}</Typography>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Инженеры */}
                    {engineers.map(eng => (
                        <Grid container key={eng.id} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: eng.is_working ? 'background.paper' : 'grey.100', '&:hover': { bgcolor: 'action.hover' } }}>
                            <Grid sx={{ p: 2, width: 250, borderRight: 2, borderColor: 'divider', position: 'sticky', left: 0, bgcolor: eng.is_working ? 'background.paper' : 'grey.100', zIndex: 1 }}>
                                <Typography fontWeight={600}>{eng.first_name} {eng.second_name}</Typography>
                            </Grid>
                            {HOURS.map(h => (
                                <Grid key={h} sx={{ width: 120, minHeight: 120, borderRight: 2, borderColor: 'divider', p: 1 }}>
                                    {getOrdersForTimeSlot(eng.id, h).map(order => (
                                        <Card key={order.erp_number} sx={{
                                            p: 1.5,
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                                transform: 'scale(1.02)',
                                                transition: 'all 0.2s'
                                            }
                                        }}>
                                            <Typography variant="subtitle1" fontWeight="bold" textAlign="center">№{order.erp_number}</Typography>
                                            <Typography variant="body2" textAlign="center" sx={{ opacity: 0.9, mt: 0.5 }}>{order.client_name}</Typography>
                                            <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8, mt: 0.5 }}>{order.address}</Typography>
                                        </Card>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Box>
            </Paper>

            {/* Нераспределённые заказы */}
            <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Нераспределённые заказы</Typography>
                {unassignedOrders.length > 0 ? (
                    <Stack spacing={2}>
                        {unassignedOrders.map(o => {
                            const selectedEngineer = selectedEngineers[o.erp_number] ?? null;
                            return (
                                <Card key={o.erp_number} sx={{ p: 2 }} variant="outlined">
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>📦 Заказ №{o.erp_number}</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>⏰ {o.scheduled_at}</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>📍 {o.address}</Typography>

                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                        <Select
                                            value={selectedEngineer ?? ''}
                                            onChange={(e: SelectChangeEvent<number>) =>
                                                handleEngineerChange(o.erp_number, e.target.value ? Number(e.target.value) : null)
                                            }
                                        >
                                            <MenuItem value="">Выбрать СИ</MenuItem>
                                            {engineers.filter(e => e.is_working).map(e => (
                                                <MenuItem key={e.id} value={e.id}>{e.first_name} {e.second_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Stack direction="row" spacing={1}>
                                        <Button variant="contained" disabled={loadingId === o.erp_number} onClick={() => handleAssign(o.erp_number, selectedEngineer)} sx={{ flex: 1 }}>
                                            {loadingId === o.erp_number ? <CircularProgress size={20} /> : "Назначить"}
                                        </Button>
                                        <Button variant="outlined" color="error" disabled={loadingId === o.erp_number} onClick={() => handleCancel(o.erp_number)} sx={{ flex: 1 }}>
                                            {loadingId === o.erp_number ? "..." : "Отменён клиентом"}
                                        </Button>
                                    </Stack>

                                    {statusMessages[o.erp_number] && (
                                        <Alert severity="info" sx={{ mt: 1 }}>{statusMessages[o.erp_number]}</Alert>
                                    )}
                                </Card>
                            );
                        })}
                    </Stack>
                ) : (
                    <Typography color="text.secondary">Все заказы распределены 🎉</Typography>
                )}
            </Card>

            <Snackbar
                open={toast.visible}
                autoHideDuration={1500}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={toast.success ? 'success' : 'error'} onClose={() => setToast(prev => ({ ...prev, visible: false }))}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
