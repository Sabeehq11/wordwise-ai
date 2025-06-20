import React from 'react';
import { FiZap, FiCheck, FiBookOpen, FiEdit3, FiTarget, FiBook, FiAlertCircle, FiInfo } from 'react-icons/fi';

const GrammarSuggestions = ({ suggestions = [], isLoading, onApplySuggestion, theme }) => {
  // Mock data for demo
  const mockSuggestions = suggestions.length > 0 ? suggestions : [
    {
      id: 1,
      type: 'grammar',
      original: 'My name sabeeh is',
      suggested: 'My name is Sabeeh',
      explanation: 'The correct word order in English for stating one\'s name is \'My name is [Name].\' Additionally, names should be capitalized.',
      position: { start: 0, end: 17 }
    },
    {
      id: 2,
      type: 'grammar',
      original: 'my brother name wajeeh is',
      suggested: 'My brother\'s name is Wajeeh',
      explanation: 'The correct possessive form is \'brother\'s\' to indicate that the name belongs to the brother. Also, names and the first word of a sentence should be capitalized.',
      position: { start: 18, end: 43 }
    }
  ];

  const getTypeConfig = (type) => {
    switch (type) {
      case 'grammar':
        return {
          icon: FiEdit3,
          label: 'Grammar Issue',
          color: '#3B82F6'
        };
      case 'spelling':
        return {
          icon: FiBookOpen,
          label: 'Spelling Issue',
          color: '#F59E0B'
        };
      case 'style':
        return {
          icon: FiTarget,
          label: 'Style Issue',
          color: '#8B5CF6'
        };
      case 'vocabulary':
        return {
          icon: FiBook,
          label: 'Vocabulary Issue',
          color: '#10B981'
        };
      default:
        return {
          icon: FiAlertCircle,
          label: 'Writing Issue',
          color: '#6B7280'
        };
    }
  };

  if (isLoading) {
    return (
      <div 
        className="h-full flex flex-col p-8"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <FiZap className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800">Writing Suggestions</h2>
          </div>
          <p className="text-blue-700 font-medium">AI-powered improvements</p>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Analyzing Your Text</h3>
            <p className="text-blue-600 text-sm">Our AI is reviewing your writing...</p>
          </div>
        </div>
      </div>
    );
  }

      return (
      <div 
              className="h-full flex flex-col p-8"
      style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid #bfdbfe',
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)'
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
            <FiZap className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800">Writing Suggestions</h2>
        </div>
        {mockSuggestions.length > 0 && (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
            ⚡ {mockSuggestions.length} suggestions found
          </div>
        )}
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto">
        {mockSuggestions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-md mx-auto border border-green-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Perfect Writing!</h3>
              <p className="text-green-700">No issues found. Your writing looks great!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {mockSuggestions.map((suggestion, index) => {
              const config = getTypeConfig(suggestion.type);
              const IconComponent = config.icon;
              
              return (
                <div key={suggestion.id}>
                  <div className="p-6 max-w-lg mx-auto transition-all duration-300 hover:bg-white/30 rounded-xl backdrop-blur-sm">
                    {/* Issue Type Header */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                          style={{ 
                            background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)` 
                          }}
                        >
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <h3 
                          className="text-lg font-bold"
                          style={{ color: config.color }}
                        >
                          {config.label}
                        </h3>
                      </div>
                    </div>

                    {/* AI-Style Content */}
                    <div className="space-y-8">
                      {/* Current Text - AI Detection */}
                      <div className="text-center">
                        <h4 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wide opacity-80">
                          🔍 AI Detected Issue
                        </h4>
                        <p className="text-red-700 font-medium leading-relaxed text-xl italic">
                          "{suggestion.original}"
                        </p>
                      </div>

                      {/* AI Arrow/Flow Indicator */}
                      <div className="flex justify-center">
                        <div className="text-blue-400 text-2xl animate-pulse">
                          ↓
                        </div>
                      </div>

                      {/* Suggested Fix - AI Improvement */}
                      <div className="text-center">
                        <h4 className="text-sm font-bold text-green-600 mb-3 uppercase tracking-wide opacity-80">
                          ✨ AI Suggests
                        </h4>
                        <p className="text-green-700 font-medium leading-relaxed text-xl italic">
                          "{suggestion.suggested}"
                        </p>
                      </div>

                      {/* AI Explanation */}
                      <div className="text-center">
                        <h4 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wide opacity-80">
                          🤖 AI Explains
                        </h4>
                        <p className="text-blue-700 leading-relaxed text-base opacity-90">
                          {suggestion.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Apply Button - Bottom Right */}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => onApplySuggestion(suggestion)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-5 py-2 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <div className="flex items-center space-x-2">
                          <FiCheck className="w-4 h-4" />
                          <span>Apply This Fix</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtle Divider Line - Only show between suggestions, not after the last one */}
                  {index < mockSuggestions.length - 1 && (
                    <div className="flex justify-center my-8">
                      <div className="w-48 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Tip */}
      {mockSuggestions.length > 0 && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-blue-200">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs text-white font-bold">i</span>
            </div>
            <p className="text-sm text-blue-800 font-medium">
              <span className="font-bold text-blue-600">Tip:</span> Apply suggestions that match your writing style
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarSuggestions; 