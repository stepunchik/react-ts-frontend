import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
    deletePublication,
    publications,
    userPublications,
} from '@shared/api/endpoints/publications';
import { like, dislike, updateGrade, deleteGrade } from '@shared/api/endpoints/grades';
import { useStateContext } from '@app/providers/ContextProvider';
import { LikeIcon } from '@shared/assets/LikeIcon';
import { DislikeIcon } from '@shared/assets/DislikeIcon';

import './feed.scss';
import { EditIcon } from '@shared/assets/EditIcon';
import { TrashIcon } from '@shared/assets/TrashIcon';
import ReactModal from 'react-modal';
import { UpIcon } from '@shared/assets/UpIcon';
import { BeatLoader } from 'react-spinners';

interface FeedProps {
    userProfileId?: number;
    searchTerm?: string;
}

ReactModal.setAppElement('#root');

export const Feed: React.FC<FeedProps> = ({ userProfileId, searchTerm = '' }) => {
    const navigate = useNavigate();
    const { user } = useStateContext();
    const [posts, setPosts] = useState<any[]>([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [gradedPublications, setGradedPublications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hoveredPostId, setHoveredPostId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [publicationToDelete, setPublicationToDelete] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPublications = useCallback(
        async (pageNum: number, isInitialLoad = false) => {
            if (isInitialLoad) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            try {
                const request = userProfileId
                    ? userPublications(userProfileId, pageNum)
                    : publications(pageNum);

                const { data } = await request;

                if (isInitialLoad) {
                    setPosts(data.publications.data);
                    setTotalPosts(data.publications.total || 0);
                } else {
                    setPosts((prev) => [...prev, ...data.publications.data]);
                }

                setGradedPublications(data.gradedPublications || []);
                setHasMore(data.publications.current_page < data.publications.last_page);
            } catch (err) {
                console.error('Ошибка загрузки публикаций: ', err);
            } finally {
                if (isInitialLoad) {
                    setIsLoading(false);
                } else {
                    setIsLoadingMore(false);
                }
            }
        },
        [userProfileId]
    );

    useEffect(() => {
        fetchPublications(1, true);
    }, [userProfileId, fetchPublications]);

    const handleOnScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
            isLoading ||
            isLoadingMore ||
            !hasMore
        ) {
            return;
        }

        setPage((prev) => {
            const newPage = prev + 1;
            fetchPublications(newPage);
            return newPage;
        });
    }, [isLoading, isLoadingMore, hasMore, fetchPublications]);

    const debounce = (func: (...args: any[]) => void, wait: number) => {
        let timeout: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const debouncedHandleScroll = debounce(handleOnScroll, 100);

    useEffect(() => {
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll);
    }, [debouncedHandleScroll]);

    const handlePostClick = (id: number, post: any) => {
        navigate(`/publications/${id}`, { state: { post } });
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

    const handleEditButtonClick = (id: number, post: any) => {
        navigate(`/publications/${id}/edit`, { state: { post } });
    };

    const openDeleteModal = (id: number) => {
        setPublicationToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (publicationToDelete === null) return;

        deletePublication(publicationToDelete)
            .then(() => {
                setPosts((prev) => prev.filter((p) => p.id !== publicationToDelete));
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsModalOpen(false);
                setPublicationToDelete(null);
            });
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="feed">
            {posts.length == 0 && !isLoading ? (
                <div className="no-info">Публикаций нет.</div>
            ) : null}
            {!isLoading && filteredPosts.length === 0 && searchTerm && (
                <div className="no-info">Ничего не найдено по запросу «{searchTerm}».</div>
            )}
            {isLoading && (
                <div className="loading">
                    <BeatLoader />
                </div>
            )}
            {!isLoading &&
                filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className="publication-block"
                        onMouseEnter={() => setHoveredPostId(post.id)}
                        onMouseLeave={() => setHoveredPostId(null)}
                        onClick={() => handlePostClick(post.id, post)}>
                        {user?.id === post.user_id && hoveredPostId === post.id && (
                            <div className="action-icons-block">
                                <EditIcon
                                    className="action-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditButtonClick(post.id, post);
                                    }}
                                />
                                <TrashIcon
                                    className="action-icon delete-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(post.id);
                                    }}
                                />
                            </div>
                        )}
                        <div className="title">{post.title}</div>
                        <p className="text">{post.text}</p>
                        {post.image && <img className="image" src={post.image} alt={post.title} />}
                        {user?.id !== post.user_id && (
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
                        )}
                    </div>
                ))}

            {isLoadingMore && (
                <div className="loading">
                    <BeatLoader />
                </div>
            )}
            {!hasMore && posts.length > 0 && (
                <div className="no-info">
                    <div className="no-info">Публикаций больше нет.</div>
                    <UpIcon
                        className="go-up"
                        onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        }}
                    />
                </div>
            )}

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Подтверждение удаления"
                className="modal delete-modal">
                <h2>Удалить публикацию?</h2>
                <p>Вы уверены, что хотите удалить эту публикацию? Это действие нельзя отменить.</p>
                <div className="modal-buttons">
                    <button onClick={confirmDelete} className="confirm-btn">
                        Удалить
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
                        Отмена
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};
