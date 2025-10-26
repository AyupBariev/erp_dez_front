import { useState } from "react";
import { createEngineer } from "../../api/engineer";

interface Props {
    onCreated: () => void;
}

export default function EngineerForm({ onCreated }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        second_name: "",
        username: "",
        phone: "",
        telegram_id: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEngineer({
                first_name: formData.first_name,
                second_name: formData.second_name,
                username: formData.username,
                phone: formData.phone,
                telegram_id: formData.telegram_id ? Number(formData.telegram_id) : undefined,
            });
            setFormData({
                first_name: "",
                second_name: "",
                username: "",
                phone: "",
                telegram_id: "",
            });
            onCreated(); // обновить список
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border p-3 mb-4">
            <h4>Добавить инженера</h4>
            <div>
                <label>Имя *</label>
                <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Фамилия</label>
                <input
                    type="text"
                    value={formData.second_name}
                    onChange={(e) => setFormData({ ...formData, second_name: e.target.value })}
                />
            </div>
            <div>
                <label>Username *</label>
                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Телефон</label>
                <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div>
                <label>Telegram ID</label>
                <input
                    type="number"
                    value={formData.telegram_id}
                    onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value })}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "⏳" : "Создать"}
            </button>
        </form>
    );
}
