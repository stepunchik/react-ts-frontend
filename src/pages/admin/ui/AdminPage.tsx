import { Admin, Resource } from 'react-admin';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { PublicationList } from './PublicationList';
import { UsersList } from './UsersList';

export const AdminPage = () => {
    return (
        <Admin basename="/admin" dataProvider={dataProvider} authProvider={authProvider}>
            <Resource name="publications" list={PublicationList} />
            <Resource name="users" list={UsersList} />
        </Admin>
    );
};
