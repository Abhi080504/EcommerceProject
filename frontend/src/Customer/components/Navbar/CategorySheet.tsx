import React from 'react'
import { menLevelTwo } from '../../../data/category/level Two/menLevelTwo'
import { womenLevelTwo } from '../../../data/category/level Two/womenLevelTwo'
import { electronicsLevelTwo } from '../../../data/category/level Two/electronicsLevelTwo'
import { furniturelevelTwo } from '../../../data/category/level Two/furnitureLevelTwo'
import { menLevelThree } from '../../../data/category/level Three/menLevelThree'
import { womenLevelThree } from '../../../data/category/level Three/womenLevelThree'
import { electronicsLevelThree } from '../../../data/category/level Three/electronicsLevelThree'
import { furnitureLevelThree } from '../../../data/category/level Three/furnitureLevelThree'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const categoryTwo: { [key: string]: any[] } = {
  men: menLevelTwo,
  women: womenLevelTwo,
  electronics: electronicsLevelTwo,
  home_furniture: furniturelevelTwo,
}

const categoryThree: { [key: string]: any[] } = {
  men: menLevelThree,
  women: womenLevelThree,
  electronics: electronicsLevelThree,
  home_furniture: furnitureLevelThree,
}

const CategorySheet = ({ selectedCategory, setShowSheet }: any) => {

  const navigate = useNavigate()

  const childCategory = (category: any, parentCategoryId: any) => {
    return category.filter((child: any) => child.parentCategoryId === parentCategoryId)
  }

  return (
    <Box sx={{ zIndex: 2 }} className='bg-white shadow-lg lg:h-[500px] overflow-y-auto'>
      <div className='flex flex-wrap text-sm'>

        {categoryTwo[selectedCategory]?.map((item: any, index) => (
          <div
            key={item.categoryId}
            className={`p-4 lg:w-[20%] ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
          >
            <p className='text-primary-color mb-3 font-semibold'>{item.name}</p>
            <ul className='space-y-2'>
              {childCategory(categoryThree[selectedCategory], item.categoryId).map((child: any) => (
                <li onClick={() => navigate("/products/" + child.categoryId)}
                  key={child.categoryId}
                  className='hover:text-primary-color cursor-pointer'
                >
                  {child.name}
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>
    </Box>
  )
}

export default CategorySheet
