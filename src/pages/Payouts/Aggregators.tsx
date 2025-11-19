import {useEffect, useState} from 'react'
import type {GridColDef} from '@mui/x-data-grid'
import {DataGrid, GridToolbar} from '@mui/x-data-grid'
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material'
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {format} from 'date-fns'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

type AggregatorRow = {
    channel: string;
    order_count: number;
    avg_check: number;
    lead_cost: number;
    date: string;
};
const cols = (): GridColDef<AggregatorRow>[] => [
    {
        field: 'aggregator',
        headerName: 'Канал',
        flex: 140,
        minWidth: 120,
        renderCell: (p) => <strong>{p.value}</strong>,
    },
    {
        field: 'order_count',
        headerName: 'Количество заказов',
        type: 'number',
        flex: 70,
        minWidth: 70,
        renderCell: (p) => <strong>{p.value}</strong>,
    },
    {
        field: 'avg_check',
        headerName: 'Ср.чек',
        type: 'number',
        flex: 100,
        minWidth: 90,
        renderCell: (p) => (
            <span style={{ color: '#388e3c', fontWeight: 700, fontSize: '1.1rem' }}>
        {Number(p.value).toFixed(2)} ₽
      </span>
        ),
    },
    {
        field: 'lead_cost',
        headerName: 'К выплате',
        type: 'number',
        flex: 120,
        minWidth: 110,
        renderCell: (p) => (
            <span style={{ color: '#388e3c', fontWeight: 700, fontSize: '1.25rem' }}>
        {Number(p.value).toFixed(2)} ₽
      </span>
        ),
    },
];
type PayDialogProps = {
    row: {
        channel: string;
        date: string;
        payout: number;
    };
    onClose: (ok: boolean) => void;
};

function PayDialog({row, onClose}: PayDialogProps) {
    const [v, setV] = useState(row.payout)
    const save = () => fetch(`/api/agg-payout/${row.channel}/${row.date}`, {
        method: 'POST',
        body: JSON.stringify({amount: v}),
        headers: {'Content-Type': 'application/json'}
    }).then(() => onClose(true))
    return <Dialog open onClose={() => onClose(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Оплата {row.channel}</DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{mb: 2}}>Дата: {format(new Date(row.date), 'dd.MM.yyyy')}</Typography>
            <TextField
                label="Сумма"
                fullWidth
                type="number"
                value={v}
                onChange={(e) => setV(Number(e.target.value))} // ✅ Number()
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => onClose(false)}>Отмена</Button>
            <Button variant="contained" onClick={save}>Оплатить</Button>
        </DialogActions>
    </Dialog>
}

export default function AggregatorPayoutPage() {
    const [rows, setRows] = useState<AggregatorRow[]>([]);
    const [load, setLoad] = useState(true)
    const [from, setFrom] = useState(new Date(new Date().setDate(1)))
    const [to, setTo] = useState(new Date())
    const [pay, setPay] = useState(null)

    const fetchData = () => {
        const token = localStorage.getItem('token')
        setLoad(true)
        fetch(`/api/aggregator/daily?from=${format(from, 'yyyy-MM-dd')}&to=${format(to, 'yyyy-MM-dd')}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(r => r.json()).then(setRows).finally(() => setLoad(false))
    }
    useEffect(fetchData, [from, to])

    return <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{p: 2}}>
            <Card sx={{height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: 3}}>
                <CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap'}}>
                        <CalendarTodayIcon color="primary"/>
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
                    </Box>
                    <Box sx={{flex: 1, minHeight: 0}}>
                        {load ? <CircularProgress/> :
                            <DataGrid
                                rows={rows}
                                columns={cols()}
                                getRowId={r => `${r.date}-${r.channel}`}
                                disableRowSelectionOnClick
                                slots={{toolbar: GridToolbar}}
                                sx={{fontSize: {xs: '.75rem', sm: '.875rem', md: '1rem'}}}
                                density="compact"
                            />}
                    </Box>
                </CardContent>
            </Card>
            {pay && <PayDialog row={pay} onClose={ok => {
                setPay(null);
                if (ok) fetchData()
            }}/>}
        </Box>
    </LocalizationProvider>
}