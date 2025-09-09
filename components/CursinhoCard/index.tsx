import React from 'react';
import styles from '@/styles/cursinhocard.module.scss';
import { MdLocationOn, MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md';

interface ProductCardProps {
    title?: string;
    imageUrl?: string;
    location?: string;
    rating?: number;
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
    location,
    rating = 0,
}) => {
    return (
        <div
            className={styles.productCard}
            aria-label={`${title} product card, located at ${location}, rated ${rating} out of 5 stars`}
            role="link"
            tabIndex={0}
        >
            <img className={styles.productImage} src={imageUrl} />
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
        </div>
    );
};

export default ProductCard;
