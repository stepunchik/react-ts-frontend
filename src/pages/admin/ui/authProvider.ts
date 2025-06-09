import axiosClient from '@shared/api/client';
import { login } from '@shared/api/endpoints/login';
import { logout } from '@shared/api/endpoints/logout';

interface AuthProviderParams {
    username: string;
    password: string;
}

export const authProvider = {
    login: async ({ username, password }: AuthProviderParams) => {
        try {
            const response = await login({
                email: username,
                password,
            });

            localStorage.setItem('ACCESS_TOKEN', response.data.token);
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            const { data } = await axiosClient.get('/user');
            if (!data.roles?.includes('admin')) {
                await logout();
                return Promise.reject(new Error('Доступ только для администраторов'));
            }

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error('Ошибка аутентификации'));
        }
    },

    logout: () => {
        try {
            logout();
            localStorage.removeItem('ACCESS_TOKEN');
            delete axiosClient.defaults.headers.common['Authorization'];
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error('Ошибка выхода'));
        }
    },

    checkAuth: () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return Promise.resolve();
        }
        return Promise.reject();
    },

    checkError: (error: any) => {
        const status = error.status || error.response?.status;

        if (status === 401 || status === 403) {
            localStorage.removeItem('ACCESS_TOKEN');
            delete axiosClient.defaults.headers.common['Authorization'];
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getIdentity: async () => {
        try {
            const { data } = await axiosClient.get('/user');
            return Promise.resolve({
                id: data.id,
                fullName: data.name,
            });
        } catch {
            return Promise.reject();
        }
    },

    getPermissions: async () => {
        try {
            const { data } = await axiosClient.get('/user');
            if (data.roles?.includes('admin')) {
                return Promise.resolve('admin');
            }
            await logout();
            return Promise.reject(new Error('Недостаточно прав доступа'));
        } catch {
            return Promise.reject(new Error('Ошибка получения пользователя'));
        }
    },
};
