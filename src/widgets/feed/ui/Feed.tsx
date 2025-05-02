import { useState } from 'react';
import { feed } from '/src/shared/api/endpoints/feed';

import './feed.scss';

export const Feed = () => {
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getPublications();
    }, []);

    const getPublications = () => {
        setIsLoading(true);
        feed()
        .then(({ data }) => {
            setIsLoading(false);
            setPublications(data.data);
        })
        .catch(() => {
            setIsLoading(false);
        })
    }
    
    return (
        <div className="feed">
            {isLoading &&
                <div>Loading...</div>
            }
            {!isLoading &&
                publications.map((publication) => (
                    <div className="publication-block">
                        <div>
                            
                        </div>
                        <p>
                            
                        </p>
                        <img src=""/>
                    </div>
                ))
            }
        </div>
    );
};
