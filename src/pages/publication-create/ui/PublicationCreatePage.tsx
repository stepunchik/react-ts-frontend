import { useState } from 'react';
import { PublicationEditor } from '../../../features/publication-editor';
import { createPublication } from '../../../shared/api/endpoints/publications';

export const PublicationCreatePage = () => {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');

    const handleCreatePublicationButtonClick = () => {
        createPublication({ title, text, image });
    };

    return (
        <form>
            <input
                type="text"
                placeholder="Заголовок публикации"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="file"
                placeholder="Ссылка на изображение"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <PublicationEditor text={text} setText={setText} />
            <button onClick={handleCreatePublicationButtonClick}></button>
        </form>
    );
};
