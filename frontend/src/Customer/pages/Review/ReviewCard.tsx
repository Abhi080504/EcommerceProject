import React from 'react'
import { Avatar, Box, Grid, IconButton, Rating, } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { red } from '@mui/material/colors'

interface ReviewCardProps {
    review: any;
    isOwner?: boolean;
    onDelete?: (id: number) => void;
    isGrocery?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, isOwner, onDelete, isGrocery }) => {
    const theme = {
        primary: isGrocery ? "#1B5E20" : "#3E2C1E",
        accent: isGrocery ? "#FFB300" : "#F9B233",
    }

    // Fallbacks
    const nameToUse = review.userFullName || review.user?.fullName || "Anonymous";
    const userName = nameToUse.charAt(0).toUpperCase();
    const fullName = nameToUse;
    const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "";

    return (
        <div className='bg-white/60 backdrop-blur-md border border-white/80 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-between h-full'>
            {/* Avatar Section */}
            <div className="flex gap-5 items-start">
                <div className="flex-shrink-0">
                    <Avatar
                        className='text-white font-black'
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: theme.primary,
                            border: `2px solid ${theme.accent}`,
                            boxShadow: `0 4px 12px ${theme.primary}1a`
                        }}
                    >
                        {userName}
                    </Avatar>
                </div>

                {/* Content Section */}
                <div className='space-y-3 flex-1 break-words'>
                    <div>
                        <p style={{ color: theme.primary }} className='font-black text-lg tracking-tight'>{fullName}</p>
                        <p style={{ color: theme.primary }} className='opacity-40 text-[10px] font-black uppercase tracking-widest'>{date}</p>
                    </div>

                    <Rating
                        readOnly
                        value={review.reviewRating || review.rating}
                        precision={0.5}
                        size="small"
                        sx={{ color: theme.accent }}
                    />

                    <p style={{ color: theme.primary }} className="text-sm leading-relaxed font-medium opacity-80 italic">
                        "{review.reviewText}"
                    </p>

                    {review.productImages && review.productImages.length > 0 && (
                        <div className="flex gap-3 flex-wrap mt-4">
                            {review.productImages.map((img: string, index: number) => (
                                <div key={index} className="w-20 h-20 rounded-2xl overflow-hidden border border-white/80 shadow-sm hover:scale-105 transition-transform duration-300">
                                    <img className='w-full h-full object-cover'
                                        src={img}
                                        alt={`review-img-${index}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Button (if owner) */}
            {isOwner && (
                <div className="ml-2">
                    <IconButton
                        onClick={() => onDelete && onDelete(review.id)}
                        sx={{
                            color: '#3E2C1E',
                            opacity: 0.3,
                            '&:hover': { color: '#ef4444', opacity: 1, bgcolor: '#fef2f2' }
                        }}
                    >
                        <Delete />
                    </IconButton>
                </div>
            )}
        </div>
    )
}

export default ReviewCard
