import 'react-datepicker/dist/react-datepicker.css';
import { UserEditForm } from '@features/user-edit-form';
import './user-edit.scss';

export const UserEditPage = () => {
    return (
        <div className="user-edit-page">
            <h1 className="form-page-title">Отредактируйте информацию о себе</h1>
            <UserEditForm />
        </div>
    );
};
