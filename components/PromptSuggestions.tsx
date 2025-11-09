
import React from 'react';

const PromptSuggestions = ({ title, prompts, onSelectPrompt }) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-400 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
