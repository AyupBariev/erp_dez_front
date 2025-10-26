import { useState, useEffect } from "react";
import "./AssignOrdersTable.css";
import { assignOrder, cancelOrder } from "../../api/orders";
import ShareToast from "../share/ShareToast";

interface Engineer {
    id: number;
    name: string;
    is_working: boolean;
}

interface Order {
    id: number;
    erp_number: number;
    client_name: string;
    address: string;
    scheduled_at: string;
    status: string;
    engineer?: Engineer | null;
}

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

export default function AssignOrdersTable({ engineers, orders = [], selectedDate }: Props) {
    const [ordersState, setOrdersState] = useState<Order[]>(orders);

    useEffect(() => {
        setOrdersState(orders);
    }, [orders]);

    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [statusMessages, setStatusMessages] = useState<Record<number, string>>({});
    const [toast, setToast] = useState<{ visible: boolean; success: boolean; message: string }>({
        visible: false,
        success: true,
        message: "",
    });

    // выбранные инженеры
    const [selectedEngineers, setSelectedEngineers] = useState<Record<number, number | null>>({});

    const handleEngineerChange = (orderId: number, engineerId: number | null) => {
        setSelectedEngineers((prev) => ({
            ...prev,
            [orderId]: engineerId,
        }));
    };

    const getOrdersForEngineer = (engineerId: number, hour: string) => {
        const hourPrefix = `${hour.split(":")[0].padStart(2, "0")}:`;
        return ordersState.filter(
            (o) =>
                o.engineer?.id === engineerId &&
                o.scheduled_at.includes(hourPrefix)
        );
    };

    const unassignedOrders = ordersState.filter((o) => !o.engineer);

    const handleAssign = async (ErpNumber: number, engineerId: number | null) => {
        if (!engineerId) {
            setStatusMessages((prev) => ({
                ...prev,
                [ErpNumber]: "⚠️ Выберите СИ перед назначением",
            }));
            return;
        }

        try {
            setLoadingId(ErpNumber);
            const updatedOrder = await assignOrder(ErpNumber, engineerId);

            // ✅ обновляем список заказов
            setOrdersState((prev) =>
                prev.map((o) => (o.erp_number === updatedOrder.erp_number ? updatedOrder : o))
            );

            setStatusMessages((prev) => ({
                ...prev,
                [ErpNumber]: "⏳ Назначено. Ждёт подтверждения инженером.",
            }));
            setToast({
                visible: true,
                success: true,
                message: "✅ Заказ успешно назначен",
            });
        } catch {
            setStatusMessages((prev) => ({
                ...prev,
                [ErpNumber]: "❌ Ошибка при назначении.",
            }));
            setToast({
                visible: true,
                success: false,
                message: "❌ Ошибка при назначении",
            });
        } finally {
            setLoadingId(null);
        }
    };

    const handleCancel = async (ErpNumber: number) => {
        try {
            setLoadingId(ErpNumber);
            await cancelOrder(ErpNumber);
            setStatusMessages((prev) => ({
                ...prev,
                [ErpNumber]: "✅ Заказ отменён клиентом.",
            }));
            setToast({
                visible: true,
                success: true,
                message: "✅ Заказ отменён клиентом",
            });
        } catch {
            setStatusMessages((prev) => ({
                ...prev,
                [ErpNumber]: "❌ Ошибка при отмене.",
            }));
            setToast({
                visible: true,
                success: false,
                message: "❌ Ошибка при отмене",
            });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="assign-wrapper card">
            {/* Горизонтально прокручиваемая таблица */}
            <div className="assign-scroll">
                <div className="assign-table">
                    {/* Шапка */}
                    <div className="assign-header">
                        <div className="engineer-col">Инженер</div>
                        {HOURS.map((h) => (
                            <div key={h} className="hour-col">
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Список инженеров */}
                    {engineers.map((eng) => (
                        <div
                            key={eng.id}
                            className={`assign-row ${
                                eng.is_working ? "working-row" : "off-duty-row"
                            }`}
                        >
                            <div className="engineer-name">{eng.name}</div>
                            {HOURS.map((h) => (
                                <div key={h} className="hour-cell">
                                    {getOrdersForEngineer(eng.id, h).map((order) => (
                                        <div key={order.erp_number} className="order-box shadow-sm">
                                            <div className="fw-bold">№{order.erp_number}</div>
                                            <div className="small text-muted">{order.address}</div>
                                            <div className="small">
                                                🕒 {new Date(order.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Нераспределённые заказы */}
            <div className="unassigned-block mt-3 p-3">
                <h6>Нераспределённые заказы</h6>
                {unassignedOrders.length > 0 ? (
                    unassignedOrders.map((o) => {
                    const selectedEngineer = selectedEngineers[o.erp_number] ?? null;
                    return (
                    <div key={o.erp_number} className="unassigned-order card p-3 mb-3 shadow-sm border">
                        <div className="mb-1 fw-bold">📦 Заказ №{o.erp_number}</div>
                        <div className="text-muted small">⏰ {o.scheduled_at}</div>
                        <div className="text-muted small mb-2">📍 {o.address}</div>

                            <select
                                className="form-select mb-3"
                                value={selectedEngineer ?? ""}
                                onChange={(e) =>
                                    handleEngineerChange(
                                        o.erp_number,
                                        e.target.value ? Number(e.target.value) : null
                                    )
                                }
                            >
                            <option value="">Выбрать СИ</option>
                            {engineers
                                .filter((e) => e.is_working)
                                .map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.name}
                                    </option>
                                ))}
                        </select>

                        <div className="d-flex gap-2">
                                <button
                                    className="btn btn-success w-50"
                                    disabled={loadingId === o.erp_number}
                                    onClick={() => handleAssign(o.erp_number, selectedEngineer)}
                                >
                                    {loadingId === o.erp_number ? "⏳" : "Назначить"}
                            </button>
                                <button
                                    className="btn btn-outline-danger w-50"
                                    disabled={loadingId === o.erp_number}
                                    onClick={() => handleCancel(o.erp_number)}
                                >
                                    {loadingId === o.erp_number ? "..." : "Отменён клиентом"}
                                </button>
                            </div>

                            {statusMessages[o.erp_number] && (
                                <div className="text-center mt-2 small text-muted">
                                    {statusMessages[o.erp_number]}
                        </div>
                            )}
                    </div>
                    );
                    })
                ) : (
                    <div className="text-muted small">Все заказы распределены 🎉</div>
                )}
            </div>

            <ShareToast
                show={toast.visible}
                success={toast.success}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
                duration={1500}
            />
        </div>
    );
}
