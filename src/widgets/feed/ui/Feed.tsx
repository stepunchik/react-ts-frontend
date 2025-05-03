import { useState, useEffect } from 'react';
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
            setPublications(data.publications);
        })
        .catch(() => {
            setIsLoading(false);
        })
    }
    
    return (
        <div className="feed">
            { publications.length == 0 && !isLoading ?
                <div>Публикаций нет.</div>
                : null
            }
            {isLoading &&
                <div>Loading...</div>
            }
            {!isLoading &&
                publications.map((publication) => (
                    <div key={publication.id} className="publication-block">
                        <div>
                            {publication.title}
                        </div>
                        <p>
                            {publication.text}
                        </p>
                        <img src={publication.image} alt={publication.title}/>
                    </div>
                ))
            }
        </div>
    );

};
