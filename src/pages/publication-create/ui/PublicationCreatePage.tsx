import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicationEditor } from '../../../features/publication-editor';
import { createPublication } from '../../../shared/api/endpoints/publications';

import './publication-create.scss';

export const PublicationCreatePage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        title: string;
        text: string;
        image: File | null;
    }>({
        title: '',
        text: '',
        image: null,
    });

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

        const data = new FormData();
        data.append('title', formData.title);
        data.append('text', formData.text);
        if (formData.image) {
            data.append('image', formData.image);
        }

        await createPublication(data)
            .then((res) => {
                navigate(`/publications/${res.data.publication.id}`, {
                    state: { post: res.data.publication },
                });
            })
            .catch((err) => {
                console.error('Ошибка загрузки публикации:', err);
            });
    };

    return (
        <form className="publication-form" onSubmit={handleSubmit}>
            <h1 className="title">Создайте публикацию</h1>
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
                    Создать
                </button>
            </div>
        </form>
    );
};
