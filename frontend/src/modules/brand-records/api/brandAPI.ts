import { Brand, BrandCreate, BrandUpdate } from "../domain/types";

let apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/v1';
if (!apiUrl.endsWith('/api/v1')) {
    apiUrl = apiUrl.replace(/\/+$/, '') + '/api/v1';
}
const API_URL = apiUrl;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key-123';

export const brandAPI = {
    getAll: async (): Promise<Brand[]> => {
        const response = await fetch(`${API_URL}/brands`, {
            headers: {
                'x-api-key': API_KEY,
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener los registros de marca');
        }
        return response.json();
    },

    create: async (data: BrandCreate): Promise<Brand> => {
        const response = await fetch(`${API_URL}/brands`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({
                name: data.name,
                owner: data.owner,
                lang: data.lang,
                status: 'Pendiente'
            }),
        });
        if (!response.ok) {
            throw new Error('Error al crear el registro de marca');
        }
        return response.json();
    },

    update: async (id: string, data: BrandUpdate): Promise<Brand> => {
        const response = await fetch(`${API_URL}/brands/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({
                name: data.name,
                owner: data.owner,
                lang: data.lang,
                status: data.status
            }),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el registro de marca');
        }
        return response.json();
    },

    remove: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/brands/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el registro de marca');
        }
    }
};
