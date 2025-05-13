import { useParams } from 'react-router-dom';
import { Profile } from '../../../widgets/profile';

export const ProfilePage = () => {
    const { id } = useParams();
    return (
        <div>
            <Profile userId={Number(id)} />
        </div>
    );
};
