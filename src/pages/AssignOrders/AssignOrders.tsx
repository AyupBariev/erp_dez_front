import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    TextField,
    CircularProgress,
} from "@mui/material";
import AssignOrdersTable from "../../components/assignOrders/AssignOrdersTable";
import type { Order } from "../../api/orders";
import { getOrders } from "../../api/orders";
import type { Engineer } from "../../api/engineer";
import { getEngineers } from "../../api/engineer";

export default function AssignOrders() {
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [loading, setLoading] = useState(false);

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

    return (
        <Box sx={{ p: 3 }}>
            <Card sx={{ p: 3, borderRadius: 2 }}>
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
                    />
                )}
            </Card>
        </Box>
    );
}