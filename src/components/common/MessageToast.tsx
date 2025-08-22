import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface MessageToastProps {
  showSuccessMessage: boolean;
  showErrorMessage: boolean;
  messageContent: string;
  isRTL: boolean;
}

export const MessageToast: React.FC<MessageToastProps> = ({ 
  showSuccessMessage, showErrorMessage, messageContent, isRTL 
}) => (
  <>
    {showSuccessMessage && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text">
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
          <CheckCircle className="h-5 w-5" />
          <span>{messageContent}</span>
        </div>
      </div>
    )}
    
    {showErrorMessage && (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text">
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
          <AlertCircle className="h-5 w-5" />
          <span>{messageContent}</span>
        </div>
      </div>
    )}
  </>
);
