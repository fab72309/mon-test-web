// constants/calculPerteDeCharge.ts
import { pertesDeChargeTable, diametreToTypeTuyau, longueurStandard, Debit, Diametre } from './pertesDeChargeTable';

export type CalculResult = {
  perteDeCharge: number | null;
  message?: string;
};

/**
 * Calcule la perte de charge selon les paramètres fournis.
 * @param longueur Longueur de l'établissement (en m)
 * @param debit Débit sélectionné (L/min)
 * @param diametre Diamètre sélectionné (mm)
 * @returns Résultat du calcul ou message d'erreur
 */
export function calculerPerteDeCharge(
  longueur: number,
  debit: Debit,
  diametre: Diametre
): CalculResult {
  const typeTuyau = diametreToTypeTuyau[diametre];
  const table = pertesDeChargeTable[typeTuyau];
  if (!table) {
    return {
      perteDeCharge: null,
      message: "Type de tuyau non disponible pour ce diamètre."
    };
  }
  const valeurTableau = table[debit];

  if (valeurTableau === undefined) {
    return {
      perteDeCharge: null,
      message: "Débit non disponible pour ce type de tuyau."
    };
  }
  if (valeurTableau === null) {
    return {
      perteDeCharge: null,
      message: "Calcul non disponible pour cette configuration."
    };
  }

  // Calcul selon la longueur
  const perte = valeurTableau * (longueur / longueurStandard);
  return {
    perteDeCharge: Math.round(perte * 100) / 100 // arrondi à 2 décimales
  };
}
