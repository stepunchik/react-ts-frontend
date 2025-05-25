import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackIcon } from '../../../shared/assets/BackIcon';
import { useState, useEffect } from 'react';
import { PublicationEditor } from '../../../features/publication-editor';
import { updatePublication } from '../../../shared/api/endpoints/publications';
import { showPublication } from '../../../shared/api/endpoints/publications';

export const PublicationEditPage = () => {
    const navigate = useNavigate();
    const { id: publicationId } = useParams();
    const publication = useLocation();
    const [post, setPost] = useState<any>(publication.state?.post ?? null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<{
        title: string;
        text: string;
        image?: File | null;
    }>({
        title: '',
        text: '',
        image: null,
    });

    useEffect(() => {
        if (!publication.state?.post && publicationId) {
            setIsLoading(true);
            showPublication(publicationId)
                .then((res) => setPost(res.data.publication))
                .catch(() => setPost(null))
                .finally(() => setIsLoading(false));
        }
    }, [publication.state?.post, publicationId]);

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                text: post.text,
                image: null,
            });
        }
    }, [post]);

    const handleEditorChange = (text: string) => {
        setFormData((prevState) => ({ ...prevState, text }));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files, value, type } = event.target;

        if (type === 'file' && files && files[0]) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!publicationId) return;

        const data = new FormData();
        data.append('title', formData.title);
        data.append('text', formData.text);
        if (formData.image) data.append('image', formData.image);

        await updatePublication(data, publicationId)
            .then((res) =>
                navigate(`/publications/${publicationId}`, {
                    state: { post: res.data.publication },
                })
            )
            .catch((err) => {
                console.error('Ошибка загрузки публикации:', err);
            });
    };

    if (isLoading || !post) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <form className="publication-form" onSubmit={handleSubmit}>
            <div className="back-button" onClick={() => navigate(-1)}>
                <BackIcon className="back-icon" />
            </div>
            <h1 className="title">Отредактируйте публикацию</h1>
            <div className="form-item publication-form-item">
                <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="title">Введите заголовок</label>
            </div>
            <div className="form-item publication-form-item">
                <input type="file" id="image" name="image" onChange={handleChange} />
            </div>
            <PublicationEditor text={formData.text} onChange={handleEditorChange} />
            <div className="button-block">
                <button type="submit" className="button form-button">
                    Сохранить
                </button>
            </div>
        </form>
    );
};
