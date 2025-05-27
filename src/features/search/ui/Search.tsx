import './search.scss';

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const Search: React.FC<SearchProps> = ({ value, onChange }) => {
    return (
        <input
            type="text"
            className="search-field"
            placeholder="Поиск по публикациям..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};
