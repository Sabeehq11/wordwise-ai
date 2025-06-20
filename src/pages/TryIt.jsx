import React from 'react';
import Editor from '../components/Editor';
import { FiArrowRight, FiStar } from 'react-icons/fi';

const TryIt = ({ theme }) => {
  const getButtonClasses = (variant = 'primary') => {
    const baseClasses = "inline-flex items-center justify-center px-8 py-4 font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl rounded-2xl";
    
    const variantClasses = {
      primary: `bg-gradient-to-r from-${theme.primary}-500 to-${theme.secondary}-600 text-white hover:from-${theme.primary}-600 hover:to-${theme.secondary}-700`,
      secondary: `bg-white/80 backdrop-blur-sm text-${theme.primary}-700 hover:bg-white/90 border-2 border-white/50`
    };
    
    return `${baseClasses} ${variantClasses[variant]}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center">
        <div className={`inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-${theme.primary}-100 to-${theme.secondary}-100 border border-${theme.primary}-200 mb-6`}>
          <FiStar className={`w-4 h-4 text-${theme.primary}-600 mr-2`} />
          <span className={`text-${theme.primary}-700 font-semibold text-sm`}>Try WordWise AI Free</span>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Experience AI-Powered Writing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Get instant feedback on your writing. No account required—just start typing and see the magic happen.
        </p>
      </div>
      
      {/* Editor Section */}
      <div className="relative">
        <Editor isPublic={true} theme={theme} />
      </div>

      {/* Call to Action */}
      <div className={`text-center p-12 bg-gradient-to-r from-${theme.primary}-500 to-${theme.secondary}-600 rounded-3xl text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">Love what you see?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Sign up now to save your documents, track your progress, and unlock advanced AI writing features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="/signup" 
              className="inline-flex items-center px-8 py-4 bg-white text-gray-800 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Create Free Account
              <FiArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a 
              href="/login" 
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryIt; 