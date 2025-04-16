import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pertesDeChargeTable as defaultTable } from '../constants/pertesDeChargeTable';

const STORAGE_KEY = 'pertesDeChargePerso';

export type PertesDeChargeTableType = typeof defaultTable;

interface PertesDeChargeTableContextProps {
  table: PertesDeChargeTableType;
  setTable: (t: PertesDeChargeTableType) => void;
  resetTable: () => void;
  loading: boolean;
}

const PertesDeChargeTableContext = createContext<PertesDeChargeTableContextProps | undefined>(undefined);

export const usePertesDeChargeTable = () => {
  const ctx = useContext(PertesDeChargeTableContext);
  if (!ctx) throw new Error('usePertesDeChargeTable must be used within a PertesDeChargeTableProvider');
  return ctx;
};

export const PertesDeChargeTableProvider = ({ children }: { children: ReactNode }) => {
  const [table, setTableState] = useState<PertesDeChargeTableType>(defaultTable);
  const [loading, setLoading] = useState(true);

  // Charger depuis AsyncStorage au montage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTableState(JSON.parse(saved));
      } else {
        // Copie la table officielle dans le stockage personnalisé dès la première ouverture
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTable));
        setTableState(defaultTable);
      }
      setLoading(false);
    })();
  }, []);

  // Setter qui sauvegarde aussi
  const setTable = (t: PertesDeChargeTableType) => {
    setTableState(t);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  };

  const resetTable = () => {
    setTableState(defaultTable);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTable));
  };

  return (
    <PertesDeChargeTableContext.Provider value={{ table, setTable, resetTable, loading }}>
      {children}
    </PertesDeChargeTableContext.Provider>
  );
};
