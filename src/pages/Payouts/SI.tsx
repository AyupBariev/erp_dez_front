import { useEffect, useState } from 'react'
import {DataGrid} from '@mui/x-data-grid'
import type { GridColDef, GridRenderCellParams} from '@mui/x-data-grid'
import { CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Card, CardContent, Box } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, startOfMonth, endOfMonth } from 'date-fns'

export type EngineerPayoutRow = {
    engineer_id: number;
    first_name: string;
    second_name: string;
    salary: number;
    advance: number;
    paid_advance: number;
    left: number;
    total: number;
    can_pay: boolean;
    month: string;
};

export const cols = (
    onPay: (r: EngineerPayoutRow) => void,
    isMobile: boolean
): GridColDef<EngineerPayoutRow>[] => [
    {
        field: 'fio',
        headerName: 'ФИО',
        flex: 140,
        minWidth: 120,
        renderCell: (p: GridRenderCellParams<EngineerPayoutRow>) => (
            <strong>{p.row.first_name} {p.row.second_name}</strong>
        ),
    },
    {
        field: 'salary',
        headerName: 'Зарплата',
        type: 'number',
        flex: 80,
        minWidth: 90,
        renderCell: (p: GridRenderCellParams<EngineerPayoutRow>) => (
            <span style={{ color: '#388e3c', fontWeight: 700 }}>
        {Number(p.value).toFixed(2)} ₽
      </span>
        ),
    },
    {
        field: 'advance',
        headerName: 'Аванс',
        type: 'number',
        flex: 70,
        minWidth: 70,
        renderCell: (p: GridRenderCellParams<EngineerPayoutRow>) => (
            <span style={{ color: '#1976d2', fontWeight: 700 }}>
        {Number(p.value).toFixed(2)} ₽
      </span>
        ),
    },
    { field: 'paid_advance', headerName: 'Выплачено', type: 'number', flex: 100, minWidth: 90 },
    {
        field: 'left',
        headerName: 'Осталось (аванс)',
        type: 'number',
        flex: 120,
        minWidth: 110,
        renderCell: (p: GridRenderCellParams<EngineerPayoutRow>) => (
            <strong>{Number(p.value).toFixed(2)} ₽</strong>
        ),
    },
    {
        field: 'total',
        headerName: 'ЗП + аванс',
        type: 'number',
        flex: 100,
        minWidth: 90,
        renderCell: (p: GridRenderCellParams<EngineerPayoutRow>) => (
            <span style={{ color: '#388e3c', fontWeight: 700, fontSize: isMobile ? '1rem' : '1.1rem' }}>
        {Number(p.value).toFixed(2)} ₽
      </span>
        ),
    },
    {
        field: 'done',
        headerName: '',
        flex: 100,
        minWidth: 90,
        sortable: false,
        renderCell: (p: GridRenderCellParams<EngineerPayoutRow>) => (
            <Button
                size={isMobile ? 'small' : 'medium'}
                variant="outlined"
                onClick={() => onPay(p.row)}
                disabled={!p.row.can_pay}
                sx={{
                    color: p.row.can_pay ? undefined : 'gray',
                    borderColor: p.row.can_pay ? undefined : 'lightgray',
                }}
            >
                Выплатить аванс
            </Button>
        ),
    },
];

type PayDialogProps = {
    row: EngineerPayoutRow;
    onClose: (ok: boolean) => void;
};

function PayDialog({ row, onClose }: PayDialogProps) {
    const [v, setV] = useState<number>(row.left);

    const save = () => {
        fetch(`/api/engineers/advance`, {
            method: 'POST',
            body: JSON.stringify({
                engineer_id: row.engineer_id,
                month: row.month,
                amount: Number(v),
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(() => onClose(true));
    };

    return (
        <Dialog
            open
            maxWidth="xs"
            fullWidth
            onClose={(_, reason) => reason === 'backdropClick' && onClose(false)}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Аванс {row.first_name} {row.second_name}
                <Button
                    aria-label="close"
                    onClick={() => onClose(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    ✕
                </Button>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 2, pt: 1 }}>
                <TextField
                    label="Сумма"
                    fullWidth
                    type="number"
                    value={v}
                    onChange={(e) => setV(e.target.value === '' ? 0 : Number(e.target.value))}
                    sx={{ mt: 1 }}
                />
            </DialogContent>

            <DialogActions sx={{ px: 2, py: 1 }}>
                <Button variant="contained" onClick={save}>
                    Выплатить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function SI() {
    const [rows, setRows] = useState<EngineerPayoutRow[]>([]);
    const [load, setLoad] = useState(true);
    const [from, setFrom] = useState<Date>(() => startOfMonth(new Date()));
    const [to, setTo] = useState<Date>(() => endOfMonth(new Date()));
    const [pay, setPay] = useState<EngineerPayoutRow | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', h);
        return () => window.removeEventListener('resize', h);
    }, []);

    const fetchData = () => {
        if (!from || !to) return;
        setLoad(true);
        const fromStr = format(from, 'yyyy-MM-dd');
        const toStr = format(to, 'yyyy-MM-dd');
        const token = localStorage.getItem('token');
        fetch(`/api/engineers/month-payouts?from=${fromStr}&to=${toStr}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then(setRows)
            .finally(() => setLoad(false));
    };

    useEffect(() => {
        if (from && to) {
            fetchData();
        }
    }, [from, to]);

    if (load) return <CircularProgress />;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card sx={{ height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                        <DatePicker
                            label="С"
                            value={from}
                            onChange={(d) => {
                                // Convert Dayjs to Date if needed
                                const newDate = d instanceof Date ? d : d?.toDate();
                                setFrom(newDate ?? new Date());
                            }}
                            format="dd.MM.yyyy"
                            slotProps={{ textField: { size: isMobile ? 'small' : 'medium' } }}
                        />
                        <DatePicker
                            label="По"
                            value={to}
                            onChange={(d) => {
                                // Convert Dayjs to Date if needed
                                const newDate = d instanceof Date ? d : d?.toDate();
                                setTo(newDate ?? new Date());
                            }}
                            format="dd.MM.yyyy"
                            slotProps={{ textField: { size: isMobile ? 'small' : 'medium' } }}
                        />
                        <Button variant="contained" onClick={fetchData}>
                            Обновить
                        </Button>
                    </Box>
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <DataGrid
                            rows={rows}
                            columns={cols(setPay, isMobile)}
                            getRowId={(r) => r.engineer_id}
                            disableRowSelectionOnClick
                            sx={{ fontSize: isMobile ? '.75rem' : '.875rem' }}
                            density={isMobile ? 'compact' : 'standard'}
                        />
                    </Box>
                </CardContent>
            </Card>
            {pay && (
                <PayDialog
                    row={pay}
                    onClose={(ok: boolean) => {
                        setPay(null);
                        if (ok) fetchData();
                    }}
                />
            )}
        </LocalizationProvider>
    );
}