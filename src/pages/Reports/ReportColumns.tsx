import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {Box, Button, Chip} from '@mui/material';
import {format} from 'date-fns';

export type ReportRow = {
    order_id: number;
    order_status: string;
    engineer_id: number;
    description: string;
    has_repeat: boolean;
    repeat_date: string | null;
    repeat_note: string;
    to_cash: number;
    gave_cash: number;
    issued_money: number;
    motivation_percent: number;
    advance: number;
    prepayment: number;
    salary: number;
};

export const reportsColumns = (
    openCash: (r: ReportRow) => void,
    openReturn: (r: ReportRow) => void
): GridColDef<ReportRow>[] => [
    { field: 'order_id', headerName: 'Заказ', width: 90 },
    { field: 'engineer_id', headerName: 'Инженер', width: 110 },
    { field: 'description', headerName: 'Описание', flex: 1 },
    {
        field: 'has_repeat',
        headerName: 'Повтор',
        width: 80,
        renderCell: (p: GridRenderCellParams<ReportRow>) =>
            p.value ? (
                <Chip label="Да" color="success" size="small" />
            ) : (
                <Chip label="Нет" color="error" size="small" />
            ),
    },
    {
        field: 'repeat_date',
            headerName: 'Дата повтора',
        width: 130,
        valueFormatter: (p: GridRenderCellParams<ReportRow>) =>
        p.value ? format(new Date(p.value), 'dd.MM.yyyy') : '',
    },
    { field: 'repeat_note', headerName: 'Примечание повтора', flex: 1 },
    { field: 'to_cash', headerName: 'К сдаче', type: 'number', width: 100 },
    { field: 'gave_cash', headerName: 'Сдано', type: 'number', width: 100 },
    { field: 'issued_money', headerName: 'Выдано', type: 'number', width: 100 },
    {
        field: 'action',
        headerName: '',
        width: 220,
        sortable: false,
        renderCell: (p: GridRenderCellParams<ReportRow>) => (
            <Box
                sx={{ display: 'flex', flexDirection: 'column' }}
                hidden={p.row.order_status === 'closed_finally'}
            >
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => openCash(p.row)}
                    disabled={p.row.order_status === 'closed_finally'}
                    sx={{ my: 1, height: 24, px: 0.5, py: 0, fontSize: '0.725rem' }}
                >
                    Принять отчёт
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => openReturn(p.row)}
                    disabled={p.row.order_status === 'closed_finally'}
                    sx={{ height: 24, px: 0.5, py: 0, fontSize: '0.725rem' }}
                >
                    Вернуть СИ
                </Button>
            </Box>
        ),
    },
];