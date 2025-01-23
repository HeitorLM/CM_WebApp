import { useState, useEffect, useCallback } from 'react';
import { OccurrenceDB, LocationDB, UsersEntity } from '../types';
import { getOccurrences, getLocations, getUsers } from '../services/api';

export const useOccurrences = () => {
    const [occurrences, setOccurrences] = useState<OccurrenceDB[]>([]);
    const [locations, setLocations] = useState<LocationDB[]>([]);
    const [users, setUsers] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOccurrences = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [occurrencesData, locationsData, usersData] = await Promise.all([
                getOccurrences(),
                getLocations(),
                getUsers()
            ]);
            setOccurrences(occurrencesData);
            setLocations(locationsData);
            setUsers(usersData);
        } catch (err) {
            console.error('Erro no hook:', err);
            setError('Não foi possível carregar as ocorrências');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchOccurrencesByInterval = useCallback(async (interval: string) => {
        try {
            const [occurrencesData] = await Promise.all([
                getOccurrences(interval)
            ]);
            setOccurrences(occurrencesData);
        } catch (err) {
            console.error('Erro no hook:', err);
            setError('Não foi possível carregar as ocorrências');
        }
    }, []);
    
    const updateDataByInterval = useCallback(async (interval: string) => {
        try {
            const [occurrencesData, locationsData, usersData] = await Promise.all([
                getOccurrences(interval),
                getLocations(),
                getUsers()
            ]);
            setOccurrences(occurrencesData);
            setLocations(locationsData);
            setUsers(usersData);
        } catch (err) {
            console.error('Erro no hook:', err);
            setError('Não foi possível atualizar as ocorrências');
        }
    }, []);

    useEffect(() => {
        fetchOccurrences();
    }, [fetchOccurrences]);

    return { occurrences, locations, users, isLoading, error, refetch: fetchOccurrences, fetchOccurrencesByInterval, updateDataByInterval };
};