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
        { field: "primaryOrdersCount", headerName: "Количество выданных заказов за месяц", type: "number", flex: 1, minWidth: 100, cellClassName: "highlight-green" },
        { field: "repeatOrdersCount", headerName: "Количеств повторов за месяц", type: "number", flex: 1, minWidth: 100 },
        { field: "reportsCount", headerName: "Количество отчетов за месяц", type: "number", flex: 1, minWidth: 100, cellClassName: "highlight-green" },
        { field: "ordersTotalAmount", headerName: "Прибыль с первичных", type: "number", flex: 1, minWidth: 150 },
        { field: "repeatOrdersAmount", headerName: "Прибыль с повторов", type: "number", flex: 1, minWidth: 150, cellClassName: "highlight-green" },
        { field: "grossProfit", headerName: "Валовая прибыль", type: "number", flex: 1, minWidth: 150 },
        { field: "averageCheck", headerName: "Средний чек", type: "number", flex: 1, minWidth: 120, cellClassName: "highlight-green" },
        { field: "motivationPercent", headerName: "Процент мотивации", type: "number", flex: 1, minWidth: 150 },
        { field: "totalMotivation", headerName: "Сумма выплат", type: "number", flex: 1, minWidth: 150, cellClassName: "highlight-green" },
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
