import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { Order } from "../../api/orders";

interface Props {
    orders: Order[];
    onEdit: (order: Order) => void;
}

// Цвета статусов
const statusColors: Record<string, string> = {
    new: "#2196f3",
    thinking: "#ff9800",
    in_proccess: "#9c27b0",
    working: "#4caf50",
    closed_without_repeat: "#795548",
    closed_finally: "#607d8b",
    canceled: "#f44336",
};

// Русские названия статусов
const statusLabels: Record<string, string> = {
    new: "Обращение",
    thinking: "Клиент думает",
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {orders.map((order) => (
                <Box
                    key={order.id}
                    sx={{
                        flex: "0 0 calc(25% - 16px)", // 4 карточки в ряд с gap
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

                            {/* Статус */}
                            <Chip
                                label={statusLabels[order.status] || order.status}
                                size="small"
                                sx={{
                                    backgroundColor: statusColors[order.status] || "#757575",
                                    color: "white",
                                    mb: 2,
                                    fontWeight: 600,
                                }}
                            />

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
                                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
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
