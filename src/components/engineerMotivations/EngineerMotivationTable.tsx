import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams, GridPaginationModel } from "@mui/x-data-grid";
import { useEngineerMotivation } from "../../hooks/useEngineerMotivation.ts";
import { Box, TextField } from "@mui/material";

export const EngineerMotivationTable: React.FC = () => {
    const { data, loading, error, month, setMonth } = useEngineerMotivation();

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
            headerName: "Количество выданных заказов за месяц",
            type: "number",
            flex: 1,
            minWidth: 100,
            cellClassName: "highlight-green"
        },
        {
            field: "repeat_orders_count",
            headerName: "Количеств повторов за месяц",
            type: "number",
            flex: 1,
            minWidth: 100
        },
        {
            field: "reports_count",
            headerName: "Количество отчетов за месяц",
            type: "number",
            flex: 1,
            minWidth: 100,
            cellClassName: "highlight-green"
        },
        {
            field: "orders_total_amount",
            headerName: "Прибыль с первичных",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "repeat_orders_amount",
            headerName: "Прибыль с повторов",
            type: "number",
            flex: 1,
            minWidth: 150,
            cellClassName: "highlight-green"
        },
        {
            field: "gross_profit",
            headerName: "Валовая прибыль",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "average_check",
            headerName: "Средний чек",
            type: "number",
            flex: 1,
            minWidth: 120,
            cellClassName: "highlight-green"
        },
        {
            field: "motivation_percent",
            headerName: "Процент мотивации",
            type: "number",
            flex: 1,
            minWidth: 150
        },
        {
            field: "total_motivation",
            headerName: "Сумма выплат",
            type: "number",
            flex: 1,
            minWidth: 150,
            cellClassName: "highlight-green"
        },
    ];

    return (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box sx={{ my: 2, display: "flex", gap: 2 }}>
                <TextField
                    type="month"
                    label="Месяц"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

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