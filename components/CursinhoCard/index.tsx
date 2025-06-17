import React from 'react';
import styles from '@/styles/cursinhocard.module.scss';
import { useRouter } from 'next/router';
import { MdLocationOn, MdAdd, MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md';

interface ProductCardProps {
    title?: string;
    imageUrl?: string;
    imageAlt?: string;
    location?: string;
    rating?: number; // rating from 0 to 5, can be fractional
    onPlusClick?: () => void;
    linkHref?: string;
}

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<MdStar key={i} className={styles.starIcon} aria-hidden="true" />);
        } else if (rating >= i - 0.5) {
            stars.push(<MdStarHalf key={i} className={styles.starIcon} aria-hidden="true" />);
        } else {
            stars.push(<MdStarBorder key={i} className={styles.starIcon} aria-hidden="true" />);
        }
    }
    return stars;
};

const ProductCard: React.FC<ProductCardProps> = ({
    title,
    imageUrl,
    imageAlt,
    location,
    rating = 0,
    onPlusClick,
    linkHref,
}) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(linkHref || '/');
    };

    const handlePlusClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevent triggering card click
        if (onPlusClick) {
            onPlusClick();
        }
    };

    return (
        <div
            className={styles.productCard}
            aria-label={`${title} product card, located at ${location}, rated ${rating} out of 5 stars`}
            onClick={handleCardClick}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
        >
            <img className={styles.productImage} src={imageUrl} alt={imageAlt} />
            <div className={styles.titleRow}>
                <h2 className={styles.productTitle}>{title}</h2>
                <div className={styles.locationContainer}>
                    <MdLocationOn className={styles.locationIcon} aria-hidden="true" />
                    <span>{location}</span>
                </div>
            </div>
            <div className={styles.ratingContainer} aria-label={`Rating: ${rating} out of 5`}>
                {renderStars(rating)}
                <span className={styles.ratingText}>{rating.toFixed(1)}</span>
            </div>
            <button
                type="button"
                aria-label={`Add ${title}`}
                className={styles.plusButton}
                onClick={handlePlusClick}
            >
                <MdAdd />
            </button>
        </div>
    );
};

export default ProductCard;
