import { Editor } from 'primereact/editor';

import './publication-editor.scss';

interface PublicationEditorProps {
    text: string;
    setText: (value: string) => void;
}

export const PublicationEditor: React.FC<PublicationEditorProps> = ({ text, setText }) => {
    const editorModules = {
        toolbar: [['bold', 'italic', 'underline']],
    };
    const editorFormats = ['bold', 'italic', 'underline'];

    return (
        <div className="publication-editor">
            <Editor
                value={text}
                onTextChange={(e) => setText(e.textValue)}
                modules={editorModules}
                formats={editorFormats}
                style={{ height: '320px' }}
            />
        </div>
    );
};
