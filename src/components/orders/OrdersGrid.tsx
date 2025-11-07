import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Stack, Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { Order } from "../../api/orders";
import {getStatusColor} from "../../utils/orderStatus.ts";
import {RepeatIcon} from "lucide-react";

interface Props {
    orders: Order[];
    onEdit: (order: Order) => void;
}

// Русские названия статусов
const statusLabels: Record<string, string> = {
    all: "Все",
    new: "Новые",
    in_proccess: "Логист выдал",
    working: "Инженер принял",
    closed_without_repeat: "На рассмотрении",
    closed_finally: "Успешно закрыт",
    canceled: "Отменен",
};

const OrdersGrid: React.FC<Props> = ({ orders, onEdit }) => {
    if (orders.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary">
                    Нет заказов в этом статусе
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {orders.map((order) => (
                <Box
                    key={order.id}
                    sx={{
                        flex: "0 0 calc(15% - 16px)", // 4 карточки в ряд с gap
                        minWidth: 250,
                    }}
                >
                    <Card
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition: "0.3s",
                            "&:hover": {
                                boxShadow: 6,
                                transform: "translateY(-2px)",
                            },
                            overflow: "hidden",
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            {/* Заголовок */}
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                <Typography variant="h6" component="h3" fontWeight={600}>
                                    №{order.erp_number}
                                </Typography>
                                <IconButton size="small" onClick={() => onEdit(order)} sx={{ mt: -0.5 }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Stack>

                            {/* Статус и метка повтора */}
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <Chip
                                    label={statusLabels[order.status] || order.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: getStatusColor(order.status) || "#757575",
                                        color: "white",
                                        fontWeight: 600,
                                    }}
                                />

                                {/* Метка "Повтор" с иконкой */}
                                {order.repeat_id && (
                                    <Tooltip title="Повторный заказ" arrow>
                                        <Chip
                                            icon={<RepeatIcon fontSize="small" />}
                                            label="Повтор"
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            sx={{
                                                fontWeight: 600,
                                                borderColor: "#6b0980",
                                                borderWidth: 1.7,
                                                color: "#8d0ba3",
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </Stack>

                            {/* Клиент */}
                            <Box mb={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Клиент:
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {order.client_name || "Не указан"}
                                </Typography>
                            </Box>

                            {/* Телефон */}
                            {order.phones && order.phones.length > 0 && (
                                <Box mb={1}>
                                    <Typography variant="body2" color="text.secondary">
                                        Телефон:
                                    </Typography>
                                    <Stack direction="column" spacing={0.5}>
                                        {order.phones.map((phone, idx) => (
                                            <Typography key={idx} variant="body2" fontWeight={500}>
                                                {phone}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Адрес */}
                            {order.address && (
                                <Box mb={1}>
                                    <Typography variant="body2" color="text.secondary">
                                        Адрес:
                                    </Typography>
                                    <Typography variant="body2"  sx={{
                                        wordBreak: "break-word",
                                        maxHeight: 60, // Максимальная высота в px
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3, // Максимальное количество строк
                                        WebkitBoxOrient: "vertical",
                                    }}>
                                        {order.address}
                                    </Typography>
                                </Box>
                            )}

                            {/* Проблема */}
                            {order.problem?.name && (
                                <Box mb={2}>
                                    <Typography variant="body2" color="text.secondary">
                                        Проблема:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            whiteSpace: "pre-line",
                                            overflowWrap: "break-word",
                                        }}
                                    >
                                        {order.problem.name}
                                    </Typography>
                                </Box>
                            )}

                            {/* Сумма */}
                            {order.price && (
                                <Box mb={1}>
                                    <Typography variant="body2" color="green" fontWeight={600}>
                                        Сумма: {order.price} ₽
                                    </Typography>
                                </Box>
                            )}

                            {/* Дата */}
                            <Box sx={{ mt: "auto" }}>
                                <Typography variant="caption" color="text.secondary">
                                    Дата ожидания: {order.scheduled_at ? new Date(order.scheduled_at).toLocaleString() : "-"}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
};

export default OrdersGrid;
