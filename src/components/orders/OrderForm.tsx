import React, { useState } from "react";
import type { Order, CreateOrderRequest } from "../../api/orders";
import { IconPlus, IconX, IconDeviceFloppy } from "@tabler/icons-react";

interface Props {
    order: Order | null;
    onSave: (data: CreateOrderRequest) => void;
    onCancel: () => void;
}

const OrderForm: React.FC<Props> = ({ order, onSave, onCancel }) => {
    const [clientName, setClientName] = useState(order?.client_name || "");
    const [phones, setPhones] = useState<string[]>(order?.phones || [""]);
    const [address, setAddress] = useState(order?.address || "");
    const [problem, setProblem] = useState(order?.problem || "");
    const [title, setTitle] = useState(order?.title || "");
    const [scheduledAt, setScheduledAt] = useState(order?.scheduled_at || "");
    const [ourPercent, setOurPercent] = useState(order?.our_percent || 0);
    const [sourceId, setSourceId] = useState(order?.source_id || 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            source_id: sourceId,
            our_percent: ourPercent,
            client_name: clientName,
            phones,
            address,
            title,
            problem,
            scheduled_at: scheduledAt,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="card shadow-lg p-4 rounded-3 w-[450px] mx-auto"
        >
            <h3 className="card-title mb-4 text-lg fw-bold text-center">
                {order ? "✏️ Редактировать заказ" : "🆕 Новый заказ"}
            </h3>

            {/* Имя клиента */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Имя клиента</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Введите имя клиента"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                />
            </div>

            {/* Телефоны */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Телефоны</label>
                {phones.map((p, i) => (
                    <input
                        key={i}
                        type="text"
                        className="form-control mb-2"
                        placeholder={`Телефон ${i + 1}`}
                        value={p}
                        onChange={(e) => {
                            const newPhones = [...phones];
                            newPhones[i] = e.target.value;
                            setPhones(newPhones);
                        }}
                    />
                ))}
                <button
                    type="button"
                    onClick={() => setPhones([...phones, ""])}
                    className="btn btn-link text-blue d-flex align-items-center gap-1 ps-0"
                >
                    <IconPlus size={16} /> Добавить телефон
                </button>
            </div>

            {/* Адрес */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Адрес</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Введите адрес"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            {/* Проблематика */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Проблематика</label>
                <textarea
                    className="form-control"
                    placeholder="Опишите проблему"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    rows={2}
                />
            </div>

            {/* Заголовок */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Заголовок</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Введите заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Дата */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Дата и время</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                />
            </div>

            {/* Наш процент */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Наш %</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Процент"
                    value={ourPercent}
                    onChange={(e) => setOurPercent(Number(e.target.value))}
                />
            </div>

            {/* Источник */}
            <div className="mb-4">
                <label className="form-label fw-semibold">Источник</label>
                <select
                    className="form-select"
                    value={sourceId}
                    onChange={(e) => setSourceId(Number(e.target.value))}
                >
                    <option value={1}>Сайт</option>
                    <option value={2}>Телеграм</option>
                    <option value={3}>Instagram</option>
                    <option value={4}>Другое</option>
                </select>
            </div>

            {/* Кнопки */}
            <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-light d-flex align-items-center gap-1"
                >
                    <IconX size={16} /> Отмена
                </button>
                <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-1"
                >
                    <IconDeviceFloppy size={16} />{" "}
                    {order ? "Сохранить" : "Создать"}
                </button>
            </div>
        </form>
    );
};

export default OrderForm;
