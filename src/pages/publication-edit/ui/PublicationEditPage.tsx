import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { showPublication } from '@shared/api/endpoints/publications';
import { PublicationForm } from '@features/publication-form';

import './publication-edit.scss';

export const PublicationEditPage = () => {
    const { id: publicationId } = useParams();
    const location = useLocation();
    const [post, setPost] = useState<any>(location.state?.post ?? null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!location.state?.post && publicationId) {
            setIsLoading(true);
            showPublication(publicationId)
                .then((res) => setPost(res.data.publication))
                .catch(() => setPost(null))
                .finally(() => setIsLoading(false));
        }
    }, [location.state?.post, publicationId]);

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!post && !isLoading) {
        return <div className="error">Публикация не найдена</div>;
    }

    return (
        <div className="publication-edit-page">
            <h1 className="form-page-title">Отредактируйте публикацию</h1>
            <PublicationForm post={post} isEdit={true} />
        </div>
    );
};
