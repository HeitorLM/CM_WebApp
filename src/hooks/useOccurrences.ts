import { useState, useEffect, useCallback } from 'react';
import { OccurrenceDB, LocationDB, UsersEntity } from '../types';
import { getOccurrences, getLocations, getUsers } from '../services/api';

export const useOccurrences = () => {
    const [occurrences, setOccurrences] = useState<OccurrenceDB[]>([]);
    const [locations, setLocations] = useState<LocationDB[]>([]);
    const [users, setUsers] = useState<UsersEntity[]>([]);
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

    const updateData = useCallback(async () => {
        try {
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
            setError('Não foi possível atualizar as ocorrências');
        }
    }, []);

    useEffect(() => {
        fetchOccurrences();
        const interval = setInterval(updateData, 10 * 60 * 1000); // 10 minutos
        return () => clearInterval(interval);
    }, [fetchOccurrences, updateData]);

    return { occurrences, locations, users, isLoading, error, refetch: fetchOccurrences };
};