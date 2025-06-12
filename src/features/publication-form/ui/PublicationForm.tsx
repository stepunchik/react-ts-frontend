import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ZodError } from 'zod';
import { updatePublication, createPublication } from '@shared/api/endpoints/publications';
import { useNavigate } from 'react-router-dom';
import { publicationEditSchema } from '../model/publicationEditSchema';
import { PublicationEditor } from './PublicationEditor';

type FormErrors = Record<string, string>;

interface PublicationFormProps {
    post?: any;
    isEdit?: boolean;
}

export const PublicationForm: React.FC<PublicationFormProps> = ({ post, isEdit = false }) => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<FormErrors>({});

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
        if (post && isEdit) {
            setFormData({
                title: post.title,
                text: post.text,
                image: null,
            });
        }
    }, [post, isEdit]);

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

    function validateForm(data: any): boolean {
        try {
            publicationEditSchema.parse(data);
            setErrors({});
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: FormErrors = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                return false;
            }
        }
        return true;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm(formData)) {
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('text', formData.text);
        if (formData.image) data.append('image', formData.image);

        try {
            let response;
            if (isEdit && post?.id) {
                response = await updatePublication(data, post.id);
            } else {
                response = await createPublication(data);
            }

            navigate(`/publications/${response.data.publication.id}`, {
                state: { post: response.data.publication },
            });
        } catch (err) {
            console.error('Ошибка сохранения публикации:', err);
        }
    };

    return (
        <form className="publication-form" onSubmit={handleSubmit}>
            <div className="form-item publication-form-item">
                <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="title">Введите заголовок</label>
                {errors.title && <p className="error">{errors.title}</p>}
            </div>
            <div className="form-item publication-form-item">
                <input type="file" id="image" name="image" onChange={handleChange} />
                {errors.image && <p className="error">{errors.image}</p>}
            </div>
            <PublicationEditor text={formData.text} onChange={handleEditorChange} />
            {errors.text && <p className="error">{errors.text}</p>}
            <div className="button-block">
                <button type="submit" className="button form-button">
                    {isEdit ? 'Сохранить' : 'Создать'}
                </button>
            </div>
        </form>
    );
};
