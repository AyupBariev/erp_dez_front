import { apiFetch } from "./http";
import type {Engineer} from "./engineer.ts";

export type OrderStatus =
    | "new"                  // новые
    | "in_proccess"          // логист выдал инженеру
    | "working"              // инженер принял
    | "closed_without_repeat"// заказ отчитан, на рассмотрении
    | "sent_to_cash"// на кассу
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
    repeat_id?: number;
    repeat_erp_number?: number;
    repeat_description?: string;
    repeated_by?: string;
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
    status: OrderStatus;
    repeat_id?: number;
    repeat_erp_number?: number;
}

export interface Problem {
    id: number;
    name: string;
}

export async function getOrders(date?: string): Promise<Order[]> {
    return apiFetch(`/api/orders?date=${date}`);
}

export async function assignOrder(orderNumber: number, engineerId: number) {
    return apiFetch(`/api/orders/assign`, {
        method: "POST",
        body: JSON.stringify({ engineer_id: engineerId, erp_number: orderNumber }),
    });
}

export async function unAssignOrder(orderNumber: number) {
    return apiFetch(`/api/orders/unassign`, {
        method: "POST",
        body: JSON.stringify({ erp_number: orderNumber }),
    });
}

export const cancelOrder = async (orderNumber: number): Promise<Order> => {
    return apiFetch(`/api/orders/${orderNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: 'canceled'}),
    });
};

export async function createOrder(payload: CreateOrderRequest) {
    return apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export const updateOrder = async (orderNumber: number, data: CreateOrderRequest): Promise<Order> => {
    return apiFetch(`/api/orders/${orderNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};