import axiosClient from '../../../shared/api/client';
import { DataProvider } from 'react-admin';

export const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const page = params.pagination?.page || 1;
        const perPage = params.pagination?.perPage || 10;

        const field = params.sort?.field || 'id';
        const order = params.sort?.order || 'ASC';

        const query = {
            page,
            per_page: perPage,
            sort: field,
            order,
            ...params.filter,
        };

        try {
            const { data } = await axiosClient.get(`/admin/${resource}`, { params: query });
            return {
                data: data.data || data.items || data,
                total:
                    data.meta?.total || data.total || (data.data ? data.data.length : data.length),
            };
        } catch (error) {
            throw new Error('Error fetching data');
        }
    },

    getOne: async (resource, params) => {
        try {
            const { data } = await axiosClient.get(`/admin/${resource}/${params.id}`);
            return { data };
        } catch (error) {
            throw new Error('Error fetching record');
        }
    },

    getMany: async (resource, params) => {
        try {
            const { data } = await axiosClient.get(`/admin/${resource}`, {
                params: { ids: params.ids },
            });
            return { data: Array.isArray(data) ? data : data.items };
        } catch (error) {
            throw new Error('Error fetching records');
        }
    },

    getManyReference: async (resource, params) => {
        try {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;

            const query = {
                page,
                per_page: perPage,
                sort: field,
                order,
                [params.target]: params.id,
                ...params.filter,
            };

            const { data } = await axiosClient.get(`/admin/${resource}`, { params: query });
            return {
                data: data.data || data.items || data,
                total:
                    data.meta?.total || data.total || (data.data ? data.data.length : data.length),
            };
        } catch (error) {
            throw new Error('Error fetching referenced records');
        }
    },

    update: async (resource, params) => {
        try {
            const { data } = await axiosClient.put(`/admin/${resource}/${params.id}`, params.data);
            return { data };
        } catch (error) {
            throw new Error('Error updating record');
        }
    },

    updateMany: async (resource, params) => {
        try {
            const responses = await Promise.all(
                params.ids.map((id) => axiosClient.put(`/admin/${resource}/${id}`, params.data))
            );
            return { data: responses.map((response) => response.data) };
        } catch (error) {
            throw new Error('Error updating records');
        }
    },

    create: async (resource, params) => {
        try {
            const { data } = await axiosClient.post(`/admin/${resource}`, params.data);
            return { data };
        } catch (error) {
            throw new Error('Error creating record');
        }
    },

    delete: async (resource, params) => {
        try {
            const { data } = await axiosClient.delete(`/admin/${resource}/${params.id}`);
            return { data };
        } catch (error) {
            throw new Error('Error deleting record');
        }
    },

    deleteMany: async (resource, params) => {
        try {
            const responses = await Promise.all(
                params.ids.map((id) => axiosClient.delete(`/admin/${resource}/${id}`))
            );
            return { data: responses.map((response) => response.data) };
        } catch (error) {
            throw new Error('Error deleting records');
        }
    },
};
