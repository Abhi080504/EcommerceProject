import React, { useEffect } from 'react';
import DealCard from './DealCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppDispatch, useAppSelector } from '../../../../State/hooks';
import { fetchDeals } from '../../../../State/Deals/dealSlice';

const Deals = () => {
  const dispatch = useAppDispatch();
  const { deals, loading } = useAppSelector(state => state.deal);

  // Fetch deals on mount
  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  // Filter only active deals if needed (assuming backend returns all)
  const activeDeals = deals;

  if (loading) return <div className="text-center py-10">Loading Deals...</div>;

  if (!activeDeals || activeDeals.length === 0) {
    return <div className="text-center py-10 text-gray-500">No active deals at the moment.</div>;
  }

  return (
    <div className='py-5 lg:px-20'>
      <div className='flex items-center gap-6 overflow-x-auto pb-4'>
        {/* overflow-x-auto allows horizontal scrolling if no carousel */}
        {activeDeals.map((item: any) => (
          <div key={item.id} className="min-w-[300px]">
            <DealCard deal={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Deals;
