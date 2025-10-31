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
        { field: "reportsCount", headerName: "Отчеты", type: "number", flex: 1, minWidth: 100 },
        { field: "primaryOrdersCount", headerName: "Первичка", type: "number", flex: 1, minWidth: 100, cellClassName: "highlight-green" },
        { field: "repeatOrdersCount", headerName: "Повторы", type: "number", flex: 1, minWidth: 100 },
        { field: "ordersTotalAmount", headerName: "Сумма первичных", type: "number", flex: 1, minWidth: 150, cellClassName: "highlight-green" },
        { field: "repeatOrdersAmount", headerName: "Сумма повторов", type: "number", flex: 1, minWidth: 150 },
        { field: "grossProfit", headerName: "Валовая прибыль", type: "number", flex: 1, minWidth: 150, cellClassName: "highlight-green" },
        { field: "averageCheck", headerName: "Средний чек", type: "number", flex: 1, minWidth: 120 },
        { field: "motivationPercent", headerName: "Процент мотивации", type: "number", flex: 1, minWidth: 150, cellClassName: "highlight-green" },
        { field: "totalMotivation", headerName: "Итог мотивации", type: "number", flex: 1, minWidth: 150, cellClassName: "highlight-green" },
        { field: "confirmedByAdmin", headerName: "Подтверждено", type: "boolean", flex: 1, minWidth: 120 },
    ];

    return (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <TextField
                    type="month"
                    label="Месяц"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

            <Box sx={{ minWidth: 1300 }}>
                <DataGrid
                    rows={data.map((row, index) => ({ ...row, id: index }))}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    getRowClassName={(params) =>
                        params.row.motivationPercent >= 20 ? "highlight-green" : ""
                    }
                    sx={{
                        "& .MuiDataGrid-columnHeaderTitle": {
                            whiteSpace: "normal",
                            lineHeight: "20px",
                            overflow: "visible",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            minHeight: 56,
                            maxHeight: "none",
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
