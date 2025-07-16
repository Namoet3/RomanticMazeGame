
import React from 'react';
import { DreamEssenceIcon } from '../../components/icons'; 

interface DreamWeaverModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
}

const DreamWeaverModal: React.FC<DreamWeaverModalProps> = ({ isOpen, isLoading, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[180] p-3 screen-fade-in">
      <div className="bg-indigo-900 bg-opacity-95 p-4 sm:p-5 rounded-lg shadow-2xl max-w-sm w-full border border-purple-400 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-4 font-handwritten">
          Rüya Dokuyucusu Kıpırdanıyor...
        </h3>
        <div className="min-h-[70px] flex flex-col items-center justify-center text-indigo-100 text-sm sm:text-base mb-4 px-2">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <DreamEssenceIcon className="w-10 h-10 text-purple-400 animate-pulse mb-3" />
              <p>Rüyanın dokusunu yeniden şekillendiriyor... lütfen bekle... ✨</p>
            </div>
          ) : (
            <p className="leading-relaxed">Rüya değişti!</p> 
          )}
        </div>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-purple-400 focus:ring-opacity-60 disabled:opacity-50 mt-2"
        >
          {isLoading ? "Dokuyor..." : "Portalı Kapat"}
        </button>
      </div>
    </div>
  );
};

export default DreamWeaverModal;