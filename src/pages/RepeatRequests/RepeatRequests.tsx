import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {useRepeatRequests} from "../../hooks/useRepeatRequests";
import {useState} from "react";
import dayjs from "dayjs";
import type {CreateOrderRequest, Order} from "../../api/orders.ts";
import OrderForm from "../../components/orders/OrderForm.tsx";
import CloseIcon from "@mui/icons-material/Close";
type EditedOrder = Partial<Order> & {
    date?: string;
    time?: string;
    our_percent?: number;
    price?: string;
};
export default function RepeatRequestsPage() {
    const {data, loading, confirm} = useRepeatRequests();
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [repeatRequestId, setRepeatRequestId] = useState<number>(1);
    const [editedOrders, setEditedOrders] = useState<Record<number, EditedOrder>>({});

    const handleCreateRepeat = (req: any) => {
        setEditingOrder({
            ...req.order,
            repeat_erp_number: req.order.erp_number,
            our_percent: editedOrders[req.id]?.our_percent ?? req.order.our_percent,
            price: editedOrders[req.id]?.price ?? String(req.order.price),
            scheduled_at: editedOrders[req.id]?.scheduled_at || req.scheduled_at,
            engineer_id: req.order?.engineer?.id,
            erp_number: undefined,
        } as Order);
        setRepeatRequestId(req.id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingOrder(null);
    };

    const handleSave = async (formData: CreateOrderRequest) => {
        try {
            setFormLoading(true);

            await confirm(repeatRequestId, {
                ...editingOrder,
                ...formData,
            });

            setShowModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <CircularProgress/>;

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Мастер</TableCell>
                        <TableCell>Заказ</TableCell>
                        <TableCell>Дата и время</TableCell>
                        <TableCell sx={{width: 130}}>Наш %</TableCell>
                        <TableCell sx={{width: 150}}>Сумма</TableCell>
                        <TableCell>Описание</TableCell>
                        <TableCell sx={{width: 100}}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <>
                        {data.map((req: any) => {
                            return (
                                <TableRow key={req.id} hover>
                                    <TableCell>{req.order.engineer.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleCreateRepeat(req)
                                            }
                                        >
                                            #{req.order.erp_number}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <TextField
                                                label="Дата"
                                                type="date"
                                                value={
                                                    editedOrders[req.id]?.date ??
                                                    (req.scheduled_at ? dayjs(req.scheduled_at).format("YYYY-MM-DD") : "")
                                                }
                                                onChange={(e) =>
                                                    setEditedOrders((prev) => ({
                                                        ...prev,
                                                        [req.id]: {
                                                            ...prev[req.id],
                                                            date: e.target.value,
                                                            // если уже есть время — обновляем scheduled_at
                                                            scheduled_at: e.target.value && prev[req.id]?.time
                                                                ? `${e.target.value}T${prev[req.id].time}`
                                                                : prev[req.id]?.scheduled_at,
                                                        },
                                                    }))
                                                }
                                                InputLabelProps={{shrink: true}}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Время"
                                                type="time"
                                                value={
                                                    editedOrders[req.id]?.time ??
                                                    (req.scheduled_at ? dayjs(req.scheduled_at).format("HH:mm") : "")
                                                }
                                                onChange={(e) =>
                                                    setEditedOrders((prev) => ({
                                                        ...prev,
                                                        [req.id]: {
                                                            ...prev[req.id],
                                                            time: e.target.value,
                                                            scheduled_at: prev[req.id]?.date
                                                                ? `${prev[req.id].date}T${e.target.value}`
                                                                : prev[req.id]?.scheduled_at,
                                                        },
                                                    }))
                                                }
                                                InputLabelProps={{shrink: true}}
                                                fullWidth
                                            />
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={editedOrders[req.id]?.our_percent ?? req.order.our_percent}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || /^(\d+(\.\d*)?)?$/.test(value)) {
                                                    const numValue = Number(value);
                                                    if (value === "" || (numValue >= 0 && numValue <= 100)) {
                                                        setEditedOrders(prev => ({
                                                            ...prev,
                                                            [req.id]: {
                                                                ...prev[req.id],
                                                                our_percent: value === "" ? undefined : numValue
                                                            }
                                                        }));
                                                    }
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={editedOrders[req.id]?.price ?? req.order.price}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || /^(\d+(\.\d*)?)?$/.test(value)) {
                                                    setEditedOrders(prev => ({
                                                        ...prev,
                                                        [req.id]: {
                                                            ...prev[req.id],
                                                            price: value === "" ? "" : String(value)
                                                        }
                                                    }));
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{req.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                confirm(req.id, {
                                                    ...req.order,
                                                    ...editedOrders[req.id],
                                                    scheduled_at: editedOrders[req.id]?.scheduled_at ?? req.scheduled_at,
                                                    engineer_id: req.order?.engineer?.id,
                                                    repeat_erp_number: req.order.erp_number,

                                                })
                                            }
                                        >
                                            Подтверждаю
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </>
                </TableBody>
            </Table>

            <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <span>{editingOrder ? `Редактировать заказ` : "Создать заказ"}</span>
                    <IconButton onClick={handleCloseModal} disabled={formLoading}>
                        <CloseIcon/>
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
        </>
    );
}
