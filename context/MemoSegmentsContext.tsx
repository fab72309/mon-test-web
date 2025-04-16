import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MemoSegment = {
  id: string; // unique id for each segment
  diametre: number;
  longueur: number;
  debit: number;
  perte: number;
};

interface MemoSegmentsContextType {
  segments: MemoSegment[];
  addSegment: (segment: Omit<MemoSegment, 'id'>) => void;
  updateSegment: (id: string, segment: Omit<MemoSegment, 'id'>) => void;
  removeSegment: (id: string) => void;
  clearSegments: () => void;
}

const MemoSegmentsContext = createContext<MemoSegmentsContextType | undefined>(undefined);

export const MemoSegmentsProvider = ({ children }: { children: ReactNode }) => {
  const [segments, setSegments] = useState<MemoSegment[]>([]);

  const addSegment = (segment: Omit<MemoSegment, 'id'>) => {
    setSegments(prev => {
      // Prevent duplicate (same diametre, longueur, debit)
      if (prev.some(s => s.diametre === segment.diametre && s.longueur === segment.longueur && s.debit === segment.debit)) {
        return prev;
      }
      return [{ ...segment, id: `${segment.diametre}-${segment.longueur}-${segment.debit}` }, ...prev];
    });
  };

  const updateSegment = (id: string, segment: Omit<MemoSegment, 'id'>) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...segment, id } : s));
  };

  const removeSegment = (id: string) => {
    setSegments(prev => prev.filter(s => s.id !== id));
  };

  const clearSegments = () => setSegments([]);

  return (
    <MemoSegmentsContext.Provider value={{ segments, addSegment, updateSegment, removeSegment, clearSegments }}>
      {children}
    </MemoSegmentsContext.Provider>
  );
};

export const useMemoSegments = () => {
  const ctx = useContext(MemoSegmentsContext);
  if (!ctx) throw new Error('useMemoSegments must be used within a MemoSegmentsProvider');
  return ctx;
};
