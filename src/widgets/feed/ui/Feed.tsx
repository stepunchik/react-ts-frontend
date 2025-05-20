import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { publications, userPublications } from '../../../shared/api/endpoints/publications';
import { like, dislike, updateGrade, deleteGrade } from '../../../shared/api/endpoints/grades';
import { useStateContext } from '../../../app/providers/ContextProvider';
import { LikeIcon } from '../../../shared/assets/LikeIcon';
import { DislikeIcon } from '../../../shared/assets/DislikeIcon';

import './feed.scss';

interface FeedProps {
    userProfileId?: number;
}

export const Feed: React.FC<FeedProps> = ({ userProfileId }) => {
    const navigate = useNavigate();
    const { user } = useStateContext();
    const [posts, setPosts] = useState<any[]>([]);
    const [gradedPublications, setGradedPublications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getPublications();
    }, []);

    const handlePostClick = (id: number, post: any) => {
        navigate(`/publications/${id}`, { state: { post } });
    };

    const getPublications = () => {
        setIsLoading(true);

        const request = userProfileId ? userPublications(userProfileId) : publications();

        request
            .then(({ data }) => {
                setPosts(data.publications);
                setGradedPublications(data.gradedPublications || []);
            })
            .catch((err) => {
                console.error('Ошибка загрузки публикаций: ', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const getUserGradeForPost = (postId: number): number | null => {
        const grade = gradedPublications.find((g) => g.publication_id === postId);
        return grade ? grade.value : null;
    };

    const _updateGrade = (postId: number, value: number) => {
        setGradedPublications((prevGrades) => {
            const otherGrades = prevGrades.filter((g) => g.publication_id !== postId);
            return [...otherGrades, { publication_id: postId, value }];
        });
    };

    const removeGrade = (postId: number) => {
        setGradedPublications((prev) => prev.filter((g) => g.publication_id !== postId));
    };

    const handleLikeClick = (postId: number) => {
        if (!user) {
            return;
        }

        const existing = gradedPublications.find((g) => g.publication_id === postId);
        console.log(existing);
        switch (existing?.value) {
            case 0:
                removeGrade(postId);
                updateGrade(postId, 1).then(() => {
                    _updateGrade(postId, 1);
                });
                break;
            case 1:
                deleteGrade(postId).then(() => {
                    removeGrade(postId);
                });
                break;
            default:
                like(postId).then(() => {
                    _updateGrade(postId, 1);
                });
                break;
        }
    };

    const handleDislikeClick = (postId: number) => {
        if (!user) {
            return;
        }

        const existing = gradedPublications.find((g) => g.publication_id === postId);

        switch (existing?.value) {
            case 0:
                deleteGrade(postId).then(() => {
                    removeGrade(postId);
                });
                break;
            case 1:
                removeGrade(postId);
                updateGrade(postId, 0).then(() => {
                    _updateGrade(postId, 0);
                });
                break;
            default:
                dislike(postId).then(() => {
                    _updateGrade(postId, 0);
                });
                break;
        }
    };

    return (
        <div className="feed">
            {posts.length == 0 && !isLoading ? (
                <div className="no-info">Публикаций нет.</div>
            ) : null}
            {isLoading && <div className="loading">Загрузка...</div>}
            {!isLoading &&
                posts.map((post) => (
                    <div
                        key={post.id}
                        className="publication-block"
                        onClick={() => handlePostClick(post.id, post)}>
                        <div className="title">{post.title}</div>
                        <p className="text">{post.text}</p>
                        {post.image && <img className="image" src={post.image} alt={post.title} />}
                        <div className="buttons-block">
                            <LikeIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeClick(post.id);
                                }}
                                className={
                                    getUserGradeForPost(post.id) === 1
                                        ? 'icon-button selected'
                                        : 'icon-button'
                                }
                            />
                            <DislikeIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDislikeClick(post.id);
                                }}
                                className={
                                    getUserGradeForPost(post.id) === 0
                                        ? 'icon-button selected'
                                        : 'icon-button'
                                }
                            />
                        </div>
                    </div>
                ))}
        </div>
    );
};
