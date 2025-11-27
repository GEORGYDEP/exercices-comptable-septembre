export enum JournalType {
  ACHAT = 'ACHAT',
  VENTE = 'VENTE',
  CAISSE = 'CAISSE',
  FINANCIER = 'FINANCIER',
  OD = 'OD'
}

export interface JournalRow {
  id: string;
  accountNumber: string;
  declTva: string;
  codePopsy: string;
  label: string;
  debit: string;
  credit: string;
}

export interface JournalData {
  type: JournalType;
  title: string;
  date: string;
  rows: JournalRow[];
}

export interface DocumentItem {
  type: 'INVOICE' | 'BANK_EXTRACT' | 'NOTE';
  title: string;
  content: any; // Flexible content structure for rendering different doc types
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  documents: DocumentItem[];
  requiredJournals: {
    type: JournalType;
    defaultDate: string;
    solution: JournalRow[];
  }[];
}