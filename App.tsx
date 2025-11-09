
import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import ImageAnalyzer from './components/ImageAnalyzer';
import TabButton from './components/TabButton';

const App = () => {
  const [activeTab, setActiveTab] = useState('generate');

  const renderContent = () => {
    switch (activeTab) {
      case 'generate':
        return <ImageGenerator />;
      case 'edit':
        return <ImageEditor />;
      case 'analyze':
        return <ImageAnalyzer />;
      default:
        return <ImageGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            DGM Image Studio
          </h1>
          <p className="mt-2 text-gray-400">
            Crie, modifique e compreenda imagens com o poder da IA.
          </p>
        </header>

        <div className="mb-8 p-1.5 flex justify-center space-x-2 rounded-lg bg-gray-800 max-w-md mx-auto">
          <TabButton
            label="Gerar"
            isActive={activeTab === 'generate'}
            onClick={() => setActiveTab('generate')}
          />
          <TabButton
            label="Editar"
            isActive={activeTab === 'edit'}
            onClick={() => setActiveTab('edit')}
          />
          <TabButton
            label="Analisar"
            isActive={activeTab === 'analyze'}
            onClick={() => setActiveTab('analyze')}
          />
        </div>

        <main className="bg-gray-800/50 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-700">
          {renderContent()}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Diego Ruan</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
