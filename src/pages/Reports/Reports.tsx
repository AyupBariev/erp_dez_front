import React, {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {format} from 'date-fns';
import { reportsColumns } from './ReportColumns';
import type {ReportRow} from './ReportColumns';

// ---------- ТИПЫ ----------

// ---------- МОДАЛКА «Сдать отчёт» ----------
function CashDialog({ row, onClose }: { row: ReportRow; onClose: (ok: boolean) => void }) {
    const max = row.to_cash;

    const [gaveCash, setGaveCash] = useState<string>('');
    const [issued, setIssd]       = useState<string>('');
    const [comment, setCom]       = useState('');

    /* ----------- флаг «пользователь уже пробовал отправить» ----------- */
    const [touched, setTouched] = useState(false);

    const handleGaveCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === '' || /^\d*\.?\d*$/.test(v)) setGaveCash(v);
    };
    const handleIssuedMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === '' || /^\d*\.?\d*$/.test(v)) setIssd(v);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
        if (e.target.value === '0') {
            e.target.value = '';
            (e.target.name === 'gaveCash' ? setGaveCash : setIssd)('');
        }
    };
    const handleGaveBlur = () => gaveCash === '' && setGaveCash('0');
    const handleIssBlur  = () => issued  === '' && setIssd('0');

    /* ----------- расчёты ----------- */
    const gaveNum = Number(gaveCash || 0);
    const issuedNum = Number(issued || 0);
    const sum   = gaveNum + issuedNum;
    const sumOk = sum === max;          // строгое равенство

    /* ----------- сохранение ----------- */
    const save = () => {
        setTouched(true);          // показать ошибки
        if (!sumOk) return;        // всё равно не отправляем
        fetch(`/api/reports/cash/${row.order_id}/receive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ gave_cash: gaveNum, issued_money: Number(issued || 0), comment }),
        })
            .then(() => onClose(true))
            .catch(() => onClose(false));
    };

    /* ----------- UI ----------- */
    const showError = touched && !sumOk;   // рисуем ошибку только после touched

    return (
        <Dialog open maxWidth="xs" fullWidth onClose={() => onClose(false)}>
            <DialogTitle>Сдать отчёт №{row.order_id}</DialogTitle>

            <DialogContent dividers sx={{ px: 2, pt: 1 }}>
                <TextField
                    label="Сдано в кассу"
                    type="number"
                    name="gaveCash"
                    fullWidth
                    value={gaveCash}
                    onChange={handleGaveCashChange}
                    onBlur={handleGaveBlur}
                    onFocus={handleFocus}
                    error={showError}
                    helperText={showError
                        ? `Сумма должна быть ровно ${max}`
                        : `Осталось: ${max - gaveNum - issuedNum}`}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Выдано инженеру"
                    type="number"
                    fullWidth
                    value={issued}
                    hidden={row.motivation_percent < 20}
                    onChange={handleIssuedMoneyChange}
                    onBlur={handleIssBlur}
                    onFocus={handleFocus}
                    error={showError}
                    helperText={
                        showError
                            ? `Сумма должна быть ровно ${max}`
                            : ''
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Комментарий (не обязательно)"
                    fullWidth
                    multiline
                    rows={2}
                    value={comment}
                    onChange={(e) => setCom(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(false)} variant="outlined" color="error">
                    Отмена
                </Button>
                <Button variant="contained" onClick={save} disabled={!sumOk}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ---------- МОДАЛКА «Вернуть СИ» ----------
function ReturnDialog({row, onClose}: { row: ReportRow; onClose: (ok: boolean) => void }) {
    const [comment, setCom] = useState('');

    const save = () => {
        fetch(`/api/reports/return/${row.order_id}`, {
            method: 'POST',
            body: JSON.stringify({comment}),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(() => onClose(true))
            .catch((err) => (console.error(err), onClose(false)));
    };

    return (
        <Dialog open maxWidth="xs" fullWidth onClose={() => onClose(false)}>
            <DialogTitle>Вернуть СИ по заказу {row.order_id}</DialogTitle>
            <DialogContent>
                <TextField label="Причина возврата (не обязательно)" fullWidth multiline rows={3} value={comment}
                           onChange={(e) => setCom(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Отмена</Button>
                <Button variant="contained" onClick={save}>Подтвердить</Button>
            </DialogActions>
        </Dialog>
    );
}

// ---------- ГЛАВНЫЙ КОМПОНЕНТ ----------
export default function Reports() {
    const [rows, setRows] = useState<ReportRow[]>([]);
    const [load, setLoad] = useState(true);
    const [cash, setCash] = useState<ReportRow | null>(null);
    const [ret, setRet] = useState<ReportRow | null>(null);

    const today = new Date();
    const [from, setFrom] = useState<Date>(today);
    const [to, setTo] = useState<Date>(today);

    const refresh = () => {
        setLoad(true);
        const token = localStorage.getItem('token');
        const fromApi = format(from, 'yyyy-MM-dd');
        const toApi = format(to, 'yyyy-MM-dd');
        fetch(`/api/reports/cash?from=${fromApi}&to=${toApi}`, {headers: {Authorization: `Bearer ${token}`}})
            .then((r) => r.json())
            .then(setRows)
            .finally(() => setLoad(false));
    };

    useEffect(refresh, [from, to]);

    const openCash = (row: ReportRow) => setCash(row);
    const closeCash = (ok: boolean) => {
        setCash(null);
        if (ok) refresh();
    };

    const openReturn = (row: ReportRow) => setRet(row);
    const closeReturn = (ok: boolean) => {
        setRet(null);
        if (ok) refresh();
    };

    if (load) return <CircularProgress/>;

    return (
        <Box sx={{p: 2}}>
            <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker label="С"
                                value={from}
                                onChange={(d) => setFrom(d ?? new Date())}
                                format="dd.MM.yyyy"
                                enableAccessibleFieldDOMStructure={false}
                                slots={{ textField: TextField }}
                    />
                    <DatePicker label="По"
                                value={to}
                                onChange={(d) => setTo(d ?? new Date())}
                                format="dd.MM.yyyy"
                                enableAccessibleFieldDOMStructure={false}
                                slots={{ textField: TextField }}
                    />
                </LocalizationProvider>
                <Button variant="contained" onClick={refresh}>Обновить</Button>
            </Box>

            <div style={{height: 1000, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={reportsColumns(openCash, openReturn)}
                    getRowId={(r: ReportRow) => String(r.order_id)}
                    disableRowSelectionOnClick
                    density="comfortable"
                />
            </div>

            {cash && <CashDialog row={cash} onClose={closeCash}/>}
            {ret && <ReturnDialog row={ret} onClose={closeReturn}/>}
        </Box>
    );
}