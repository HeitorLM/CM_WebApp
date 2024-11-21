import axios from 'axios';
import { OccurrenceDB, LocationDB, UsersEntity } from '../types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_URL_PORT}` : 'http://localhost:3001'
});

export const getOccurrences = async (): Promise<OccurrenceDB[]> => {
    try {
        const { data } = await api.get<OccurrenceDB[]>('/occs');

        // Adicionar log de diagnóstico
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

export const getUsers = async (): Promise<UsersEntity[]> => {
    try {
        const { data } = await api.get<UsersEntity[]>('/users');

        return data;
    } catch (error) {
        console.error('Erro detalhado ao buscar usuários:', error);
        throw error;
    }
};