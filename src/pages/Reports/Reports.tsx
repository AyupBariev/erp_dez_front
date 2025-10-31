// import React, {useEffect, useState} from "react";
// import {Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
//
// export default function Reports() {
//     const [reports, setReports] = useState([]);
//
//     useEffect(() => {
//         fetch("/api/reports")
//             .then((res) => res.json())
//             .then(setReports);
//     }, []);
//
//     const handleApprove = async (id) => {
//         await fetch(`/api/reports/${id}/approve`, { method: "POST" });
//         setReports((r) => r.filter((rep) => rep.id !== id));
//     };
//
//     return (
//         <Container sx={{ mt: 4 }}>
//             <Typography variant="h4">Отчёты на кассу</Typography>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Заказ</TableCell>
//                         <TableCell>Инженер</TableCell>
//                         <TableCell>Комментарий</TableCell>
//                         <TableCell>Повтор</TableCell>
//                         <TableCell></TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {reports.map((r) => (
//                         <TableRow key={r.erp_number}>
//                             <TableCell>{r.erp_number}</TableCell>
//                             <TableCell>{r.engineer_name}</TableCell>
//                             <TableCell>{r.comment}</TableCell>
//                             <TableCell>{r.repeat_needed ? "Да" : "Нет"}</TableCell>
//                             <TableCell>
//                                 <Button onClick={() => handleApprove(r.erp_number)}>Принять отчёт</Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </Container>
//     );
// }
export default function Reports()  {
    return 1;
}