import './publication-create.scss';
import { PublicationForm } from '@features/publication-form';

export const PublicationCreatePage = () => {
    return (
        <div className="publication-create-page">
            <h1 className="form-page-title">Создайте публикацию</h1>
            <PublicationForm isEdit={false} />
        </div>
    );
};
