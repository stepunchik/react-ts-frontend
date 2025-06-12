import { Editor } from 'primereact/editor';

import './publication-editor.scss';

interface PublicationEditorProps {
    text: string;
    onChange: (text: string) => void;
}

export const PublicationEditor: React.FC<PublicationEditorProps> = ({ text, onChange }) => {
    const editorModules = {
        toolbar: [['bold', 'italic', 'underline']],
    };
    const editorFormats = ['bold', 'italic', 'underline'];

    return (
        <div className="publication-editor">
            <Editor
                value={text}
                onTextChange={(e) => onChange(e.textValue)}
                modules={editorModules}
                formats={editorFormats}
                className="custom-editor"
            />
        </div>
    );
};
