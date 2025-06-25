import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Modal, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import './page-article.css';
import { UserContext } from '../context/user-context';

const PageArticle = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [favorited, setFavorited] = useState(false);
    const [favoritesCountState, setFavoritesCountState] = useState(0);

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`);
                const data = await res.json();
                setFavorited(data.article.favorited);
                setFavoritesCountState(data.article.favoritesCount);
                setArticle(data.article);
            } catch (error) {
                console.error('Ошибка загрузки статьи:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    const toggleFavorite = async () => {
        if (!user) {
            message.warning('Требуется авторизация');
            return;
        }

        try {
            const method = favorited ? 'DELETE' : 'POST';
            const res = await fetch(
                `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
                {
                    method,
                    headers: {
                        Authorization: `Token ${user.token}`,
                    },
                }
            );

            if (!res.ok) throw new Error('Ошибка при обновлении лайка');
            const result = await res.json();
            setFavorited(result.article.favorited);
            setFavoritesCountState(result.article.favoritesCount);
        } catch (err) {
            console.error('Ошибка при лайке:', err);
            message.error('Не удалось обновить лайк');
        }
    };

    const showDeleteModal = () => {
        setIsModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Ошибка удаления статьи:', error);
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEdit = () => {
        navigate(`/articles/${slug}/edit`);
    };

    if (loading) return <div>Loading article...</div>;
    if (!article) return <div>Статья не найдена</div>;

    const { title, tagList, description, body, author, createdAt } = article;

    const isAuthor = user?.username === author.username;

    return (
        <div className='page-article'>
            <div className='title-article-name'>
                <h1 className='article-title'>{title}
                    <div className='btn-like'>
                        <button className='like-button' onClick={toggleFavorite}>
                            {favorited ? <HeartFilled style={{color: 'red'}}/> : <HeartOutlined/>}
                            <span style={{marginLeft: 4}}>{favoritesCountState}</span>
                        </button>
                    </div>
                </h1>

                <div className='meta-right'>
                    <span className='author-name'>{author.username}</span>
                    <span className='article-date'>{new Date(createdAt).toLocaleDateString()}</span>
                    <img
                        className='author-avatar'
                        src={author.image || 'https://www.svgrepo.com/show/170710/avatar.svg'}
                        alt='avatar'
                    />
                </div>
            </div>

            <div className='article-meta'>
                <div className='meta-left'>
                    {tagList.map((tag, index) => (
                        <span key={tag + index} className='tag'>{tag}</span>
                    ))}
                </div>
            </div>

            <div className='btn-conteiner'>
                <p className='article-description'>{description}</p>

                {isAuthor && (
                    <div className='btn-article-all'>
                        <button className='btn-article article-delete' onClick={showDeleteModal}>Delete</button>
                        <button className='btn-article article-edit' onClick={handleEdit}>Edit</button>
                    </div>
                )}
            </div>

            <div className='article-body'>
                <ReactMarkdown>{body}</ReactMarkdown>
            </div>

            <Modal
                open={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="yes"
                cancelText="no"
                okButtonProps={{danger: true}}
            >
                <p>Are you sure you want to delete the article?</p>
            </Modal>
        </div>
    );
};

export default PageArticle;