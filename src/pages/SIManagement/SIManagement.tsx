import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    CircularProgress,
    Stack,
    Button,
    Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import type { Engineer } from "../../api/engineer";
import { getEngineers } from "../../api/engineer";
import EngineerForm from "../../components/engineers/EngineerForm";
import EngineerTable from "../../components/engineers/EngineerTable";
import ShareToast from "../../components/share/ShareToast.tsx";

export default function SIManagement() {
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        success: true,
        message: "",
    });

    const fetchEngineers = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split("T")[0];
            const data = await getEngineers(today);
            setEngineers(data);
        } catch (err) {
            console.error("Ошибка при загрузке инженеров:", err);
            setToast({
                show: true,
                success: false,
                message: "Ошибка при загрузке списка инженеров",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEngineers();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            {/* Заголовок + кнопки */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5" fontWeight={600}>
                        Управление мастерами
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchEngineers}
                    >
                        Обновить
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        color="success"
                        onClick={() => {
                            const form = document.getElementById("engineer-form");
                            if (form) form.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Добавить инженера
                    </Button>
                </Stack>
            </Stack>

            {/* Карточка с формой */}
            <Card
                id="engineer-form"
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Добавить / Редактировать инженера
                </Typography>
                <EngineerForm
                    onCreated={fetchEngineers}
                    onResult={(success, message) =>
                        setToast({ show: true, success, message })
                    }
                />
            </Card>

            {/* Таблица */}
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Список инженеров</Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 4,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <EngineerTable engineers={engineers} onRefresh={fetchEngineers} />
                )}
            </Card>

            {/* Snackbar уведомление */}
            <ShareToast
                show={toast.show}
                success={toast.success}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
                duration={2000}
            />
        </Box>
    );
}
