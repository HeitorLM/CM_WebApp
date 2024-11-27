import { useState, useEffect } from 'react';
import { OccurrenceDB, LocationDB, UsersEntity } from '../types';
import { getOccurrences, getLocations, getUsers } from '../services/api';

export const useOccurrences = () => {
    const [occurrences, setOccurrences] = useState<OccurrenceDB[]>([]);
    const [locations, setLocations] = useState<LocationDB[]>([]);
    const [users, setUsers] = useState<UsersEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOccurrences = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getOccurrences();
            setOccurrences(data);

            const data2 = await getLocations();
            setLocations(data2);

            const data3 = await getUsers();
            setUsers(data3);
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

    return { occurrences, locations, users, isLoading, error, refetch: fetchOccurrences };
};