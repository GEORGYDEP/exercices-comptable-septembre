
import React, { useState, useEffect, useRef } from 'react';
import { LEVELS } from './constants';
import { DocumentViewer } from './components/DocumentViewer';
import { JournalTable } from './components/JournalTable';
import { PlanComptableModal, DeclarationTvaModal, CodesPopsyModal } from './components/ReferenceTools';
import { JournalRow, JournalType } from './types';
import { BookOpen, ChevronRight, ChevronLeft, Eye, RefreshCw, LogIn, AlertCircle, Printer, RotateCcw, Trophy, FileText, List, Grid } from 'lucide-react';

const LoginScreen: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@istlm.org') || email.length < 12) {
      setError("L'adresse email doit être au format prénom.nom@istlm.org");
      return;
    }
    onLogin(email);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row">
        {/* Left decoration */}
        <div className="bg-yellow-500 md:w-1/3 p-8 flex flex-col justify-between text-slate-900">
          <div>
            <BookOpen size={48} className="mb-4" />
            <h1 className="text-2xl font-bold leading-tight">Exercices de comptabilité POPSY</h1>
          </div>
          <div className="mt-8 text-sm font-semibold opacity-80">
            Institut Saint-Luc Frameries
          </div>
        </div>
        
        {/* Right content */}
        <div className="p-8 md:w-2/3">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Bienvenue</h2>
          
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            Il s'agit d'un exercice basé sur l'enregistrement des écritures comptables dans les différents journaux (achat, vente, financier et opération diverse), il a été réalisé pour les élèves de l'Institut Saint-Luc à Frameries option Technicien en comptabilité par Mr Depret.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Adresse Email (Institut)
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="prénom.nom@istlm.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-yellow-200'}`}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs mt-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
            >
              <span>Commencer l'exercice</span>
              <LogIn size={18} />
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-slate-400 italic">
              Réalisé par Mr Depret
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompletionScreen: React.FC<{ userEmail: string, onRestart: () => void, onPrint: () => void }> = ({ userEmail, onRestart, onPrint }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 print:hidden">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-2xl w-full">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full text-yellow-500 mb-6">
          <Trophy size={48} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Félicitations !</h1>
        <p className="text-slate-600 text-lg mb-8">
          Vous avez terminé tous les exercices, <span className="font-bold text-slate-800">{userEmail.split('@')[0]}</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onPrint}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Printer size={20} />
            Imprimer le rapport complet
          </button>
          
          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold"
          >
            <RotateCcw size={20} />
            Recommencer les exercices
          </button>
        </div>
      </div>
    </div>
  );
};

