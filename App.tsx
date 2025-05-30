
import React from 'react';
import ChatInterface from './components/ChatInterface';
import { CatIcon } from './components/icons/CatIcon';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-100 via-amber-50 to-emerald-100 text-neutral-800">
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <CatIcon className="h-16 w-16 text-rose-500 mr-3" />
          <h1 className="text-4xl font-bold text-rose-700 tracking-tight">
            Kätzchen Pflegemama KI
          </h1>
        </div>
        <p className="text-lg text-neutral-600">
          Deine liebevolle Expertin für alle Fragen rund um Katzenbabys.
        </p>
      </header>
      <div className="w-full max-w-2xl h-[70vh] ">
        <ChatInterface />
      </div>
      <footer className="mt-8 text-center text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Kätzchenhilfe. Alle Rechte vorbehalten.</p>
        <p className="mt-1">Bitte beachte: Diese KI ersetzt keinen Tierarztbesuch. Bei ernsten Problemen suche immer professionelle Hilfe.</p>
      </footer>
    </div>
  );
};

export default App;
