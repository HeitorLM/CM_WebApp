import axios from 'axios';
import { OccurrenceDB } from '../types/occurrence';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://192.168.15.181:3001'
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