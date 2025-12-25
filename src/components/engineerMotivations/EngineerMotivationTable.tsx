import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams, GridPaginationModel } from "@mui/x-data-grid";
import { useEngineerMotivation } from "../../hooks/useEngineerMotivation.ts";
import {
    Box,
    Button
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale/ru";

export const EngineerMotivationTable: React.FC = () => {
    const {
        data,
        loading,
        error,
        from,
        setFrom,
        to,
        setTo,
        refetch
    } = useEngineerMotivation();

    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const columns: GridColDef[] = [
        {
            field: "engineer_name",
            headerName: "Инженер",
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                    {params.value}
                </div>
            ),
        },
        {
            field: "primary_orders_count",
            headerName: "Количество первичных за период",
            type: "number",
            flex: 1,
            minWidth: 100,
            cellClassName: "highlight-green"
        },
        {
            field: "repeat_orders_count",
            headerName: "Количество повторов за период",
            type: "number",
            flex: 1,
            minWidth: 100
        },
        {
            field: "reports_count",
            headerName: "Количество отчетов за период",
            type: "number",
            flex: 1,
            minWidth: 100,
            cellClassName: "highlight-green"
        },
        {
            field: "orders_total_amount",
            headerName: "Прибыль с первичных, ₽",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "repeat_orders_amount",
            headerName: "Прибыль с повторов, ₽",
            type: "number",
            flex: 1,
            minWidth: 140,
            cellClassName: "highlight-green"
        },
        {
            field: "average_check",
            headerName: "Ср. чек ₽",
            type: "number",
            flex: 1,
            minWidth: 100,
            cellClassName: "highlight-green"
        },
        {
            field: "gross_profit",
            headerName: "Валовая прибыль, ₽",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "net_profit",
            headerName: "Чистая прибыль, ₽",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "aggregator_payout",
            headerName: "Выплата агрегаторам ₽",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "total_amount",
            headerName: "Общая сумма, ₽",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "motivation_percent",
            headerName: "Процент мотивации М, %",
            type: "number",
            flex: 1,
            minWidth: 130,
            cellClassName: "highlight-green"
        },
        {
            field: "total_motivation_amount",
            headerName: "Сумма выплаты М, ₽",
            type: "number",
            flex: 1,
            minWidth: 140
        },
    ];

    return (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
            {/* Блок выбора диапазона дат */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
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
                </LocalizationProvider>
                <Button
                    variant="contained"
                    onClick={refetch}
                    sx={{ minHeight: '40px' }}
                >
                    Обновить
                </Button>
            </Box>

            {/* Таблица */}
            <Box sx={{ width: "100%" }}>
                <DataGrid
                    rows={data.map((row, index) => ({ ...row, id: row.engineer_id || index }))}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    getRowClassName={(params) =>
                        params.row.motivation_percent >= 20 ? "highlight-green" : ""
                    }
                    sx={{
                        "& .MuiDataGrid-columnHeaderTitle": {
                            whiteSpace: "normal",
                            lineHeight: "1.2rem",
                            overflow: "visible",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            height: "auto !important",
                            minHeight: "100px !important",
                            alignItems: "flex-start",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            maxHeight: "none !important",
                            minHeight: "100px !important",
                            alignItems: "flex-start",
                        },
                        "& .MuiDataGrid-cell": {
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                        },
                    }}
                />
            </Box>

            {error && <div style={{ color: "red" }}>{error}</div>}

            <style>
                {`
                    .highlight-green {
                        background-color: #e0f7e9;
                    }
                `}
            </style>
        </Box>
    );
};