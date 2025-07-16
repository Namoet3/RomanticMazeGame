
import React from 'react';
import { PowerUpType } from '../../types';
import { POWERUP_ICON_DETAILS } from '../../constants';
import * as Icons from './icons'; // Assuming all icons are exported from here

interface PowerUpExplanationModalProps {
  isOpen: boolean;
  powerUpDetails: {
    type: PowerUpType;
    name: string;
    description: string;
    IconComponent: string; // Name of the icon component
  } | null;
  onConfirm: () => void;
}

const PowerUpExplanationModal: React.FC<PowerUpExplanationModalProps> = ({ isOpen, powerUpDetails, onConfirm }) => {
  if (!isOpen || !powerUpDetails) {
    return null;
  }

  const IconComponent = (Icons as any)[powerUpDetails.IconComponent] || Icons.HeartIcon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[160] p-3 screen-fade-in">
      <div className="bg-slate-800 p-4 sm:p-5 rounded-lg shadow-xl max-w-sm w-full border border-purple-500 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-2">
          Aşk Lütfu Kazandın!
        </h3>
        <div className="flex flex-col items-center my-3">
          <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 text-pink-400 mb-2" />
          <p className="text-md sm:text-lg font-semibold text-indigo-100">{powerUpDetails.name}</p>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 px-2">{powerUpDetails.description}</p>
        </div>
        <button
          onClick={onConfirm}
          className="w-full mt-3 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-pink-400 focus:ring-opacity-60"
        >
          Tamamdır Aşkım!
        </button>
      </div>
    </div>
  );
};

export default PowerUpExplanationModal;
