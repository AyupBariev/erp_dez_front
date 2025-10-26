import { useEffect, useState } from "react";
import AssignOrdersTable from "../../components/assignOrders/AssignOrdersTable";
import type {Order} from "../../api/orders"
import {getOrders, } from "../../api/orders";
import type {Engineer} from "../../api/engineer";
import {getEngineers} from "../../api/engineer";

export default function AssignOrders() {
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const [engs, ords]: [Engineer[], Order[]] = await Promise.all([
                    getEngineers(selectedDate),
                    getOrders(selectedDate),
                ]);
                setEngineers(engs);
                setOrders(ords);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        }
        fetchData();
    }, [selectedDate]);

    return (
        <div className="page-body">
            <div className="container-xl">
                <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <h3 className="card-title m-0">Маршрутка</h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="form-control w-auto"
                        />
                    </div>
                    <div className="card-body">
                        <AssignOrdersTable
                            engineers={engineers}
                            orders={orders}
                            selectedDate={selectedDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
