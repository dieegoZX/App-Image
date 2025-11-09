
import React, { useState, useRef } from 'react';
import { analyzeImageSimple, analyzeImageComplex, fileToBase64 } from '../services/geminiService';
import Spinner from './Spinner';

const ImageAnalyzer = () => {
  const [prompt, setPrompt] = useState('Descreva esta imagem em detalhes.');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      setError('Por favor, carregue uma imagem para analisar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { base64Data, mimeType } = await fileToBase64(uploadedImage);
      const result = useThinkingMode
        ? await analyzeImageComplex(base64Data, mimeType, prompt)
        : await analyzeImageSimple(base64Data, mimeType, prompt);
      setAnalysis(result);
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Carregar Imagem</label>
        <div
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition"
          onClick={() => fileInputRef.current?.click()}
        >
           <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-400">
              <p className="pl-1">{uploadedImage ? uploadedImage.name : 'Clique para carregar um arquivo'}</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>

       {imagePreview && (
        <>
            <div>
                <label htmlFor="analysis-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Prompt de Análise (Opcional)
                </label>
                <textarea
                    id="analysis-prompt"
                    rows={2}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="O que você gostaria de saber sobre a imagem?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                <div>
                    <h4 className="font-semibold text-white">Modo de Pensamento</h4>
                    <p className="text-sm text-gray-400">Para perguntas complexas, use o gemini-2.5-pro para uma análise mais profunda.</p>
                </div>
                <button
                    type="button"
                    className={`${useThinkingMode ? 'bg-indigo-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                    role="switch"
                    aria-checked={useThinkingMode}
                    onClick={() => setUseThinkingMode(!useThinkingMode)}
                >
                    <span
                        aria-hidden="true"
                        className={`${useThinkingMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                </button>
            </div>
        </>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !uploadedImage}
        className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isLoading && <Spinner />}
        {isLoading ? 'Analisando...' : 'Analisar Imagem'}
      </button>

      {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {imagePreview && (
          <div className="p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Sua Imagem</h3>
            <img src={imagePreview} alt="Uploaded for analysis" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}
        {(isLoading || analysis) && (
          <div className="p-4 bg-gray-900 rounded-lg md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-center">Análise da IA</h3>
            {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
            {analysis && (
              <div className="text-gray-300 whitespace-pre-wrap prose prose-invert max-w-none">
                {analysis}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ImageAnalyzer;
