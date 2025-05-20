import { useNavigate } from 'react-router-dom';
import { createConversation } from '../../../../shared/api/endpoints/conversations';

interface CreateConversationButtonProps {
    name: string;
    second_user: number;
    _className?: string;
}

export const CreateConversationButton: React.FC<CreateConversationButtonProps> = ({
    name,
    second_user,
    _className,
}) => {
    const navigate = useNavigate();
    const handleCreateConversation = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        try {
            await createConversation(name, second_user).then((res) => {
                navigate(`/conversations/${res.data.id}`);
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleCreateConversation} type="submit" className={_className}>
            Написать
        </button>
    );
};
