import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    CircularProgress,
    Paper,
    Grid, InputLabel
} from "@mui/material";
import { getReportLinkInfo, submitReport } from "../../api/reports";

export default function EngineerSubmitReport() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [order, setOrder] = useState<any>(null);
    const [finishPrice, setFinishPrice] = useState("");
    const [isRepeat, setIsRepeat] = useState(false);
    const [note, setNote] = useState("");
    const [repeatDate, setRepeatDate] = useState("");
    const [repeatTime, setRepeatTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (token) {
            getReportLinkInfo(token)
                .then((data) => setOrder(data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [token]);

    useEffect(() => {
        if (order) {
            setFinishPrice(order.price || "");
        }
    }, [order]);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            const fullRepeatDate =
                isRepeat && repeatDate && repeatTime
                    ? `${repeatDate}T${repeatTime}`
                    : undefined;

            const payload = {
                token: token!,
                finish_price: finishPrice,
                has_repeat: isRepeat,
                repeat_date: fullRepeatDate,
                repeat_note: note,
            };

            await submitReport(payload);
            setSubmitted(true);
            alert("Отчёт успешно отправлен ✅");
        } catch (err) {
            alert("Ошибка при отправке отчёта: " + err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );

    if (!order)
        return (
            <Typography align="center" mt={4}>
                Ошибка: заказ не найден
            </Typography>
        );

    return (
        <Box display="flex" justifyContent="center" mt={6}>
            <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Отчёт по заказу №{order.erp_number}
                </Typography>

                <Typography variant="body1" gutterBottom>
                    Клиент: <strong>{order.client_name}</strong>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Адрес:  <strong>{order.address}</strong>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Начальная цена: <strong>{order.price}</strong>
                </Typography>

                <Box sx={{ paddingY: 3 }}>
                    <InputLabel
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Взял с заказа:
                    </InputLabel>
                    <TextField
                        className="form-control"
                        value={finishPrice}
                        onChange={(e) => setFinishPrice(e.target.value)}
                        disabled={submitted}
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isRepeat}
                                onChange={(e) => setIsRepeat(e.target.checked)}
                                color="primary"
                                disabled={submitted}
                            />
                        }
                        label="Назначен ли повтор?"
                        sx={{ mt: 2 }}
                    />

                    {isRepeat && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {/* Дата */}
                            <Grid sx={{ flex: '0 0 50%' }}>
                                <TextField
                                    label="Дата повтора"
                                    type="date"
                                    fullWidth
                                    value={repeatDate}
                                    onChange={(e) => setRepeatDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    disabled={submitted}
                                />
                            </Grid>

                            {/* Время */}
                            <Grid sx={{ flex: '0 0 50%' }}>
                                <TextField
                                    label="Время повтора"
                                    type="time"
                                    fullWidth
                                    value={repeatTime}
                                    onChange={(e) => setRepeatTime(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    disabled={submitted}
                                />
                            </Grid>
                        </Grid>
                    )}

                    <TextField
                        label="Примечание / описание"
                        multiline
                        rows={4}
                        fullWidth
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        sx={{ mt: 2 }}
                        disabled={submitted}
                    />
                </Box>
                <Button
                    variant="contained"
                    color={submitted ? "info" : "success"}
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ mt: 3 }}
                    disabled={submitting || submitted}
                >
                    {submitted ? "Отчёт отправлен ✅" : submitting ? "Отправка..." : "Отправить отчёт"}
                </Button>
            </Paper>
        </Box>
    );
}
