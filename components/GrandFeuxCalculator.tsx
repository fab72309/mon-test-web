import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Header } from '@/components/ui/Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/Colors';

const combustibleOptions = [
  { label: 'Cellulosique (1 MW/m³)', value: 1 },
  { label: 'Plastique (2,7 MW/m³)', value: 2.7 },
];

const rendementOptions = [
  { label: '20%', value: 0.2 },
  { label: '50%', value: 0.5 },
];

const rateOptions = [1, 2, 6, 10];
const surfaceRateLevels = [1, 3, 15];

// FHLI constants
const FHLI_FOAM_OPTIONS = [
  { label: 'Liquide non miscible à l’eau (10 L/min/m²)', rate: 10 },
  { label: 'Liquide miscible à l’eau (20 L/min/m²)', rate: 20 },
];
const FHLI_DURATIONS = [
  { label: 'Extinction (40 min)', value: 40 },
  { label: 'Temporisation (20 min)', value: 20 },
];
const FHLI_STRUCT_OPTIONS = [
  { label: 'Rideau d’eau 30 m (500 L/min)', length: 30, flow: 500 }, // 16.6 L/min/m
  { label: 'Rideau d’eau 40 m (1000 L/min)', length: 40, flow: 1000 }, // 25 L/min/m
];

import InfoPopup from './InfoPopup';

