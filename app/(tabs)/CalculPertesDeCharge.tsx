import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { pertesDeChargeTable as pertesDeChargeTableDefault, diametreToTypeTuyau, longueursDisponibles, debitsDisponibles, diametresDisponibles, Debit, Diametre } from '../../constants/pertesDeChargeTable';
import { usePertesDeChargeTable } from '../../context/PertesDeChargeTableContext';
import { calculerPerteDeCharge } from '../../constants/calculPerteDeCharge';

import { Colors } from '../../constants/Colors';

import { Ionicons } from '@expo/vector-icons';
import { useMemoSegments } from '../../context/MemoSegmentsContext';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../context/ThemeContext';

export default function CalculPertesDeCharge(props: { key?: string }) {
  const { theme } = useThemeContext();
  const palette = Colors[theme];
  const styles = getStyles(palette);
  const navigation = useNavigation();
  const { table: pertesDeChargeTable } = usePertesDeChargeTable();
  const [diametre, setDiametre] = useState<Diametre>(45);
  const [longueur, setLongueur] = useState(40);
  const [debit, setDebit] = useState<Debit>(500);
  const [resultat, setResultat] = useState<number | null>(null);
  const [canConserve, setCanConserve] = useState(false);
  const { segments, addSegment, removeSegment, clearSegments } = useMemoSegments();

  // Calcul et affichage du résultat
  const handleCalcul = () => {
    const res = calculerPerteDeCharge(longueur, debit, diametre);
    if (res.perteDeCharge !== null) {
      setResultat(res.perteDeCharge);
      setCanConserve(true);
    } else {
      setResultat(null);
      setCanConserve(false);
      alert(res.message || 'Erreur de calcul');
    }
  };

  // Conserver le résultat
  const handleConserver = () => {
    if (resultat !== null && canConserve) {
      addSegment({ diametre, longueur, debit, perte: resultat });
      setCanConserve(false);
    }
  };

  // Supprimer un segment mémorisé
  const handleDelete = (id: string) => {
    removeSegment(id);
  };

  // Réinitialiser tous les résultats conservés
  const handleReset = () => {
    clearSegments();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: palette.background}}>
      <View style={{zIndex:10, backgroundColor: palette.background, paddingHorizontal:0, paddingVertical:16, alignSelf: 'center'}}>
        <View style={styles.headerRow}>
          <Ionicons name="flame" size={26} color={palette.primary} style={{marginRight: 6}}/>
          <Text style={styles.title}>Calcul de pertes de charge</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{padding: 16, paddingBottom: 100, flexGrow: 1, paddingTop:0}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.section}>
        <Text style={styles.labelSection}>Diamètre du tuyau (mm) :</Text>
        <View style={styles.rowWrap}>
          {[45, 70, 110].map(val => (
            <TouchableOpacity
              key={val}
              style={[styles.paramBtn, diametre === val && styles.paramBtnSelected]}
              onPress={() => setDiametre(val as Diametre)}>
              <Text style={diametre === val ? styles.paramBtnSelectedTxt : styles.paramBtnTxt}>{val} mm</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.labelSection}>Longueur du tuyau (m) :</Text>
        <View style={styles.rowWrap}>
          {[20, 40, 60, 80, 100].map(val => (
            <TouchableOpacity
              key={val}
              style={[styles.paramBtn, longueur === val && styles.paramBtnSelected]}
              onPress={() => setLongueur(val)}>
              <Text style={longueur === val ? styles.paramBtnSelectedTxt : styles.paramBtnTxt}>{val} m</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.labelSection}>Débit (L/min) :</Text>
        <View style={styles.rowWrap}>
          {[250, 500, 1000, 1500, 2000].map(val => (
            <TouchableOpacity
              key={val}
              style={[styles.paramBtn, debit === val && styles.paramBtnSelected]}
              onPress={() => setDebit(val as Debit)}>
              <Text style={debit === val ? styles.paramBtnSelectedTxt : styles.paramBtnTxt}>{val}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.calcBtn} onPress={handleCalcul}>
          <Text style={styles.calcBtnTxt}>Calculer</Text>
        </TouchableOpacity>
      </View>
      {resultat !== null && (
        <View style={styles.resultCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View>
              <Text style={styles.resultLabel}>Perte de charge</Text>
              <Text style={styles.resultValue}>{resultat} <Text style={{fontWeight:'normal'}}>bars</Text></Text>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleConserver} disabled={!canConserve}>
              <Text style={[styles.saveBtnTxt, !canConserve && {color:'#ccc'}]}>Conserver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {segments.length > 0 && (
        <View style={styles.savedSection}>
          <Text style={styles.savedTitle}>Résultats conservés</Text>
          {segments.map((c, idx) => (
            <View key={c.id} style={styles.savedRow}>
              <Text style={styles.savedDesc}>Ø {c.diametre}mm - {c.longueur}m - {c.debit}L/min</Text>
              <Text style={styles.savedVal}>{c.perte.toFixed(2)} bars</Text>
              <TouchableOpacity onPress={() => handleDelete(c.id)}>
                <Ionicons name="trash-outline" size={20} color={palette.primary}/>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnTxt}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resetBtn, {backgroundColor:palette.primary}]} onPress={() => navigation.navigate('CalculEtablissement' as never)}>
              <Text style={[styles.resetBtnTxt, {color:'#fff'}]}>Calcul établissement</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  </SafeAreaView>
  );
}

const getStyles = (palette: typeof Colors.light) => StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
  section: {
    backgroundColor: palette.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: palette.accent,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  labelSection: {
    fontWeight: 'bold',
    fontSize: 16,
    color: palette.text,
    marginBottom: 6,
    marginTop: 10,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4
  },
  paramBtn: {
    backgroundColor: palette.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: palette.primary,
  },
  paramBtnTxt: {
    color: palette.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  paramBtnSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  paramBtnSelectedTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calcBtn: {
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 14,
    alignItems: 'center',
  },
  calcBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: palette.background,
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    shadowColor: palette.accent,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  resultLabel: {
    color: palette.text,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  resultValue: {
    fontWeight: 'bold',
    color: palette.text,
    fontSize: 18,
    marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: palette.background,
    borderColor: palette.primary,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 4,
    marginRight: 8,
  },
  saveBtnTxt: {
    color: palette.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  savedSection: {
    backgroundColor: palette.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: palette.accent,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  savedTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: palette.title,
    marginBottom: 10,
    alignSelf:'center',
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: palette.inputBackground,
  },
  savedDesc: {
    color: palette.text,
    fontSize: 14,
  },
  savedVal: {
    color: palette.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 10,
  },
  resetBtn: {
    borderColor: palette.primary,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 4,
    marginRight: 8,
    backgroundColor: palette.background,
  },
  resetBtnTxt: {
    color: palette.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: palette.primary,
    fontSize: 23,
    fontWeight: 'bold',
    marginVertical: 0,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  container: {
    backgroundColor: palette.background,
    padding: 16,
  },
});
