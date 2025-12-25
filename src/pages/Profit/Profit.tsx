import { useEffect, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ru } from "date-fns/locale/ru";

export type ProfitRow = {
    period: string;      // дата (или месяц)
    net_profit: number; // наша прибыль
};

export default function Profit() {
    const [rows, setRows] = useState<ProfitRow[]>([]);
    const [loading, setLoading] = useState(false);

    const [from, setFrom] = useState<Date>(() => startOfMonth(new Date()));
    const [to, setTo] = useState<Date>(() => endOfMonth(new Date()));

    const fetchProfit = () => {
        setLoading(true);

        fetch(
            `/api/profit?from=${format(from, "yyyy-MM-dd")}&to=${format(
                to,
                "yyyy-MM-dd"
            )}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        )
            .then((r) => r.json())
            .then(setRows)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProfit();
    }, [from, to]);

    const columns: GridColDef[] = [
        {
            field: "period",
            headerName: "Дата",
            flex: 1,
            minWidth: 120,
        },
        {
            field: "net_profit",
            headerName: "Наша прибыль, ₽",
            flex: 1,
            minWidth: 160,
            renderCell: (params) => (
                <strong
                    style={{
                        color:
                            Number(params.value) >= 0
                                ? "#2e7d32"
                                : "#d32f2f",
                    }}
                >
                    {Number(params.value).toFixed(2)} ₽
                </strong>
            ),
        },
    ];


    const totalProfit = rows.reduce(
        (sum, r) => sum + (r.net_profit || 0),
        0
    );

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ru}
        >
            <Card sx={{ height: "100%", boxShadow: 3 }}>
                <CardContent>
                    {/* Фильтр периода */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mb: 2,
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <DatePicker
                            label="С"
                            value={from}
                            onChange={(date) => {
                                if (date) {
                                    // Convert Dayjs to Date if needed
                                    const dateValue = date instanceof Date ? date : date.toDate();
                                    setFrom(dateValue);
                                }
                            }}
                            format="dd.MM.yyyy"
                        />
                        <DatePicker
                            label="По"
                            value={to}
                            onChange={(date) => {
                                if (date) {
                                    // Convert Dayjs to Date if needed
                                    const dateValue = date instanceof Date ? date : date.toDate();
                                    setTo(dateValue);
                                }
                            }}
                            format="dd.MM.yyyy"
                        />
                        <Button
                            variant="contained"
                            onClick={fetchProfit}
                        >
                            Обновить
                        </Button>
                    </Box>
                    <>
                        {/* Таблица */}
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Box sx={{ width: "100%" }}>
                                <DataGrid
                                    rows={rows.map((r, i) => ({
                                        ...r,
                                        id: `${r.net_profit}-${i}`,
                                    }))}
                                    columns={columns}
                                    autoHeight
                                    disableRowSelectionOnClick
                                    hideFooter
                                />
                            </Box>
                        )}
                    </>
                    {/* Итог */}
                    <Box
                        sx={{
                            mt: 2,
                            fontWeight: 700,
                            fontSize: "1.1rem",
                        }}
                    >
                        Итого за период:{" "}
                        <span
                            style={{
                                color:
                                    totalProfit >= 0
                                        ? "#2e7d32"
                                        : "#d32f2f",
                            }}
                        >
                            {totalProfit.toFixed(2)} ₽
                        </span>
                    </Box>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
}
