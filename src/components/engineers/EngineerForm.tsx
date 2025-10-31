import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    CircularProgress,
    Stack,
    Typography,
    Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createEngineer } from "../../api/engineer";

interface Props {
    onCreated: () => void;
    onResult?: (success: boolean, message: string) => void;
}

export default function EngineerForm({ onCreated, onResult }: Props) {
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
                telegram_id: formData.telegram_id
                    ? Number(formData.telegram_id)
                    : undefined,
            });

            setFormData({
                first_name: "",
                second_name: "",
                username: "",
                phone: "",
                telegram_id: "",
            });

            onCreated();
            onResult?.(true, "Инженер успешно создан ✅");
        } catch (err: any) {
            console.error("Ошибка при создании инженера:", err);
            let message = "Ошибка при создании инженера";
            if (err.response?.data?.message) {
                message = err.response.data.message;
            }
            onResult?.(false, message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h6" mb={2}>
                Добавить инженера
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Имя"
                            value={formData.first_name}
                            onChange={(e) =>
                                setFormData({ ...formData, first_name: e.target.value })
                            }
                            required
                            fullWidth
                        />
                        <TextField
                            label="Фамилия"
                            value={formData.second_name}
                            onChange={(e) =>
                                setFormData({ ...formData, second_name: e.target.value })
                            }
                            fullWidth
                        />
                    </Stack>

                    <TextField
                        label="Username TELEGRAM"
                        value={formData.username}
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                        }
                        required
                        fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Телефон"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Telegram ID"
                            type="number"
                            value={formData.telegram_id}
                            onChange={(e) =>
                                setFormData({ ...formData, telegram_id: e.target.value })
                            }
                            fullWidth
                        />
                    </Stack>

                    <Box textAlign="right">
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            startIcon={!loading && <AddIcon />}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : "Создать"}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}
