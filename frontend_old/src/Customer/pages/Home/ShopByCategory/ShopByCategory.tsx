import React, { useEffect } from 'react';
import ShopBycategoryCard from './ShopBycategoryCard';
import { useAppDispatch, useAppSelector } from '../../../../State/hooks';
import { fetchHomeCategories } from '../../../../State/HomeCategory/homeCategorySlice';

const ShopByCategory = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.homeCategory);

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  return (
    <div className='flex flex-wrap justify-between lg:px-20 gap-7'>
      {categories.map((item) => (
        <ShopBycategoryCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ShopByCategory;
