import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { teal } from '@mui/material/colors';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { color, price, discount } from './FilterData';

const FilterSection = () => {
  const [expandColor, setExpandColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleColorToggle = () => {
    setExpandColor(!expandColor);
  };

  const updateFilterParams = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;
      if (value) {
        // Update URL with new filter value
        searchParams.set(name, value);
      } else {
        // Remove filter if cleared
        searchParams.delete(name);
      }
      setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
      setSearchParams({});
  };

  return (
    <div className='bg-white'>
      {/* Header */}
      <div className='flex items-center justify-between h-[50px] px-5 lg:border-r'>
        <p className='text-lg font-bold text-gray-800'>Filters</p>
        <Button 
            size='small' 
            className='text-teal-600 cursor-pointer font-semibold uppercase'
            onClick={clearAllFilters}
        >
          Clear all
        </Button>
      </div>

      <Divider />

      <div className='px-5 py-5 space-y-6 lg:border-r'>
        
        {/* COLOR SECTION */}
        <section>
          <FormControl>
            <FormLabel 
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                pb: "10px"
              }}
              id='color'
            >
              Color
            </FormLabel>

            <RadioGroup
                aria-labelledby="color" 
                name="color"
                value={searchParams.get("color") || ""}
                onChange={updateFilterParams}
            >
              {color.slice(0, expandColor ? color.length : 5).map((item, index) =>
                <FormControlLabel
                  key={index}
                  value={item.name}
                  control={<Radio size="small" sx={{color: teal[600], '&.Mui-checked': {color: teal[600]}}} />}
                  label={
                    <div className='flex items-center gap-2'>
                      <span
                        style={{ backgroundColor: item.hex }}
                        className={`h-4 w-4 rounded-full border border-gray-300`}
                      ></span>
                      <span className='text-sm text-gray-700'>{item.name}</span>
                    </div>
                  }
                />
              )}
            </RadioGroup>
          </FormControl>

          <div>
            <button
              onClick={handleColorToggle}
              className='text-teal-600 cursor-pointer hover:text-teal-800 text-sm font-bold mt-2'
            >
              {expandColor ? "- Show Less" : `+ ${color.length - 5} more`}
            </button>
          </div>
        </section>

        <Divider />

        {/* PRICE SECTION */}
        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                pb: "10px"
              }}
              id='price'
            >
              Price
            </FormLabel>

            <RadioGroup
              name="price"
              value={searchParams.get("price") || ""}
              onChange={updateFilterParams}
              aria-labelledby="price"
            >
              {price.map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.value}
                  control={<Radio size="small" sx={{color: teal[600], '&.Mui-checked': {color: teal[600]}}} />}
                  label={<span className='text-sm text-gray-700'>{item.name}</span>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>

        <Divider />

        {/* DISCOUNT SECTION */}
        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                pb: "10px"
              }}
              id='discount'
            >
              Discount Range
            </FormLabel>

            <RadioGroup
              name="discount"
              value={searchParams.get("discount") || ""}
              onChange={updateFilterParams}
              aria-labelledby="discount"
            >
              {discount.map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.value}
                  control={<Radio size="small" sx={{color: teal[600], '&.Mui-checked': {color: teal[600]}}} />}
                  label={<span className='text-sm text-gray-700'>{item.name}</span>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>

      </div>
    </div>
  )
}

export default FilterSection;