import React, { useState, useRef } from 'react';
import { editImage, fileToBase64 } from '../services/geminiService';
import Spinner from './Spinner';
import PromptSuggestions from './PromptSuggestions';
import { editingPrompts } from '../data/promptSuggestions';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setEditedImage(null); // Clear previous result
      setError(null);
    }
  };

  const handleEdit = async () => {
    if (!uploadedImage) {
      setError('Por favor, carregue uma imagem para editar.');
      return;
    }
    if (!prompt) {
      setError('Por favor, insira um prompt de edição.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64Data, mimeType } = await fileToBase64(uploadedImage);
      const imageB64 = await editImage(base64Data, mimeType, prompt);
      setEditedImage(`data:${mimeType};base64,${imageB64}`);
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Carregar Imagem para Editar</label>
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
            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>

      {imagePreview && (
        <>
          <div>
            <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Prompt de Edição
            </label>
            <textarea
              id="edit-prompt"
              rows={2}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="ex: Adicione óculos de sol no gato"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <PromptSuggestions 
            title="Sugestões de edição"
            prompts={editingPrompts}
            onSelectPrompt={setPrompt}
          />
          
          <button
            onClick={handleEdit}
            disabled={isLoading || !uploadedImage}
            className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Editando...' : 'Editar Imagem'}
          </button>
        </>
      )}

      {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {imagePreview && (
          <div className="p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Imagem Original</h3>
            <img src={imagePreview} alt="Original to be edited" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}
        {(isLoading || editedImage) && (
          <div className={`p-4 bg-gray-900 rounded-lg ${!imagePreview ? 'md:col-span-2' : 'md:col-span-1'}`}>
            <h3 className="text-lg font-semibold mb-4 text-center">Imagem Editada</h3>
            {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
            {editedImage && (
              <div className="flex flex-col items-center gap-4">
                 <img src={editedImage} alt="Edited" className="w-full h-auto rounded-lg shadow-lg" />
                 <a
                  href={editedImage}
                  download="edited-image.png"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Baixar Imagem
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