export default function GrandFeuxCalculator() {
  // Initial values
  const initialState = {
    mode: 'combustible' as 'combustible' | 'surface' | 'fhli',
    fhliTab: 'foam' as 'foam' | 'structure',
    fhliFoamRate: 10,
    fhliFoamDuration: 40,
    fhliFoamSurface: '',
    fhliStructOption: FHLI_STRUCT_OPTIONS[0].flow,
    fhliStructLength: '',
    combustible: 2,
    surface: '',
    hauteur: '',
    fraction: 0,
    rendement: 0.2,
    strategie: 'offensive' as 'offensive' | 'propagation',
    surfaceProt: '',
    appRate: 3,
    result: null as string | null,
    surfaceVertical: '',
    propRate: 6,
  };

  const [mode, setMode] = useState<'combustible' | 'surface' | 'fhli'>('combustible');
// FHLI states
const [fhliTab, setFhliTab] = useState<'foam'|'structure'>('foam');
const [fhliFoamRate, setFhliFoamRate] = useState(10); // valeur par défaut cohérente avec Hydrocarbures
const [fhliFoamDuration, setFhliFoamDuration] = useState(40); // valeur par défaut cohérente avec Extinction

// --- Extinction mousse (FHLI) ---
const getTauxReflexe = () => {
  if (fhliFoamRateType === 'Hydrocarbures') return 10;
  if (fhliFoamRateType === 'Liquides polaires') return 20;
  if (fhliFoamRateType === 'Taux du POI') return parseFloat(fhliFoamCustomRate) || 0;
  return 0;
};

const calcBesoinEmulseur = (debit: number, duree: number, conc: number, temporisation = false) => {
  if (!debit || !duree || !conc) return '';
  const d = temporisation ? (debit/2) : debit;
  return ((d * duree * (conc/100)) / 1000).toFixed(2);
};

const handleFhliFoamCalc = () => {
  const surf = parseFloat(fhliFoamSurface);
  const taux = getTauxReflexe();
  const conc = parseFloat(fhliFoamConc);
  const tempDur = parseFloat(fhliFoamTempDur);
  const extDur = parseFloat(fhliFoamExtDur);
  const maintDur = parseFloat(fhliFoamMaintDur);
  if (!surf || !taux || !conc || !tempDur || !extDur || !maintDur) {
    setFhliFoamDebit('');
    setBesoinEmulseurTemp('');
    setBesoinEmulseurExt('');
    setBesoinEmulseurMaint('');
    setBesoinEmulseurTotal('');
    return;
  }
  const debit = surf * taux;
  setFhliFoamDebit(debit.toFixed(0));
  const besoinTemp = calcBesoinEmulseur(debit, tempDur, conc, true);
  const besoinExt = calcBesoinEmulseur(debit, extDur, conc, false);
  const besoinMaint = calcBesoinEmulseur(debit, maintDur, conc, false);
  setBesoinEmulseurTemp(besoinTemp);
  setBesoinEmulseurExt(besoinExt);
  setBesoinEmulseurMaint(besoinMaint);
  const total = [besoinTemp, besoinExt, besoinMaint].map(Number).reduce((a,b) => a+b, 0);
  setBesoinEmulseurTotal(total.toFixed(2));
};
const [fhliFoamRateType, setFhliFoamRateType] = useState<'Hydrocarbures'|'Liquides polaires'|'Taux du POI'>('Hydrocarbures');
const [fhliFoamCustomRate, setFhliFoamCustomRate] = useState('');
const [fhliFoamConc, setFhliFoamConc] = useState('3');
const [fhliFoamTempDur, setFhliFoamTempDur] = useState('20');
const [fhliFoamExtDur, setFhliFoamExtDur] = useState('40');
const [fhliFoamMaintDur, setFhliFoamMaintDur] = useState('10');
const [fhliFoamSurface, setFhliFoamSurface] = useState('');
const [fhliStructOption, setFhliStructOption] = useState(FHLI_STRUCT_OPTIONS[0].flow);
const [fhliStructLength, setFhliStructLength] = useState('');
const [fhliFoamDebit, setFhliFoamDebit] = useState('');
const [besoinEmulseurTemp, setBesoinEmulseurTemp] = useState('');
const [besoinEmulseurExt, setBesoinEmulseurExt] = useState('');
const [besoinEmulseurMaint, setBesoinEmulseurMaint] = useState('');
const [besoinEmulseurTotal, setBesoinEmulseurTotal] = useState('');
  const [combustible, setCombustible] = useState(initialState.combustible);
  const [surface, setSurface] = useState('');
  const [hauteur, setHauteur] = useState('');
  const [fraction, setFraction] = useState(0);
  const [rendement, setRendement] = useState(0.2);
  const [strategie, setStrategie] = useState<'offensive' | 'propagation'>('offensive');
  const [surfaceProt, setSurfaceProt] = useState('');
  const [appRate, setAppRate] = useState<number>(initialState.appRate);
  const [result, setResult] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [surfaceVertical, setSurfaceVertical] = useState('');
  const [propRate, setPropRate] = useState(6);

  const handleReset = () => {
    setFhliFoamRateType('Hydrocarbures');
    setFhliFoamCustomRate('');
    setFhliFoamConc('3');
    setFhliFoamTempDur('20');
    setFhliFoamExtDur('40');
    setFhliFoamMaintDur('10');
    setFhliFoamSurface('');
    setFhliFoamDebit('');
    setBesoinEmulseurTemp('');
    setBesoinEmulseurExt('');
    setBesoinEmulseurMaint('');
    setBesoinEmulseurTotal('');
    setFhliStructOption(initialState.fhliStructOption);
    setFhliStructLength(initialState.fhliStructLength);
    setCombustible(initialState.combustible);
    setSurface(initialState.surface);
    setHauteur(initialState.hauteur);
    setFraction(initialState.fraction);
    setRendement(initialState.rendement);
    setSurfaceProt(initialState.surfaceProt);
    setAppRate(initialState.appRate);
    setSurfaceVertical(initialState.surfaceVertical);
    setPropRate(initialState.propRate);
    setResult(initialState.result);
  };

  const handleCalculate = () => {
    if (mode === 'fhli') {
      if (fhliTab === 'foam') {
        const S = parseFloat(fhliFoamSurface);
        if (!S || !fhliFoamRate || !fhliFoamDuration) {
          setResult('Veuillez remplir tous les champs.');
          return;
        }
        // Temporisation = moitié du taux d’extinction, durée 20min
        // Extinction = taux d’extinction, durée 40min
        // Mais pour le dimensionnement, on affiche le débit instantané
        const Q = S * fhliFoamRate; // L/min
        setResult(`${Q.toFixed(0)} L/min (${(Q / 1000).toFixed(2)} m³/h)`);
        return;
      } else if (fhliTab === 'structure') {
        // Protection structures: débit selon rideau d’eau
        let Q = fhliStructOption;
        // Si l’utilisateur veut un calcul personnalisé par longueur
        const L = parseFloat(fhliStructLength);
        if (fhliStructLength && !isNaN(L) && L > 0) {
          // Use the closest rate: 16.6 or 25 L/min/m
          const rate = fhliStructOption === 500 ? 16.6 : 25;
          Q = L * rate;
        }
        setResult(`${Q.toFixed(0)} L/min (${(Q / 1000).toFixed(2)} m³/h)`);
        return;
      }
    }
    if (mode === 'surface') {
      const S = parseFloat(surface);
      const rate = appRate;
      if (!S || !rate) {
        setResult('Veuillez remplir tous les champs.');
        return;
      }
      const Q = S * rate; // L/min
      setResult(`${Q.toFixed(0)} L/min (${(Q*0.06).toFixed(2)} m³/h)`);
      return;
    }
    if (strategie === 'offensive') {
      const S = parseFloat(surface);
      const H = parseFloat(hauteur);
      const frac = fraction / 100;
      if (!S || !H || !frac || !combustible || !rendement) {
        setResult('Veuillez remplir tous les champs.');
        return;
      }
      const Pmax = S * H * combustible * frac; // MW
      // Rendement des lances: 20% → 106 L/min·MW⁻¹, 50% → 42.5 L/min·MW⁻¹
      const factor = rendement === 0.2 ? 106 : 42.5;
      const Q = Pmax * factor; // L/min
      const pStr = `Puissance max estimée : ${Pmax.toFixed(2)} MW`;
      const qStr = `Débit requis : ${Q.toFixed(0)} L/min (${(Q * 0.06).toFixed(2)} m³/h)`;
      setResult(`${pStr}\n${qStr}`);
    } else {
      // Propagation
      const V = parseFloat(surfaceVertical);
      if (!V) {
        setResult('Veuillez remplir la surface verticale à défendre.');
        return;
      }
      const Qp = propRate * V; // L/min
      const pStr = `Surface défendue : ${V.toFixed(0)} m²`;
      const qStr = `Débit requis : ${Qp.toFixed(0)} L/min (${(Qp * 0.06).toFixed(2)} m³/h)`;
      setResult(`${pStr}\n${qStr}`);
    }
  };

  return (
  <>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>Dimensionnement des moyens hydrauliques</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, mode === 'combustible' && styles.tabActive]} onPress={() => setMode('combustible')}>
              <MaterialCommunityIcons name="fire" size={16} color={mode === 'combustible' ? '#fff' : '#111'} style={{ marginRight: 4 }} />
              <Text style={[styles.tabText, mode === 'combustible' && styles.tabTextActive]}>Puissance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, mode === 'surface' && styles.tabActive]} onPress={() => setMode('surface')}>
              <MaterialCommunityIcons name="vector-square" size={16} color={mode === 'surface' ? '#fff' : '#111'} style={{ marginRight: 4 }} />
              <Text style={[styles.tabText, mode === 'surface' && styles.tabTextActive]}>Surface</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, mode === 'fhli' && styles.tabActive]} onPress={() => setMode('fhli')}>
              <MaterialCommunityIcons name="gas-station" size={16} color={mode === 'fhli' ? '#fff' : '#111'} style={{ marginRight: 4 }} />