// Component only visible when printing
const PrintView: React.FC<{ userEmail: string, allUserAnswers: Record<number, Record<number, JournalRow[]>> }> = ({ userEmail, allUserAnswers }) => {
  return (
    <div className="hidden print:block p-8 bg-white text-black print-color-adjust-exact">
      <style>{`
        @media print {
          .print-color-adjust-exact {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <div className="mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold">Rapport d'exercices comptables POPSY</h1>
        <p className="text-lg mt-2">Élève : {userEmail}</p>
        <p className="text-sm text-gray-500">Institut Saint-Luc Frameries - {new Date().toLocaleDateString()}</p>
      </div>

      {LEVELS.map((level) => (
        <div key={level.id} className="mb-8 break-inside-avoid page-break-after-auto border-b border-gray-200 pb-8">
          <h2 className="text-xl font-bold bg-gray-100 p-2 mb-4 border-l-4 border-slate-800">
            Niveau {level.id} : {level.title}
          </h2>
          
          {/* Journals with User Input vs Solution */}
          <div className="space-y-6">
            {level.requiredJournals.map((journalTemplate, idx) => {
              // Retrieve by INDEX to support multiple journals of same type
              const userRows = allUserAnswers[level.id]?.[idx] || [];
              
              return (
                <div key={idx} className="border border-gray-300 rounded p-4 break-inside-avoid">
                  <h3 className="font-bold text-lg mb-2">{journalTemplate.type} - {journalTemplate.defaultDate}</h3>
                  
                  {/* User Answer Table (Simplified for Print) */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-blue-800 mb-1">Votre réponse :</h4>
                    {userRows.length > 0 ? (
                      <table className="w-full text-xs border-collapse border border-gray-400 mb-2">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-400 p-1 w-20">Compte</th>
                            <th className="border border-gray-400 p-1 w-16">TVA</th>
                            <th className="border border-gray-400 p-1 w-20">Popsy</th>
                            <th className="border border-gray-400 p-1">Libellé</th>
                            <th className="border border-gray-400 p-1 text-right w-24">Débit</th>
                            <th className="border border-gray-400 p-1 text-right w-24">Crédit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userRows.map((r: JournalRow, rIdx: number) => (
                            <tr key={rIdx}>
                              <td className="border border-gray-400 p-1 font-mono">{r.accountNumber}</td>
                              <td className="border border-gray-400 p-1 text-center">{r.declTva}</td>
                              <td className="border border-gray-400 p-1 text-center">{r.codePopsy}</td>
                              <td className="border border-gray-400 p-1">{r.label}</td>
                              <td className="border border-gray-400 p-1 text-right bg-yellow-50">{r.debit}</td>
                              <td className="border border-gray-400 p-1 text-right bg-blue-50">{r.credit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-xs italic text-gray-500">Aucune donnée saisie.</p>
                    )}
                  </div>

                  {/* Solution Table */}
                  <div>
                    <h4 className="text-sm font-bold text-green-800 mb-1">Correction :</h4>
                    <table className="w-full text-xs border-collapse border border-gray-400">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="border border-gray-400 p-1 w-20">Compte</th>
                          <th className="border border-gray-400 p-1 w-16">TVA</th>
                          <th className="border border-gray-400 p-1 w-20">Popsy</th>
                          <th className="border border-gray-400 p-1 text-right w-24">Débit</th>
                          <th className="border border-gray-400 p-1 text-right w-24">Crédit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journalTemplate.solution.map((s, sIdx) => (
                          <tr key={sIdx}>
                            <td className="border border-gray-400 p-1 font-mono font-bold">{s.accountNumber}</td>
                            <td className="border border-gray-400 p-1 text-center">{s.declTva}</td>
                            <td className="border border-gray-400 p-1 text-center">{s.codePopsy}</td>
                            <td className="border border-gray-400 p-1 text-right font-mono">{s.debit}</td>
                            <td className="border border-gray-400 p-1 text-right font-mono">{s.credit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

type ActiveModal = 'NONE' | 'PLAN' | 'TVA' | 'CODES';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [activeModal, setActiveModal] = useState<ActiveModal>('NONE');

  // CRITICAL FIX: Use journal index (number) instead of type (string) as the key
  // This prevents collision when multiple journals of same type exist (e.g. 2 Sales journals in Level 25)
  // Structure: { [levelId]: { [journalIndex]: rows[] } }
  const [allUserAnswers, setAllUserAnswers] = useState<Record<number, Record<number, JournalRow[]>>>({});

  const currentLevel = LEVELS[currentLevelIdx];

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setIsCompleted(false);
    setShowSolution(false);
    setAllUserAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const nextLevel = () => {
    setShowSolution(false);
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
    }
  };

  const prevLevel = () => {
    if (currentLevelIdx > 0) {
      setShowSolution(false);
      setCurrentLevelIdx(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Update rows based on journal index
  const updateJournalRows = (levelId: number, journalIndex: number, rows: JournalRow[]) => {
    setAllUserAnswers(prev => ({
      ...prev,
      [levelId]: {
        ...(prev[levelId] || {}),
        [journalIndex]: rows
      }
    }));
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (isCompleted) {
    return (
      <>
        <CompletionScreen userEmail={userEmail} onRestart={handleRestart} onPrint={handlePrint} />
        <PrintView userEmail={userEmail} allUserAnswers={allUserAnswers} />
      </>
    );
  }

  // Get current level rows or empty array by index
  const getCurrentJournalRows = (journalIndex: number) => {
    return allUserAnswers[currentLevel.id]?.[journalIndex] || [];
  };

  return (
    <>
      <div className="min-h-screen flex flex-col font-sans print:hidden">
        {/* Header */}
        <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-2 rounded text-slate-900">
                <BookOpen size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Compta POPSY</h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{userEmail}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                  <span>Institut Saint-Luc</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={prevLevel} 
                disabled={currentLevelIdx === 0}
                className={`p-2 rounded-full transition-colors ${currentLevelIdx === 0 ? 'text-slate-700 cursor-not-allowed' : 'hover:bg-slate-700 text-white'}`}
              >
                <ChevronLeft />
              </button>
              <div className="text-center">
                <span className="block text-xs text-slate-400 uppercase tracking-widest">Niveau</span>
                <span className="font-bold text-lg">{currentLevel.id} / {LEVELS.length}</span>
              </div>
              <button 
                onClick={nextLevel} 
                className="p-2 rounded-full hover:bg-slate-700 text-white transition-colors"
                title={currentLevelIdx === LEVELS.length - 1 ? "Terminer" : "Suivant"}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 pb-32">
          
          {/* Left Panel: Source Documents */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentLevel.title}</h2>
              <p className="text-slate-600 mb-4">{currentLevel.description}</p>
              <div className="h-1 w-20 bg-yellow-500 rounded"></div>
            </div>

            <div className="space-y-6">
              {currentLevel.documents.map((doc, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-full bg-slate-200 rounded-l group-hover:bg-blue-400 transition-colors"></div>
                  <DocumentViewer document={doc} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Journals (Work Area) */}
          <div className="lg:w-1/2">
            <div className="space-y-8">
              {currentLevel.requiredJournals.map((journalTemplate, idx) => (
                <JournalTable
                  // CRITICAL FIX: Use ID + Index to ensure uniqueness and force React to remount on level change
                  key={`${currentLevel.id}-${idx}`}
                  type={journalTemplate.type}
                  defaultDate={journalTemplate.defaultDate}
                  rows={getCurrentJournalRows(idx)}
                  setRows={(rows) => updateJournalRows(currentLevel.id, idx, rows)}
                  showSolution={showSolution}
                  solutionRows={journalTemplate.solution}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Footer / Controls */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 shadow-2xl z-40">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* REFERENCE BUTTONS */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
               <button 
                 onClick={() => setActiveModal('PLAN')}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-semibold transition-colors whitespace-nowrap"
               >
                 <List size={16} /> Plan Comptable
               </button>
               <button 
                 onClick={() => setActiveModal('TVA')}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-semibold transition-colors whitespace-nowrap"
               >
                 <FileText size={16} /> Déclaration TVA
               </button>
               <button 
                 onClick={() => setActiveModal('CODES')}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-semibold transition-colors whitespace-nowrap"
               >
                 <Grid size={16} /> Codes Popsy
               </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSolution(!showSolution)}
                className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg shadow transition-all ${
                  showSolution 
                  ? 'bg-slate-800 text-white hover:bg-slate-900' 
                  : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400'
                }`}
              >
                <Eye size={18} />
                {showSolution ? 'Masquer' : 'Valider'}
              </button>

              {currentLevelIdx === LEVELS.length - 1 && (
                <button 
                  onClick={nextLevel}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-colors animate-pulse"
                >
                  Terminer <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {activeModal === 'PLAN' && <PlanComptableModal onClose={() => setActiveModal('NONE')} />}
      {activeModal === 'TVA' && <DeclarationTvaModal onClose={() => setActiveModal('NONE')} />}
      {activeModal === 'CODES' && <CodesPopsyModal onClose={() => setActiveModal('NONE')} />}

      {/* Hidden Print View */}
      <PrintView userEmail={userEmail} allUserAnswers={allUserAnswers} />
    </>
  );
};

export default App;
