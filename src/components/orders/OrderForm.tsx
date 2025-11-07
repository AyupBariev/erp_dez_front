import React, {useState} from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    MenuItem,
    Stack,
    Paper,
    Divider,
    CircularProgress,
    Alert,
    IconButton,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import {Add, Close, Save, Delete} from "@mui/icons-material";
import type {Order, CreateOrderRequest, OrderStatus} from "../../api/orders";
import {useDictionaries} from "../../hooks/useDictionaries";
import {ORDER_STATUSES} from "../../utils/orderStatus.ts";

interface Props {
    order: Order | null,
    onSave: (data: CreateOrderRequest, orderNumber?: number) => void,
    onCancel: () => void,
    formLoading?: boolean,
}

const OrderForm: React.FC<Props> = ({order, onSave, onCancel, formLoading = false}) => {
    const {sources, problems, loading, error} = useDictionaries();

    const [date, setDate] = useState(
        order?.scheduled_at ? order.scheduled_at.split(" ")[0] : ""
    );
    const [time, setTime] = useState(
        order?.scheduled_at ? order.scheduled_at.split(" ")[1]?.slice(0, 5) : ""
    );
    const [workVolume, setWorkVolume] = useState(order?.work_volume || "");
    const [problemId, setProblemId] = useState<number>(order?.problem_id || 0);
    const [price, setPrice] = useState<string>(order?.price || "");
    const [address, setAddress] = useState(order?.address || "");
    const [phones, setPhones] = useState<string[]>(
        order?.phones && order.phones.length > 0 ? order.phones : [""]
    );
    const [clientName, setClientName] = useState(order?.client_name || "");
    const [note, setNote] = useState(order?.note || "");
    const [sourceId, setSourceId] = useState<number>(order?.aggregator_id || 0);
    const [ourPercent, setOurPercent] = useState<string>(String(order?.our_percent || ""));
    const [status, setStatus] = useState<OrderStatus>(order?.status || "new");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!sourceId || !problemId || !workVolume.trim() || !address.trim() || !clientName.trim()) {
            return;
        }

        const scheduled_at = date && time ? `${date}T${time}` : undefined;
        const filteredPhones = phones.filter(phone => phone.trim() !== "");

        onSave(
            {
                aggregator_id: sourceId,
                problem_id: problemId,
                our_percent: ourPercent ? Number(ourPercent) : 0,
                client_name: clientName.trim(),
                phones: filteredPhones,
                address: address.trim(),
                work_volume: workVolume.trim(),
                scheduled_at,
                note: note.trim() || "",
                price: price || "",
                status: status,
            },
            order?.erp_number // Передаем ID заказа если он есть (для редактирования)
        );
    };

    const addPhone = () => {
        setPhones([...phones, ""]);
    };

    const updatePhone = (index: number, value: string) => {
        const newPhones = [...phones];
        newPhones[index] = value;
        setPhones(newPhones);
    };

    const removePhone = (index: number) => {
        if (phones.length > 1) {
            const newPhones = phones.filter((_, i) => i !== index);
            setPhones(newPhones);
        }
    };

    // Обработчики для полей ввода
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setPrice(value);
        }
    };

    const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            const numValue = Number(value);
            if (value === "" || (numValue >= 0 && numValue <= 100)) {
                setOurPercent(value);
            }
        }
    };

    const isFormValid =
        sourceId > 0 &&
        problemId > 0 &&
        workVolume.trim() !== "" &&
        address.trim() !== "" &&
        clientName.trim() !== "" &&
        phones.some(phone => phone.trim() !== "");

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Paper
            elevation={4}
            sx={{
                maxWidth: 600,
                mx: "auto",
                p: 3,
                borderRadius: 3,
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            <Typography variant="h6" textAlign="center" mb={3}>
                {order ? "✏️ Редактировать заказ" : "🆕 Новый заказ"}
            </Typography>

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    Ошибка загрузки справочников: {error}
                </Alert>
            )}

            <Stack spacing={3}>
                {/* Основная информация */}
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Основная информация
                    </Typography>
                    <Stack spacing={2}>
                        {/* Статус заказа */}
                        <FormControl fullWidth>
                            <InputLabel>Статус заказа</InputLabel>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                label="Статус заказа"
                            >
                                {ORDER_STATUSES.map((statusItem) => (
                                    <MenuItem key={statusItem.key} value={statusItem.key}>
                                        {statusItem.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Способ обращения */}
                        <TextField
                            label="Способ обращения *"
                            select
                            value={sourceId}
                            onChange={(e) => setSourceId(Number(e.target.value))}
                            fullWidth
                            error={!sourceId}
                            helperText={!sourceId ? "Выберите способ обращения" : ""}
                        >
                            <MenuItem value={0}>Выберите способ обращения</MenuItem>
                            {sources.map((source) => (
                                <MenuItem key={source.id} value={source.id}>
                                    {source.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Проблема */}
                        <TextField
                            label="Проблема *"
                            select
                            value={problemId}
                            onChange={(e) => setProblemId(Number(e.target.value))}
                            fullWidth
                            error={!problemId}
                            helperText={!problemId ? "Выберите проблему" : ""}
                        >
                            <MenuItem value={0}>Выберите проблему</MenuItem>
                            {problems.map((problem) => (
                                <MenuItem key={problem.id} value={problem.id}>
                                    {problem.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Объем работ */}
                        <TextField
                            label="Объём работ *"
                            value={workVolume}
                            onChange={(e) => setWorkVolume(e.target.value)}
                            fullWidth
                            error={!workVolume.trim()}
                            helperText={!workVolume.trim() ? "Введите объём работ" : ""}
                        />
                    </Stack>
                </Box>

                <Divider/>

                {/* Клиент и контакты */}
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Информация о клиенте
                    </Typography>
                    <Stack spacing={2}>
                        {/* Имя клиента */}
                        <TextField
                            label="Имя клиента *"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            fullWidth
                            error={!clientName.trim()}
                            helperText={!clientName.trim() ? "Введите имя клиента" : ""}
                        />

                        {/* Телефоны */}
                        <Box>
                            <Typography variant="subtitle2" mb={1}>
                                Телефоны *
                            </Typography>
                            {phones.map((phone, index) => (
                                <Stack key={index} direction="row" spacing={1} alignItems="center" mb={1}>
                                    <TextField
                                        label={`Телефон ${index + 1}`}
                                        value={phone}
                                        onChange={(e) => updatePhone(index, e.target.value)}
                                        fullWidth
                                        type="tel"
                                        error={phones.length === 1 && !phone.trim()}
                                        helperText={phones.length === 1 && !phone.trim() ? "Введите хотя бы один телефон" : ""}
                                    />
                                    {phones.length > 1 && (
                                        <IconButton
                                            onClick={() => removePhone(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <Delete/>
                                        </IconButton>
                                    )}
                                </Stack>
                            ))}
                            <Button
                                startIcon={<Add/>}
                                onClick={addPhone}
                                sx={{mt: 1}}
                                size="small"
                                variant="outlined"
                            >
                                Добавить телефон
                            </Button>
                        </Box>

                        {/* Адрес */}
                        <TextField
                            label="Адрес *"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            fullWidth
                            multiline
                            minRows={2}
                            error={!address.trim()}
                            helperText={!address.trim() ? "Введите адрес" : ""}
                        />
                    </Stack>
                </Box>

                <Divider/>

                {/* Детали заказа */}
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Детали заказа
                    </Typography>
                    <Stack spacing={2}>
                        {/* Дата и время */}
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Дата выполнения"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{shrink: true}}
                                fullWidth
                            />
                            <TextField
                                label="Время выполнения"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                InputLabelProps={{shrink: true}}
                                fullWidth
                            />
                        </Stack>

                        {/* Цена и процент */}
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Цена, руб"
                                type="number"
                                value={price}
                                onChange={handlePriceChange}
                                fullWidth
                                inputProps={{min: 0}}
                            />
                            <TextField
                                label="Наш процент, %"
                                type="number"
                                value={ourPercent}
                                onChange={handlePercentChange}
                                fullWidth
                                inputProps={{min: 0, max: 100}}
                            />
                        </Stack>

                        {/* Примечание */}
                        <TextField
                            label="Примечание"
                            multiline
                            minRows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            fullWidth
                            placeholder="Дополнительная информация о заказе..."
                        />
                    </Stack>
                </Box>

                <Divider/>

                {/* Кнопки действий */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Close/>}
                        onClick={onCancel}
                        size="large"
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Save/>}
                        type="submit"
                        disabled={!isFormValid}
                        size="large"
                    >
                        {formLoading ? (
                            <CircularProgress size={24} color="inherit"/>
                        ) : order ? (
                            "Сохранить изменения"
                        ) : (
                            "Создать заказ"
                        )}
                    </Button>
                </Stack>

                {/* Подсказка по обязательным полям */}
                <Typography variant="caption" color="text.secondary" textAlign="center">
                    * - обязательные поля
                </Typography>
            </Stack>
        </Paper>
    );
};

export default OrderForm;