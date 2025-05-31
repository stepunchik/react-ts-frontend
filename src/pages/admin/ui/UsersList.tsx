import { Datagrid, List, TextField, DateField } from 'react-admin';

export const UsersList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="name" label="Имя" />
            <TextField source="email" label="Электронная почта" />
            <TextField source="sex" label="Пол" />
            <TextField source="image" label="Изображение" />
            <DateField source="birthday" label="Дата рождения" />
            <DateField source="created_at" label="Дата создания" />
        </Datagrid>
    </List>
);
