
import React from 'react';

interface FeedbackPopupProps {
  feedbackMessage: { text: string; type: 'success' | 'error' | 'info' };
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ feedbackMessage }) => {
  return (
    <div className={`fixed bottom-3 left-1/2 p-2 sm:p-2.5 rounded-md shadow-lg text-white font-semibold z-[250]
      ${feedbackMessage.type === 'success' ? 'bg-green-600' : feedbackMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} animate-feedback-popup text-xs sm:text-sm`}
      style={{ transform: 'translateX(-50%)' }} // Ensure it's centered
    >
      {feedbackMessage.text}
    </div>
  );
};

export default FeedbackPopup;