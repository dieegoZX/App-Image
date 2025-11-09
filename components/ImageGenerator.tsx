import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { aspectRatios, AspectRatio } from '../types';
import Spinner from './Spinner';
import PromptSuggestions from './PromptSuggestions';
import { generationPrompts } from '../data/promptSuggestions';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Por favor, insira um prompt para gerar uma imagem.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageB64 = await generateImage(prompt, aspectRatio);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Prompt da Imagem
        </label>
        <textarea
          id="prompt"
          rows={3}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="ex: Uma paisagem urbana futurista ao pôr do sol, com carros voadores"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <PromptSuggestions 
        title="Precisa de inspiração?"
        prompts={generationPrompts}
        onSelectPrompt={setPrompt}
      />

      <div>
        <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
          Proporção da Imagem
        </label>
        <select
          id="aspectRatio"
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
        >
          {aspectRatios.map((ratio) => (
            <option key={ratio} value={ratio}>
              {ratio}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isLoading && <Spinner />}
        {isLoading ? 'Gerando...' : 'Gerar Imagem'}
      </button>

      {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

      {generatedImage && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Imagem Gerada</h3>
          <div className="flex flex-col items-center gap-4">
             <img src={generatedImage} alt="Generated" className="max-w-full h-auto rounded-lg shadow-lg" />
             <a
              href={generatedImage}
              download="generated-image.png"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              Baixar Imagem
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;