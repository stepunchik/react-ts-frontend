import { Admin, Resource } from 'react-admin';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { PublicationList } from './PublicationList';
import { UsersList } from './UsersList';
import { useStateContext } from '@app/providers/ContextProvider';
import { ForbiddenPage } from '@pages/forbidden';
import { currentUser } from '@shared/api/endpoints/users';
import { useEffect, useState } from 'react';

export const AdminPage = () => {
    const { user, token, setUser } = useStateContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            currentUser()
                .then((data: any) => {
                    setUser(data.data);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) {
        return <div className="loading">Загрузка пользователя...</div>;
    }

    if (!user.roles?.includes('admin')) {
        return <ForbiddenPage />;
    }

    return (
        <Admin basename="/admin" dataProvider={dataProvider} authProvider={authProvider}>
            <Resource name="publications" list={PublicationList} />
            <Resource name="users" list={UsersList} />
        </Admin>
    );
};
