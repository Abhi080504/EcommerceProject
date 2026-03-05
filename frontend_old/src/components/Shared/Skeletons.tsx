import React from 'react';
import { Skeleton, Box, Grid, TableCell, TableRow } from '@mui/material';

export const ProductCardSkeleton = () => {
    return (
        <div className='productCard w-[15rem] m-3 transition-all cursor-pointer'>
            <div className='h-[20rem]'>
                <Skeleton variant="rectangular" width="100%" height="100%" className='object-cover object-left-top' />
            </div>
            <div className='textPart bg-white p-3'>
                <div>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                </div>
                <div className='flex items-center space-x-2 mt-2'>
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="20%" />
                </div>
            </div>
        </div>
    );
};

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
    return (
        <>
            {Array.from(new Array(rows)).map((_, index) => (
                <TableRow key={index}>
                    {Array.from(new Array(columns)).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};

export const GridSkeleton = ({ count = 4 }) => {
    return (
        <div className='flex flex-wrap justify-center bg-white py-5'>
            {Array.from(new Array(count)).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}
