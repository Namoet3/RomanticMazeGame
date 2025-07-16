
import React from 'react';
import { HeartIcon } from '../../components/icons';

const SurpriseEffect: React.FC = () => {
  return (
    <>
      <div className="surprise-bg-flash"></div>
      <div className="fixed inset-0 flex items-center justify-center z-[210] pointer-events-none">
        <HeartIcon className="w-2/5 h-2/5 sm:w-1/4 sm:h-1/4 text-pink-400 opacity-80 animate-surprise-visual" />
      </div>
    </>
  );
};

export default SurpriseEffect;