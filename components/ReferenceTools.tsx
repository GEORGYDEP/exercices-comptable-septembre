
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { PLAN_COMPTABLE, DECLARATION_TVA, CODES_POPSY } from '../constants';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <X size={24} className="text-slate-500" />
        </button>
      </div>
      <div className="overflow-auto p-6 flex-grow">
        {children}
      </div>
    </div>
  </div>
);

export const PlanComptableModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [search, setSearch] = useState('');

  const filteredAccounts = PLAN_COMPTABLE.filter(
    item => 
      item.account.includes(search) || 
      item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal title="Plan Comptable" onClose={onClose}>
      <div className="mb-4 sticky top-0 bg-white pb-2 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un compte (numéro ou libellé)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            autoFocus
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
        {filteredAccounts.map((item) => (
          <div key={item.account} className="flex gap-2 hover:bg-blue-50 p-1 rounded border-b border-gray-100">
            <span className="font-mono font-bold text-blue-800 w-12">{item.account}</span>
            <span className="text-gray-700">{item.label}</span>
          </div>
        ))}
        {filteredAccounts.length === 0 && (
          <p className="text-center text-gray-500 py-8 col-span-2">Aucun compte trouvé.</p>
        )}
      </div>
    </Modal>
  );
};

export const DeclarationTvaModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const renderBox = (code: string, label: string) => (
    <div key={code} className="flex border-b border-gray-200 last:border-0">
      <div className="w-16 bg-gray-100 p-2 font-bold text-center border-r border-gray-200 flex items-center justify-center">
        {code}
      </div>
      <div className="p-2 flex-grow text-sm flex items-center">{label}</div>
    </div>
  );

  const renderSection = (title: string, items: {code: string, label: string}[], color: string) => (
    <div className={`border-2 ${color} rounded-lg mb-6 overflow-hidden`}>
      <div className={`${color.replace('border-', 'bg-')}-100 p-2 font-bold text-center border-b ${color}`}>
        {title}
      </div>
      <div className="bg-white">
        {items.map(item => renderBox(item.code, item.label))}
      </div>
    </div>
  );

  return (
    <Modal title="Structure de la Déclaration TVA" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {renderSection("CADRE II : Opérations à la sortie", DECLARATION_TVA.cadreII, "border-blue-500")}
          {renderSection("CADRE III : Opérations à l'entrée", DECLARATION_TVA.cadreIII, "border-green-500")}
        </div>
        <div>
          {renderSection("CADRE IV : Taxes Dues", DECLARATION_TVA.cadreIV, "border-red-500")}
          {renderSection("CADRE V : Taxes Déductibles", DECLARATION_TVA.cadreV, "border-purple-500")}
          {renderSection("CADRE VI : Solde", DECLARATION_TVA.cadreVI, "border-orange-500")}
        </div>
      </div>
    </Modal>
  );
};

export const CodesPopsyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Modal title="Codes TVA pour le logiciel POPSY" onClose={onClose}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ACHATS */}
        <div>
          <h3 className="font-bold text-lg mb-2 text-center bg-yellow-100 p-2 rounded">Achats et Notes de Crédit sur Achats</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Code</th>
                <th className="border p-2 w-16 text-center">TVA</th>
                <th className="border p-2 text-left">Libellé</th>
              </tr>
            </thead>
            <tbody>
              {CODES_POPSY.achats.map((code, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-2 font-bold bg-yellow-200 text-center">{code.code}</td>
                  <td className="border p-2 text-center bg-yellow-200">{code.tva}</td>
                  <td className="border p-2 bg-yellow-100">{code.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VENTES */}
        <div>
          <h3 className="font-bold text-lg mb-2 text-center bg-orange-100 p-2 rounded">Ventes et Notes de Crédit sur Ventes</h3>
          <table className="w-full text-sm border-collapse mb-8">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Code</th>
                <th className="border p-2 w-16 text-center">TVA</th>
                <th className="border p-2 text-left">Libellé</th>
              </tr>
            </thead>
            <tbody>
              {CODES_POPSY.ventes.map((code, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-2 font-bold bg-yellow-200 text-center">{code.code}</td>
                  <td className="border p-2 text-center bg-yellow-200">{code.tva}</td>
                  <td className="border p-2 bg-yellow-100">{code.label}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DIVERS / NOTES */}
          <div className="border-2 border-slate-800 p-4 rounded-lg bg-white shadow-sm">
             <h4 className="font-bold mb-2 underline">Notes Importantes :</h4>
             <ul className="space-y-3">
               {CODES_POPSY.divers.map((item, idx) => (
                 <li key={idx} className="flex gap-3 items-start">
                   <span className="font-bold bg-yellow-300 px-2 py-0.5 rounded text-xs">{item.code}</span>
                   <span className="text-sm">{item.label}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

      </div>
    </Modal>
  );
};
