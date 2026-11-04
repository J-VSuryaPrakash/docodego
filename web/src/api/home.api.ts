import { api } from './api'


const getHomes = async () => {
    const response = await api.get('/homes');
    return response.data.results;
}

const createHome = async (data: { name: string }) => {
    const response = await api.post('/homes', data);
    return response.data;
}

export { getHomes, createHome }