import { useEffect, useState } from "react";
import type { Engineer } from "../../api/engineer";
import { getEngineers } from "../../api/engineer";
import EngineerForm from "../../components/engineers/EngineerForm";
import EngineerTable from "../../components/engineers/EngineerTable";

export default function SIManagement() {
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEngineers = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split("T")[0];
            const data = await getEngineers(today);
            setEngineers(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEngineers();
    }, []);

    return (
        <div className="p-4">
            <h2>Управление инженерами (СИ)</h2>
            <EngineerForm onCreated={fetchEngineers} />
            {loading ? <div>Загрузка...</div> : <EngineerTable engineers={engineers} onRefresh={fetchEngineers} />}
        </div>
    );
}
