import { useState, useEffect } from 'react';
import type { Source, Problem } from '../api/dictionaries';
import { getSources, getProblems } from '../api/dictionaries';

interface UseDictionariesReturn {
    sources: Source[];
    problems: Problem[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useDictionaries = (): UseDictionariesReturn => {
    const [sources, setSources] = useState<Source[]>([]);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDictionaries = async () => {
        try {
            setLoading(true);
            setError(null);

            const [sourcesData, problemsData] = await Promise.all([
                getSources(),
                getProblems()
            ]);

            setSources(sourcesData);
            setProblems(problemsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dictionaries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDictionaries();
    }, []);

    return {
        sources,
        problems,
        loading,
        error,
        refetch: fetchDictionaries,
    };
};