// src/constants/pertesDeChargeTable.ts
// Tableau des pertes de charge (en bar) pour chaque type de tuyau et débit
// Format : [typeTuyau][débit] = perte de charge en bar (ou null si non dispo)

export type TypeTuyau = '45x20' | '70x20' | '70x40' | '110x20' | '110x40';
export type Diametre = 22 | 45 | 65 | 70 | 100 | 110;
export type Debit = 125 | 250 | 500 | 1000 | 1500 | 2000;

export const pertesDeChargeTable: Record<TypeTuyau, Partial<Record<Debit, number | null>>> = {
  '45x20': {
    250: 0.3,
    500: 1.3,
    1000: 5,
    1500: null,
    2000: null,
  },
  '70x20': {
    250: 0.05,
    500: 0.2,
    1000: 0.5,
    1500: 1.5,
    2000: 2,
  },
  '70x40': {
    250: 0.1,
    500: 0.4,
    1000: 1,
    1500: 2.5,
    2000: 4,
  },
  '110x20': {
    250: null,
    500: null,
    1000: 0.05,
    1500: 0.1,
    2000: 0.3,
  },
  '110x40': {
    250: null,
    500: 0.01,
    1000: 0.1,
    1500: 0.2,
    2000: 0.5,
  },
};

// Mapping entre le diamètre choisi et le type de tuyau du tableau
export const diametreToTypeTuyau: Record<number, TypeTuyau> = {
  22: '45x20',
  45: '45x20',
  65: '70x20',
  70: '70x20',
  100: '110x20',
  110: '110x20',
};

export const longueursDisponibles = [20, 40, 60, 80, 100];
export const debitsDisponibles: Debit[] = [125, 250, 500, 1000, 1500, 2000];
export const diametresDisponibles: Diametre[] = [22, 45, 65, 70, 100, 110];

export const longueurStandard = 20;
