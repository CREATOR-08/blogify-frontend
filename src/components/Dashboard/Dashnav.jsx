import React from 'react'
import NavLinks from '../NavLinks';
import SearchBar from '../SearchBar';

const Dashnav = ({ onOpenSettings = () => {} }) => {
  return (
    <div className='flex flex-wrap items-center text-slate-400 gap-4 p-4'>
      <NavLinks onOpenSettings={onOpenSettings} />
      <SearchBar />
    </div>
  );
};

export default Dashnav;
