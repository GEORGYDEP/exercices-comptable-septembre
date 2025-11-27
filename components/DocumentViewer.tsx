
import React from 'react';
import { DocumentItem } from '../types';

interface DocumentViewerProps {
  document: DocumentItem;
}

const InvoiceViewer: React.FC<{ content: any }> = ({ content }) => {
  // Sécurisation des données pour éviter les écrans blancs
  const senderName = content.sender?.name || "Expéditeur Inconnu";
  const senderAddress = content.sender?.address || [];
  const senderVat = content.sender?.vat || "";

  const receiverName = content.receiver?.name || "Client";
  const receiverAddress = content.receiver?.address || [];
  const receiverVat = content.receiver?.vat || "";

  const detailsNumber = content.details?.number || "?";
  const detailsDate = content.details?.date || "?";
  const detailsPayment = content.details?.paymentInfo || "";

  return (
    <div className="bg-white border border-gray-300 shadow-md p-6 max-w-2xl mx-auto font-serif text-sm relative">
      <div className="absolute top-2 right-2 text-gray-300 text-xs font-sans">DOCUMENT COMPTABLE</div>
      
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div className="w-1/3">
          <h3 className="font-bold text-lg uppercase">{senderName}</h3>
          {senderAddress.map((line: string, i: number) => (
            <p key={i}>{line}</p>
          ))}
          <p className="mt-2 font-mono">{senderVat}</p>
        </div>
        <div className="w-1/3 border-2 border-slate-800 p-2">
          <p className="text-xs text-gray-500 mb-1">Client :</p>
          <h3 className="font-bold">{receiverName}</h3>
          {receiverAddress.map((line: string, i: number) => (
            <p key={i}>{line}</p>
          ))}
          <p className="mt-2 font-mono">{receiverVat}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
        <div>
           <p><strong>N° Fac :</strong> {detailsNumber}</p>
           <p><strong>Date :</strong> {detailsDate}</p>
        </div>
        <div className="text-right italic">
          {detailsPayment}
        </div>
      </div>

      {/* Lines */}
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b border-gray-400">
            <th className="text-left py-1 w-16">Qté</th>
            <th className="text-left py-1">Libellé</th>
            <th className="text-right py-1 w-20">P.U.</th>
            <th className="text-right py-1 w-24">Montant</th>
          </tr>
        </thead>
        <tbody>
          {content.lines?.map((line: any, idx: number) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-1">{line.qty}</td>
              <td className="py-1">{line.desc}</td>
              <td className="text-right py-1">{line.pu}</td>
              <td className="text-right py-1">{line.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="grid grid-cols-3 gap-2 border-t border-black pt-2 text-xs mb-2">
            <div className="font-bold">Taux</div>
            <div className="font-bold text-right">Base</div>
            <div className="font-bold text-right">TVA</div>
            {content.totals?.bases?.map((base: any, i: number) => (
              <React.Fragment key={i}>
                <div>{base.rate}</div>
                <div className="text-right">{base.base}</div>
                <div className="text-right">{base.tax}</div>
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
            <span>Total HT:</span>
            <span>{content.totals?.totalExcl}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total TVA:</span>
            <span>{content.totals?.totalVat}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t-2 border-black mt-1 pt-1 bg-yellow-50 px-1">
            <span>A PAYER:</span>
            <span>{content.totals?.toPay}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankExtractViewer: React.FC<{ content: any }> = ({ content }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 shadow-md p-4 max-w-2xl mx-auto font-mono text-sm">
      <div className="flex justify-between border-b-2 border-blue-800 mb-4 pb-2 text-blue-900">
        <h3 className="font-bold">{content.title}</h3>
        <span>Compte: {content.account}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Ancien solde au {content.prevDate}</span>
          <span>{content.prevBalance}</span>
        </div>
        
        {content.transactions?.map((tx: any, idx: number) => (
           <div key={idx} className="flex justify-between bg-white p-2 border border-blue-100 font-bold">
             <div className="flex gap-4">
               <span className="text-gray-500">{tx.date}</span>
               <span>{tx.desc}</span>
             </div>
             <div className={tx.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
               {tx.amount}
             </div>
           </div>
        ))}

        <div className="flex justify-between border-t-2 border-blue-800 pt-2 font-bold text-blue-900">
          <span>Nouveau solde au {content.newDate}</span>
          <span>{content.newBalance}</span>
        </div>
      </div>
    </div>
  );
};

const NoteViewer: React.FC<{ content: any }> = ({ content }) => {
  return (
    <div className="bg-yellow-100 border border-yellow-300 p-4 rounded shadow text-yellow-900 italic text-center mx-auto max-w-xl">
      <p className="whitespace-pre-line font-handwriting">{content.text}</p>
    </div>
  );
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  switch (document.type) {
    case 'INVOICE':
      return <InvoiceViewer content={document.content} />;
    case 'BANK_EXTRACT':
      return <BankExtractViewer content={document.content} />;
    case 'NOTE':
      return <NoteViewer content={document.content} />;
    default:
      return <div>Document non reconnu</div>;
  }
};
