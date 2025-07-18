import axios from 'axios';
import { OccurrenceDB, LocationDB, UsersEntity } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL 
        ? `http://${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}` 
        : 'http://localhost:3000'
});

export const getOccurrences = async (interval?: string): Promise<OccurrenceDB[]> => {
    try {
        const { data } = await api.get<OccurrenceDB[]>('/occs', {
            params: { interval }
        });

        // Adicionar log de diagnósticoxs
        // console.log('Dados recebidos:', data);
        // console.log('Número de ocorrências:', data.length);

        return data;
    } catch (error) {
        console.error('Erro detalhado ao buscar ocorrências:', error);
        throw error;
    }
};

export const getLocations = async (): Promise<LocationDB[]> => {
    try {
        const { data } = await api.get<LocationDB[]>('/locations');
        return data;
    } catch (error) {
        console.error('Erro detalhado ao buscar localizações:', error);
        throw error;
    }
};

export const getUsers = async (): Promise<number> => {
    try {
        const { data } = await api.get<number>('/users');

        return data;
    } catch (error) {
        console.error('Erro detalhado ao buscar usuários:', error);
        throw error;
    }
};