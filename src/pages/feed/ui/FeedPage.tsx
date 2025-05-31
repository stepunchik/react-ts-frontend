import { Feed } from '../../../widgets/feed';
import { TopUsers } from '../../../widgets/top-users';
import { useOutletContext } from 'react-router-dom';
import './feed-page.scss';

export const FeedPage = () => {
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    return (
        <div className="feed-page">
            <div className="feed-layout">
                <Feed searchTerm={searchTerm} />
                <TopUsers />
            </div>
        </div>
    );
};