<Text style={[styles.tabText, mode === 'fhli' && styles.tabTextActive]}>FHLI</Text>
            </TouchableOpacity>
          </View>
          {mode === 'combustible' && (
            <>
              <View style={styles.selectRow}>
                <TouchableOpacity style={[styles.button, strategie === 'offensive' && styles.selectedButton]} onPress={() => setStrategie('offensive')}>
                  <MaterialCommunityIcons name="fire-truck" size={16} color={strategie === 'offensive' ? '#fff' : '#111'} style={{ marginRight: 4 }} />
                  <Text style={[styles.buttonText, strategie === 'offensive' && styles.buttonTextSelected]}>Attaque offensive</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, strategie === 'propagation' && styles.selectedButton]} onPress={() => setStrategie('propagation')}>
                  <MaterialCommunityIcons name="shield" size={16} color={strategie === 'propagation' ? '#fff' : '#111'} style={{ marginRight: 4 }} />
                  <Text style={[styles.buttonText, strategie === 'propagation' && styles.buttonTextSelected]}>Lutte propagation</Text>
                </TouchableOpacity>
              </View>
              {strategie === 'offensive' && (
                <>
                  <Text style={styles.label}>Surface (m²)</Text>
                  <TextInput style={styles.input} value={surface} onChangeText={setSurface} keyboardType="numeric" placeholder="Surface en m²" />
                  <Text style={styles.label}>Hauteur (m)</Text>
                  <TextInput style={styles.input} value={hauteur} onChangeText={setHauteur} keyboardType="numeric" placeholder="Hauteur en m" />
                  <Text style={styles.label}>Fraction impliquée (%)</Text>
                  <Slider
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={fraction}
                    onValueChange={setFraction}
                    style={{ marginVertical: 6 }}
                  />
                  <Text style={{ textAlign: 'center', marginBottom: 6 }}>{fraction} %</Text>
                  <Text style={styles.label}>Combustible</Text>
                  <View style={styles.selectRow}>
                    {combustibleOptions.map(opt => (
                      <TouchableOpacity key={opt.label} style={[styles.button, combustible === opt.value && styles.selectedButton]} onPress={() => setCombustible(opt.value)}>
                        <Text style={[styles.buttonText, combustible === opt.value && styles.buttonTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.label}>Rendement</Text>
                  <View style={styles.selectRow}>
                    {rendementOptions.map(opt => (
                      <TouchableOpacity key={opt.label} style={[styles.button, rendement === opt.value && styles.selectedButton]} onPress={() => setRendement(opt.value)}>
                        <Text style={[styles.buttonText, rendement === opt.value && styles.buttonTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.button} onPress={handleCalculate}>
                    <Text style={styles.buttonText}>Calculer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { backgroundColor: '#eee' }]} onPress={handleReset}>
                    <Text style={styles.buttonText}>Réinitialiser</Text>
                  </TouchableOpacity>
                  {result && (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultTitle}>Résultat</Text>
                      <Text style={styles.resultText}>{result}</Text>
                    </View>
                  )}
                </>
              )}
              {strategie === 'propagation' && (
                <>
                  <Text style={styles.label}>Surface verticale (m²)</Text>
                  <TextInput style={styles.input} value={surfaceVertical} onChangeText={setSurfaceVertical} keyboardType="numeric" placeholder="Surface en m²" />
                  <TouchableOpacity style={styles.button} onPress={handleCalculate}>
                    <Text style={styles.buttonText}>Calculer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { backgroundColor: '#eee' }]} onPress={handleReset}>
                    <Text style={styles.buttonText}>Réinitialiser</Text>
                  </TouchableOpacity>
                  {result && (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultTitle}>Résultat</Text>
                      <Text style={styles.resultText}>{result}</Text>
                    </View>
                  )}
                </>
              )}
          )}
          {mode === 'surface' && (
            <>
              <Text style={styles.label}>Surface (m²)</Text>
              <TextInput style={styles.input} value={surface} onChangeText={setSurface} keyboardType="numeric" placeholder="Surface en m²" />
              <Text style={styles.label}>Débit d’application (L/min/m²)</Text>
              <View style={styles.selectRow}>
                {rateOptions.map(opt => (
                  <TouchableOpacity key={opt} style={[styles.button, appRate === opt && styles.selectedButton]} onPress={() => setAppRate(opt)}>
                    <Text style={[styles.buttonText, appRate === opt && styles.buttonTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={handleCalculate}>
                <Text style={styles.buttonText}>Calculer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#eee' }]} onPress={handleReset}>
                <Text style={styles.buttonText}>Réinitialiser</Text>
              </TouchableOpacity>
              {result && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultTitle}>Résultat</Text>
                  <Text style={styles.resultText}>{result}</Text>
                </View>
              )}
            </>
          )}
          {mode === 'fhli' && (
            <>
              <View style={styles.selectRow}>
                <TouchableOpacity style={[styles.button, fhliTab === 'foam' && styles.selectedButton]} onPress={() => setFhliTab('foam')}>
                  <Text style={[styles.buttonText, fhliTab === 'foam' && styles.buttonTextSelected]}>Extinction mousse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, fhliTab === 'structure' && styles.selectedButton]} onPress={() => setFhliTab('structure')}>
                  <Text style={[styles.buttonText, fhliTab === 'structure' && styles.buttonTextSelected]}>Protection structure</Text>
                </TouchableOpacity>
              </View>
              {fhliTab === 'foam' && (
                <>
                  <Text style={styles.label}>Surface à protéger (m²)</Text>
                  <TextInput style={styles.input} value={fhliFoamSurface} onChangeText={setFhliFoamSurface} keyboardType="numeric" placeholder="Surface en m²" />
                  <Text style={styles.label}>Taux d’application</Text>
                  <View style={styles.selectRow}>
                    <TouchableOpacity style={[styles.button, fhliFoamRateType === 'Hydrocarbures' && styles.selectedButton]} onPress={() => setFhliFoamRateType('Hydrocarbures')}>
                      <Text style={[styles.buttonText, fhliFoamRateType === 'Hydrocarbures' && styles.buttonTextSelected]}>Hydrocarbures</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, fhliFoamRateType === 'Liquides polaires' && styles.selectedButton]} onPress={() => setFhliFoamRateType('Liquides polaires')}>
                      <Text style={[styles.buttonText, fhliFoamRateType === 'Liquides polaires' && styles.buttonTextSelected]}>Polaires</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, fhliFoamRateType === 'Taux du POI' && styles.selectedButton]} onPress={() => setFhliFoamRateType('Taux du POI')}>
                      <Text style={[styles.buttonText, fhliFoamRateType === 'Taux du POI' && styles.buttonTextSelected]}>Taux du POI</Text>
                    </TouchableOpacity>
                  </View>
                  {fhliFoamRateType === 'Taux du POI' && (
                    <TextInput style={styles.input} value={fhliFoamCustomRate} onChangeText={setFhliFoamCustomRate} keyboardType="numeric" placeholder="Taux personnalisé (L/min/m²)" />
                  )}
                  <Text style={styles.label}>Concentration (%)</Text>
                  <TextInput style={styles.input} value={fhliFoamConc} onChangeText={setFhliFoamConc} keyboardType="numeric" placeholder="Concentration (%)" />
                  <Text style={styles.label}>Durée de temporisation (min)</Text>
                  <TextInput style={styles.input} value={fhliFoamTempDur} onChangeText={setFhliFoamTempDur} keyboardType="numeric" placeholder="20" />
                  <Text style={styles.label}>Durée d’extinction (min)</Text>
                  <TextInput style={styles.input} value={fhliFoamExtDur} onChangeText={setFhliFoamExtDur} keyboardType="numeric" placeholder="40" />
                  <Text style={styles.label}>Durée de maintien (min)</Text>
                  <TextInput style={styles.input} value={fhliFoamMaintDur} onChangeText={setFhliFoamMaintDur} keyboardType="numeric" placeholder="10" />
                  <TouchableOpacity style={styles.button} onPress={handleFhliFoamCalc}>
                    <Text style={styles.buttonText}>Calculer mousse</Text>
                  </TouchableOpacity>
                  {fhliFoamDebit && (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultTitle}>Débit instantané</Text>
                      <Text style={styles.resultText}>{fhliFoamDebit} L/min</Text>
                    </View>
                  )}
                  {besoinEmulseurTotal && (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultTitle}>Besoin total émulseur</Text>
                      <Text style={styles.resultText}>{besoinEmulseurTotal} m³</Text>
                    </View>
                  )}
                </>
              )}
              {fhliTab === 'structure' && (
                <>
                  <Text style={styles.label}>Débit du rideau d’eau</Text>
                  <View style={styles.selectRow}>
                    {FHLI_STRUCT_OPTIONS.map(opt => (
                      <TouchableOpacity key={opt.label} style={[styles.button, fhliStructOption === opt.flow && styles.selectedButton]} onPress={() => setFhliStructOption(opt.flow)}>
                        <Text style={[styles.buttonText, fhliStructOption === opt.flow && styles.buttonTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.label}>Longueur (m)</Text>
                  <TextInput style={styles.input} value={fhliStructLength} onChangeText={setFhliStructLength} keyboardType="numeric" placeholder="Longueur à protéger" />
                  <TouchableOpacity style={styles.button} onPress={handleCalculate}>
                    <Text style={styles.buttonText}>Calculer rideau</Text>
                  </TouchableOpacity>
                  {result && (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultTitle}>Résultat</Text>
                      <Text style={styles.resultText}>{result}</Text>
                    </View>
                  )}
                </>
              )}
              <TouchableOpacity style={[styles.button, { backgroundColor: '#eee', marginTop: 10 }]} onPress={handleReset}>
                <Text style={styles.buttonText}>Réinitialiser</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </>);


}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    flexWrap: 'nowrap',
    color: Colors.light.primary,
  },
  tabContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 6 
  },
  tab: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 6, 
    paddingHorizontal: 16, 
    marginHorizontal: 4, 
    backgroundColor: '#e5e7eb', 
    borderRadius: 20 
  },
  tabActive: { 
    backgroundColor: '#D32F2F' 
  },
  tabText: { 
    color: '#111', 
    fontWeight: '500' 
  },
  tabTextActive: { 
    color: '#fff', 
    fontWeight: '500' 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 4,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#111',
    fontWeight: '500',
  },
  buttonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  resultText: {
    fontSize: 16,
    color: '#334155',
  },
});
