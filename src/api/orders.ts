import { apiFetch } from "./http";
import type {Engineer} from "./engineer.ts";

export type OrderStatus =
    | "new"                  // обращение
    | "thinking"             // клиент думает
    | "in_proccess"          // логист выдал инженеру
    | "working"              // инженер принял
    | "closed_without_repeat"// заказ отчитан, на рассмотрении
    | "closed_finally"       // заказ отчитан окончательно
    | "canceled";            // отменён

export interface Order {
    id: number;
    erp_number: number;
    aggregator_id: number;
    aggregator: object;
    problem_id: number;
    problem: Problem | null;
    price: string;
    our_percent: number;
    client_name: string;
    phones: string[];
    address: string;
    note: string;
    work_volume: string;
    scheduled_at?: string;
    engineer_id?: number;
    status: OrderStatus;
    is_repeat?: boolean;
    created_at?: string;
    engineer?: Engineer;
}

export interface CreateOrderRequest {
    aggregator_id: number;
    problem_id: number;
    price: string;
    our_percent: number;
    client_name: string;
    phones: string[];
    address: string;
    work_volume: string;
    note?: string;
    scheduled_at?: string;
    engineer_id?: number;
}

export interface Problem {
    id: number;
    name: string;
}

export async function getOrders(date?: string): Promise<Order[]> {
    return apiFetch(`/api/orders?date=${date}`);
}

export async function assignOrder(orderId: number, engineerId: number) {
    return apiFetch(`/api/orders/assign-order`, {
        method: "POST",
        body: JSON.stringify({ engineer_id: engineerId, order_number: orderId }),
    });
}

export async function cancelOrder(orderId: number) {
    return apiFetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
    });
}

export async function createOrder(payload: CreateOrderRequest) {
    return apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
