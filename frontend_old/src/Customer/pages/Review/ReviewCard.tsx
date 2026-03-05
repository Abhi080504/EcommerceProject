import React from 'react'
import { Avatar, Box, Grid, IconButton, Rating, } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { red } from '@mui/material/colors'

interface ReviewCardProps {
    review: any;
    isOwner?: boolean;
    onDelete?: (id: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, isOwner, onDelete }) => {

    // Fallbacks
    const userName = review.user?.fullName ? review.user.fullName.charAt(0).toUpperCase() : "U";
    const fullName = review.user?.fullName || "Anonymous";
    const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "";

    return (
        <div className='flex justify-between'>
            {/* Avatar Section */}
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                    <Avatar className='text-white' sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}>
                        {userName}
                    </Avatar>
                </div>

                {/* Content Section */}
                <div className='space-y-2 flex-1 break-words'>
                    <div>
                        <p className='font-semibold text-lg'>{fullName}</p>
                        <p className='opacity-70 text-sm'>{date}</p>
                    </div>

                    <Rating
                        readOnly
                        value={review.rating}
                        precision={0.5}
                    />
                    <p className="text-gray-800">{review.reviewText}</p>

                    {review.productImages && review.productImages.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                            {review.productImages.map((img: string, index: number) => (
                                <img key={index} className='w-24 h-24 object-cover rounded-md'
                                    src={img}
                                    alt={`review-img-${index}`} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Button (if owner) */}
            {isOwner && (
                <div>
                    <IconButton onClick={() => onDelete && onDelete(review.id)}>
                        <Delete sx={{ color: red[700] }} />
                    </IconButton>
                </div>
            )}
        </div>
    )
}

export default ReviewCard
