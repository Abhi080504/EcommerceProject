import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface AddressCardProps {
    address: any; // Using any for now, ideally strictly typed
    selected: boolean;
    onSelect: () => void;
}

const AddressCard = ({ address, selected, onSelect }: AddressCardProps) => {
    return (
        <div
            onClick={onSelect}
            className={`relative p-5 border rounded-xl cursor-pointer transition-all flex items-start gap-4 shadow-sm group
            ${selected
                    ? "border-[#F9B233] bg-[#FFF8E1] shadow-md"
                    : "border-[#E0D8CC] hover:border-[#F9B233] bg-white hover:bg-[#FDFBF7]"
                }
        `}
        >
            {/* Icon Container */}
            <div className={`p-2.5 rounded-full border transition-colors flex items-center justify-center
            ${selected
                    ? "bg-[#F9B233] border-[#F9B233] text-[#3E2C1E]"
                    : "bg-[#F5F1E8] border-[#E0D8CC] text-[#8D5A46]"
                }
        `}>
                {/* Simple logic for icon */}
                <LocationOnIcon fontSize='small' />
            </div>

            {/* Details */}
            <div className='flex-1'>
                <div className='flex justify-between items-start'>
                    <h3 className={`font-bold mb-1 text-base ${selected ? 'text-[#3E2C1E]' : 'text-[#5D4037]'}`}>
                        {address?.name || "Address"}
                    </h3>
                    {selected && <CheckCircleIcon sx={{ color: '#F9B233', fontSize: 22 }} />}
                </div>

                <p className='text-sm text-[#5D4037] leading-relaxed mb-3 opacity-90'>
                    {address?.address}, {address?.locality}, {address?.city}, {address?.state} - {address?.pinCode}
                </p>

                <p className='text-xs font-bold text-[#3E2C1E] bg-[#FDF6E3] inline-block px-2 py-1 rounded border border-[#E0D8CC]'>
                    {address?.mobile}
                </p>
            </div>
        </div>
    )
}

export default AddressCard;