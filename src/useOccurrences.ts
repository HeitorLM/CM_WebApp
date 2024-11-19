import { useState, useEffect } from 'react';
import { OccurrenceDB } from './types';
import { getOccurrences } from './api';

export const useOccurrences = () => {
    const [occurrences, setOccurrences] = useState<OccurrenceDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOccurrences = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getOccurrences();
            setOccurrences(data);
        } catch (err) {
            console.error('Erro no hook:', err);
            setError('Não foi possível carregar as ocorrências');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOccurrences();
    }, []);

    return { occurrences, isLoading, error, refetch: fetchOccurrences };
};