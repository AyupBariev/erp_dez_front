import { apiFetch } from './http.ts';

export interface DictionaryItem {
    id: number;
    name: string;
    created_at: string;
    updated_at?: string;
}

export type Source = DictionaryItem
export type Problem = DictionaryItem

// API функции с использованием apiFetch
export const getSources = async (): Promise<Source[]> => {
    const data = await apiFetch('/api/dictionaries/aggregators');
    return data.data;
};

export const getProblems = async (): Promise<Problem[]> => {
    const data = await apiFetch('/api/dictionaries/problems');
    return data.data;
};

export const createSource = async (name: string): Promise<Source> => {
    const data = await apiFetch('/api/dictionaries/aggregators', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
    return data.data;
};

export const createProblem = async (name: string): Promise<Problem> => {
    const data = await apiFetch('/api/dictionaries/problems', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
    return data.data;
};