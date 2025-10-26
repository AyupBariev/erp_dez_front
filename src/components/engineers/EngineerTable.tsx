import type { Engineer } from "../../api/engineer";
import { approveEngineer } from "../../api/engineer";
import { useState } from "react";

interface Props {
    engineers: Engineer[];
    onRefresh: () => void;
}

export default function EngineerTable({ engineers, onRefresh }: Props) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async (id: number) => {
        setLoading(true);
        try {
            await approveEngineer(id);
            onRefresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4>Список инженеров</h4>
            {engineers.length === 0 ? (
                <div>Нет инженеров</div>
            ) : (
                <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Username</th>
                        <th>Телефон</th>
                        <th>Telegram ID</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {engineers.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.first_name}</td>
                            <td>{e.second_name || "-"}</td>
                            <td>{e.username}</td>
                            <td>{e.phone || "-"}</td>
                            <td>{e.telegram_id || "-"}</td>
                            <td>{e.is_approved ? "✅ Активен" : "⏸️ Не активен"}</td>
                            <td>
                                {!e.is_approved && (
                                    <button onClick={() => handleApprove(e.id)} disabled={loading}>
                                        {loading ? "..." : "Активировать"}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
