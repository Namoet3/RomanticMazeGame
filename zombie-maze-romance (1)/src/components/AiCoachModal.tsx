
import React from 'react';
import { HeartIcon } from '../../components/icons'; 

interface AiCoachModalProps {
  isOpen: boolean;
  isLoading: boolean;
  message: string | null;
  onClose: () => void;
}

const AiCoachModal: React.FC<AiCoachModalProps> = ({ isOpen, isLoading, message, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[170] p-3 screen-fade-in">
      <div className="bg-purple-800 bg-opacity-95 p-4 sm:p-5 rounded-lg shadow-xl max-w-sm w-full border border-pink-500 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-pink-300 mb-3 font-handwritten">
          Bir Bilgelik Fısıltısı...
        </h3>
        <div className="min-h-[60px] flex flex-col items-center justify-center text-indigo-200 text-sm sm:text-base mb-4 px-2">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <HeartIcon className="w-8 h-8 text-pink-400 animate-ping mb-2" />
              <p>Senin için biraz tavsiye düşlüyorum, aşkım... 💖</p>
            </div>
          ) : message ? (
            <p className="leading-relaxed">{message}</p>
          ) : (
            <p>Hmm, aşk fısıltıları şu an biraz utangaç. Ama birbirinizi derinden sevmeye devam edin!</p>
          )}
        </div>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-pink-400 focus:ring-opacity-60 disabled:opacity-50"
        >
          {isLoading ? "Düşünüyor..." : "Tamam, aşkım!"}
        </button>
      </div>
    </div>
  );
};

export default AiCoachModal;