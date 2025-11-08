import {useEffect, useState} from "react";
import type {SelectChangeEvent} from "@mui/material";
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Tooltip,
    Typography,
    Switch,
} from "@mui/material";
import type {Order} from "../../api/orders";
import {assignOrder, cancelOrder, unAssignOrder} from "../../api/orders";
import type {Engineer} from "../../api/engineer";
import { updateEngineerWorkingStatus } from "../../api/engineer";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {getStatusColor, getStatusLabel} from "../../utils/orderStatus.ts";

interface Props {
    engineers: Engineer[];
    orders: Order[];
    selectedDate: string;
    onEditOrder?: (order: Order) => void;
    onEngineerUpdate?: () => void; // Callback для обновления данных
}

const HOURS = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

export default function AssignOrdersTable({engineers, orders = [], onEditOrder, onEngineerUpdate}: Props) {
    const [ordersState, setOrdersState] = useState<Order[]>(orders);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [unassignLoadingId, setUnassignLoadingId] = useState<number | null>(null);
    const [statusMessages, setStatusMessages] = useState<Record<number, string>>({});
    const [toast, setToast] = useState({visible: false, success: true, message: ""});
    const [selectedEngineers, setSelectedEngineers] = useState<Record<number, number | null>>({});
    const [workingLoading, setWorkingLoading] = useState<number | null>(null);

    useEffect(() => {
        setOrdersState(orders);
    }, [orders]);

    // Сортируем инженеров: сначала работающие, потом неработающие
    const sortedEngineers = [...engineers].sort((a, b) => {
        if (a.is_working === b.is_working) return 0;
        return a.is_working ? -1 : 1;
    });

    const handleEngineerChange = (orderNumber: number, engineerId: number | null) => {
        setSelectedEngineers(prev => ({
            ...prev,
            [orderNumber]: engineerId,
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

    const unassignedOrders = ordersState.filter(o => !o.engineer && o.status == 'new');

    const handleAssign = async (erpNumber: number, engineerId: number | null) => {
        if (!engineerId) {
            setStatusMessages(prev => ({...prev, [erpNumber]: "⚠️ Выберите СИ перед назначением"}));
            return;
        }

        try {
            setLoadingId(erpNumber);
            const updatedOrder = await assignOrder(erpNumber, engineerId);
            setOrdersState(prev => prev.map(o => o.erp_number === updatedOrder.erp_number ? updatedOrder : o));
            setStatusMessages(prev => ({...prev, [erpNumber]: "⏳ Назначено. Ждёт подтверждения инженером."}));
            setToast({visible: true, success: true, message: "✅ Заказ успешно назначен"});
        } catch {
            setStatusMessages(prev => ({...prev, [erpNumber]: "❌ Ошибка при назначении."}));
            setToast({visible: true, success: false, message: "❌ Ошибка при назначении"});
        } finally {
            setLoadingId(null);
        }
    };

    const handleUnassign = async (erpNumber: number) => {
        try {
            setUnassignLoadingId(erpNumber);
            const updatedOrder = await unAssignOrder(erpNumber);
            setOrdersState(prev => prev.map(o => o.erp_number === updatedOrder.erp_number ? updatedOrder : o));
            setToast({visible: true, success: true, message: "✅ Заказ снят с инженера"});
        } catch {
            setToast({visible: true, success: false, message: "❌ Ошибка при снятии заказа"});
        } finally {
            setUnassignLoadingId(null);
        }
    };

    const handleCancel = async (erpNumber: number) => {
        try {
            setLoadingId(erpNumber);
            await cancelOrder(erpNumber);
            setStatusMessages(prev => ({...prev, [erpNumber]: "✅ Заказ отменён клиентом."}));
            setToast({visible: true, success: true, message: "✅ Заказ отменён клиентом"});
        } catch {
            setStatusMessages(prev => ({...prev, [erpNumber]: "❌ Ошибка при отмене."}));
            setToast({visible: true, success: false, message: "❌ Ошибка при отмене"});
        } finally {
            setLoadingId(null);
        }
    };

    const handleToggleWorking = async (engineerId: number, currentStatus: boolean) => {
        try {
            setWorkingLoading(engineerId);
            await updateEngineerWorkingStatus(engineerId, !currentStatus);
            setToast({visible: true, success: true, message: `✅ Статус инженера обновлён`});
            onEngineerUpdate?.(); // Уведомляем родителя об обновлении
        } catch {
            setToast({visible: true, success: false, message: "❌ Ошибка при обновлении статуса"});
        } finally {
            setWorkingLoading(null);
        }
    };

    return (
        <Box>
            {/* Нераспределённые заказы */}
            <Card sx={{p: 3, mb: 3}}>
                <Typography variant="h6" gutterBottom>Нераспределённые заказы</Typography>
                {unassignedOrders.length > 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            alignItems: 'flex-start'
                        }}
                    >
                        {unassignedOrders.map(o => {
                            const selectedEngineer = selectedEngineers[o.erp_number] ?? null;
                            return (
                                <Card
                                    key={o.erp_number}
                                    sx={{
                                        p: 2,
                                        minWidth: 280,
                                        maxWidth: 320,
                                        flex: '1 1 300px',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    variant="outlined"
                                >
                                    {/* Заголовок с номером и статусом */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start"
                                           mb={1}>
                                        <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{maxWidth: '60%'}}>
                                            📦 №{o.erp_number}
                                            {o.repeat_id && (
                                                <Tooltip title="Повторный заказ" arrow>
                                                    <RestartAltIcon
                                                        fontSize="small"
                                                        sx={{
                                                            ml: 0.5,
                                                            color: 'secondary.main',
                                                            verticalAlign: 'middle'
                                                        }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Typography>
                                        <Chip
                                            label={getStatusLabel(o.status) || o.status}
                                            size="small"
                                            sx={{
                                                backgroundColor: getStatusColor(o.status),
                                                color: "white",
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                            }}
                                        />
                                    </Stack>

                                    {/* Информация о заказе */}
                                    <Box sx={{mb: 2, flexGrow: 1, height: '120px'}}>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" color="text.secondary" noWrap
                                                        title={o.scheduled_at}>
                                                ⏰ Встреча: <strong>{o.scheduled_at}</strong>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap
                                                        title={o.problem?.name}>
                                                🔧 Проблема: <strong>{o.problem?.name}</strong>
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: 1.3
                                                }}
                                                title={o.address}
                                            >
                                                📍 Адрес: {o.address}
                                            </Typography>
                                            <Typography variant="body2" color="green" fontWeight={600}>
                                                💰Сумма: {o.price} ₽
                                            </Typography>
                                        </Stack>
                                    </Box>

                                    {/* Выбор инженера */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <Select
                                            value={selectedEngineer ?? ''}
                                            onChange={(e: SelectChangeEvent<number>) =>
                                                handleEngineerChange(o.erp_number, e.target.value ? Number(e.target.value) : null)
                                            }
                                        >
                                            <MenuItem value="">Выбрать СИ</MenuItem>
                                            {engineers
                                                .filter(e => e.is_working) // Только работающие инженеры
                                                .map(e => (
                                                    <MenuItem key={e.id} value={e.id}>
                                                        {e.first_name} {e.second_name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>

                                    {/* Кнопки действий */}
                                    <Stack direction="row" spacing={1} sx={{mt: 'auto'}}>
                                        <Button
                                            variant="contained"
                                            disabled={loadingId === o.erp_number}
                                            onClick={() => handleAssign(o.erp_number, selectedEngineer)}
                                            sx={{flex: 1}}
                                            size="small"
                                        >
                                            {loadingId === o.erp_number ? <CircularProgress size={16}/> : "Назначить"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            disabled={loadingId === o.erp_number}
                                            onClick={() => handleCancel(o.erp_number)}
                                            sx={{flex: 1}}
                                            size="small"
                                        >
                                            {loadingId === o.erp_number ? "..." : "Отмена"}
                                        </Button>
                                    </Stack>

                                    {/* Статус сообщения */}
                                    {statusMessages[o.erp_number] && (
                                        <Alert
                                            severity="info"
                                            sx={{
                                                mt: 1,
                                                py: 0.5,
                                                '& .MuiAlert-message': {fontSize: '0.75rem'}
                                            }}
                                        >
                                            {statusMessages[o.erp_number]}
                                        </Alert>
                                    )}
                                </Card>
                            );
                        })}
                    </Box>
                ) : (
                    <Typography color="text.secondary">Все заказы распределены 🎉</Typography>
                )}
            </Card>

            {/* Горизонтальная таблица */}
            <Paper sx={{overflow: 'auto'}}>
                <Box sx={{minWidth: 2400}}>
                    {/* Заголовок */}
                    <Grid container sx={{borderBottom: 2, borderColor: 'divider'}}>
                        <Grid sx={{
                            p: 1,
                            width: 150, // Увеличили ширину для тумблера
                            borderRight: 2,
                            borderColor: 'divider',
                            position: 'sticky',
                            left: 0,
                            bgcolor: 'background.paper',
                            zIndex: 2
                        }}>
                            Инженер
                        </Grid>
                        {HOURS.map(h => (
                            <Grid key={h} sx={{
                                p: 2,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                borderRight: 2,
                                borderColor: 'divider',
                                flex: '0 0 100px'
                            }}>
                                <Typography variant="body1" fontWeight="bold">{h}</Typography>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Инженеры */}
                    {sortedEngineers.map(eng => (
                        <Grid container key={eng.id} sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: eng.is_working ? 'background.paper' : '#ffebee', // Красный фон для неработающих
                            '&:hover': {bgcolor: eng.is_working ? 'action.hover' : '#fce4ec'}
                        }}>
                            <Grid sx={{
                                display: 'flex',
                                alignItems: 'left',
                                flexDirection: 'column',
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                p: 1,
                                width: 150,
                                borderRight: 2,
                                borderColor: 'divider',
                                position: 'sticky',
                                left: 0,
                                bgcolor: eng.is_working ? 'background.paper' : '#ffebee',
                                zIndex: 1
                            }}>
                                <Box>
                                    <Typography
                                        fontWeight={600}
                                        color={eng.is_working ? 'text.primary' : 'text.secondary'}
                                    >
                                        {eng.first_name} {eng.second_name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color={eng.is_working ? 'success.main' : 'error.main'}
                                    >
                                        {eng.is_working ? '🟢 Работает' : '🔴 Не работает'}
                                    </Typography>
                                </Box>
                                <Tooltip title={eng.is_working ? "Выключить" : "Включить"} arrow>
                                    <Box sx={{
                                        direction: 'rtl'
                                    }}>
                                        {workingLoading === eng.id ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <Switch
                                                checked={eng.is_working}
                                                onChange={() => handleToggleWorking(eng.id, eng.is_working)}
                                                color="success"
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                </Tooltip>
                            </Grid>
                            {HOURS.map(h => (
                                <Grid key={h}
                                      sx={{
                                          width: 100,
                                          minHeight: 120,
                                          borderRight: 2,
                                          borderColor: 'divider',
                                          p: 0.5,
                                          opacity: eng.is_working ? 1 : 0.7 // Полупрозрачные для неработающих
                                      }}>
                                    {getOrdersForTimeSlot(eng.id, h).map(order => (
                                        <Card key={order.erp_number} sx={{
                                            p: 1,
                                            bgcolor: getStatusColor(order.status),
                                            color: 'white',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&:hover': {
                                                bgcolor: `${getStatusColor(order.status)}dd`,
                                                transform: 'scale(1.02)',
                                                transition: 'all 0.2s'
                                            }
                                        }}
                                              onClick={() => onEditOrder?.(order)}>
                                            {/* Заголовок с номером заказа и иконкой повтора */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                mb: 0.5
                                            }}>
                                                <Typography variant="subtitle2" fontWeight="bold">{order.erp_number}
                                                </Typography>
                                                {order.repeat_id && (
                                                    <Tooltip title="Повторный заказ" arrow>
                                                        <RestartAltIcon fontSize="small" sx={{
                                                            ml: 0.5,
                                                            color: 'secondary.main',
                                                            bgcolor: 'white',
                                                            borderRadius: 1,
                                                            verticalAlign: 'middle'
                                                        }}/>
                                                    </Tooltip>
                                                )}
                                            </Box>

                                            {/* Информация о заказе */}
                                            <Box sx={{flexGrow: 1}}>
                                                <Typography variant="caption"
                                                            sx={{display: 'block', opacity: 0.9, lineHeight: 1.2}}>
                                                    {order.client_name}
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    display: 'block',
                                                    opacity: 0.8,
                                                    lineHeight: 1.1,
                                                    mt: 0.5
                                                }}>
                                                    {order.address && order.address.length > 20
                                                        ? `${order.address.substring(0, 20)}...`
                                                        : order.address}
                                                </Typography>
                                            </Box>

                                            {/* Статус и кнопка снятия */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mt: 0.5
                                            }}>
                                                <Typography variant="caption" sx={{opacity: 0.9}}>
                                                    {getStatusLabel(order.status)?.substring(0, 3)}...
                                                </Typography>
                                                <Tooltip title="Снять с инженера" arrow>
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: 'white',
                                                            p: 0.25,
                                                            '&:hover': {backgroundColor: 'rgba(255,255,255,0.2)'}
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUnassign(order.erp_number);
                                                        }}
                                                        disabled={unassignLoadingId === order.erp_number}
                                                    >
                                                        {unassignLoadingId === order.erp_number ? (
                                                            <CircularProgress size={12} color="inherit"/>
                                                        ) : (
                                                            <PersonRemoveIcon fontSize="medium"/>
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Card>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Box>
            </Paper>

            <Snackbar
                open={toast.visible}
                autoHideDuration={1500}
                onClose={() => setToast(prev => ({...prev, visible: false}))}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
                <Alert severity={toast.success ? 'success' : 'error'}
                       onClose={() => setToast(prev => ({...prev, visible: false}))}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}