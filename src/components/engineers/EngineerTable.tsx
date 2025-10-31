import { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { approveEngineer } from "../../api/engineer";
import type { Engineer } from "../../api/engineer";

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

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "first_name",
            headerName: "Имя",
            flex: 1,
            minWidth: 100,
        },
        {
            field: "second_name",
            headerName: "Фамилия",
            flex: 1,
            minWidth: 120,
        },
        {
            field: "username",
            headerName: "Username",
            flex: 1,
            minWidth: 100,
        },
        {
            field: "phone",
            headerName: "Телефон",
            flex: 1,
            minWidth: 130, // Больше места для телефона
            renderCell: (params) => (
                <Box sx={{
                    width: '100%',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    lineHeight: 1.4,
                }}>
                    {params.value || '-'}
                </Box>
            ),
        },
        {
            field: "telegram_id",
            headerName: "Telegram ID",
            flex: 1,
            minWidth: 120,
        },
        {
            field: "is_approved",
            headerName: "Статус",
            flex: 1,
            minWidth: 120,
            renderCell: (params) =>
                params.value ? (
                    <Typography color="success.main">✅ Активен</Typography>
                ) : (
                    <Typography color="text.secondary">⏸️ Не активен</Typography>
                ),
        },
        {
            field: "actions",
            headerName: "Действия",
            flex: 1,
            minWidth: 140,
            renderCell: (params) => {
                const row = params.row as Engineer;
                return !row.is_approved ? (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleApprove(row.id)}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : (
                            "Активировать"
                        )}
                    </Button>
                ) : (
                    <CheckCircleIcon color="success" />
                );
            },
        },
    ];

    return (
        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: "#fff" }}>
            <Typography variant="h6" mb={2}>
                Список инженеров
            </Typography>

            {engineers.length === 0 ? (
                <Typography color="text.secondary">Нет инженеров</Typography>
            ) : (
                <Box sx={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={engineers}
                        columns={columns}
                        pageSizeOptions={[5, 10, 20]}
                        disableRowSelectionOnClick
                        loading={loading}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        getRowHeight={() => 'auto'}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                py: 1,
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                lineHeight: 1.4,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                    />
                </Box>
            )}
        </Paper>
    );
}