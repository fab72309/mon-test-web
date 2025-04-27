import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import PropagationButtons from './GrandFeuxCalculator_buttons_propagation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/Colors';
import InfoPopup from './InfoPopup';

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
const FHLI_FOAM_OPTIONS = [
  { label: 'Liquide non miscible à l’eau (10 L/min/m²)', rate: 10 },
  { label: 'Liquide miscible à l’eau (20 L/min/m²)', rate: 20 },
];
const FHLI_DURATIONS = [
  { label: 'Extinction (40 min)', value: 40 },
  { label: 'Temporisation (20 min)', value: 20 },
];
const FHLI_STRUCT_OPTIONS = [
  { label: 'Rideau d’eau 30 m (500 L/min)', length: 30, flow: 500 },
  { label: 'Rideau d’eau 40 m (1000 L/min)', length: 40, flow: 1000 },
];

function GrandFeuxCalculator({ hideTitle = false }: { hideTitle?: boolean }) {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showInfoPopupPropagation, setShowInfoPopupPropagation] = useState(false);
  // Fonction de réinitialisation
  const handleReset = () => {
    setSurface('');
    setHauteur('');
    setFraction(0);
    setCombustible(2);
    setRendement(0.2);
    setSurfaceVertical('');
    setResultPropagation(null);
    setCalcDetailsPropagation(null);
    setResultOffensive(null);
    setCalcDetailsOffensive(null);
  }
  // États
  const [mode, setMode] = useState<'combustible'|'surface'|'fhli'>('combustible');
  const [strategie, setStrategie] = useState<'offensive'|'propagation'>('offensive');
  const [surface, setSurface] = useState(''); // Pour l'approche Puissance
const [surfaceApprocheSurface, setSurfaceApprocheSurface] = useState(''); // Pour l'approche Surface
  const [hauteur, setHauteur] = useState('');
  const [fraction, setFraction] = useState(0);
  const [combustible, setCombustible] = useState(2);
  const [rendement, setRendement] = useState(0.2);
  const [surfaceVertical, setSurfaceVertical] = useState('');
  const [tauxApplication, setTauxApplication] = useState(6); // valeur par défaut 6 L/min/m²
  const [showResultPropagation, setShowResultPropagation] = useState(false);
  const [showResultOffensive, setShowResultOffensive] = useState(false);
  const [resultPropagation, setResultPropagation] = useState<string|null>(null);
  const [calcDetailsPropagation, setCalcDetailsPropagation] = useState<string|null>(null);
  const [resultOffensive, setResultOffensive] = useState<string|null>(null);
  const [calcDetailsOffensive, setCalcDetailsOffensive] = useState<string|null>(null);
  const [fhliTab, setFhliTab] = useState<'foam'|'structure'>('foam');
  const [fhliFoamSurface, setFhliFoamSurface] = useState('');
  const [fhliFoamRateType, setFhliFoamRateType] = useState<'Hydrocarbures'|'Liquides polaires'|'Taux du POI'>('Hydrocarbures');
  const [fhliFoamCustomRate, setFhliFoamCustomRate] = useState('');
  const [fhliFoamConc, setFhliFoamConc] = useState('3');
  const [fhliFoamTempDur, setFhliFoamTempDur] = useState('20');
  const [fhliFoamExtDur, setFhliFoamExtDur] = useState('40');
  const [fhliFoamMaintDur, setFhliFoamMaintDur] = useState('10');
  const [fhliFoamDebit, setFhliFoamDebit] = useState('');
  const [besoinEmulseurTotal, setBesoinEmulseurTotal] = useState('');
  const [fhliStructOption, setFhliStructOption] = useState(FHLI_STRUCT_OPTIONS[0].flow);
  const [fhliStructLength, setFhliStructLength] = useState('');

  // Handlers
  const handleCalculate = () => {
    if (strategie === 'propagation') setShowResultPropagation(true);
    if (strategie === 'offensive') setShowResultOffensive(true);

    if (mode === 'combustible') {
      if (strategie === 'propagation') {
        // Débit = Surface verticale à protéger (m2) x Taux d'application
        const surfVert = parseFloat(surfaceVertical);
        const taux = parseFloat(String(tauxApplication));
        if (isNaN(surfVert) || isNaN(taux)) return;
        const debit = surfVert * taux;
        const res = debit.toFixed(2);
        setResultPropagation(res);
        setCalcDetailsPropagation(`${surfVert} m² × ${taux} L/min/m² = ${res} L/min`);
        setResultOffensive(null);
        setCalcDetailsOffensive(null);
      } else if (strategie === 'offensive') {
        const surf = parseFloat(surface);
        const haut = parseFloat(hauteur);
        if (isNaN(surf)||isNaN(haut)) return;
        const pmax = surf * haut * combustible * (fraction/100);
        let multiplier = rendement === 0.5 ? 42.5 : 106;
        const qLmin = pmax * multiplier;
        const qLminStr = qLmin.toFixed(0);
        const qm3h = qLmin / 16.67;
        const qm3hStr = qm3h.toFixed(2);
        setResultOffensive(`${qLminStr} L/min (${qm3hStr} m³/h)`);
        setCalcDetailsOffensive(`Pmax = ${surf} m² × ${haut} m × ${combustible} MW/m³ × (${fraction}/100) = ${pmax.toFixed(2)} MW\nDébit requis : ${pmax.toFixed(2)} MW × ${multiplier} L/min/MW = ${qLminStr} L/min\nSoit ${qm3hStr} m³/h`);
        setResultPropagation(null);
        setCalcDetailsPropagation(null);
      }
    } else if (mode === 'surface') {
      // à adapter si besoin
      setResultPropagation(null);
      setCalcDetailsPropagation(null);
      setResultOffensive(null);
      setCalcDetailsOffensive(null);
    } else {
      setResultPropagation(null);
      setCalcDetailsPropagation(null);
      setResultOffensive(null);
      setCalcDetailsOffensive(null);
    }
  };
  const getTauxReflexe = () => {
    if (fhliFoamRateType === 'Hydrocarbures') return 10;
    if (fhliFoamRateType === 'Liquides polaires') return 20;
    return parseFloat(fhliFoamCustomRate)||0;
  };
  const calcBesoinEmulseur = (debit:number, duree:number, conc:number, tmp=false) => {
    if(!debit||!duree||!conc) return '';
    const d = tmp?debit/2:debit;
    return ((d*duree*(conc/100))/1000).toFixed(2);
  };
  const handleFhliFoamCalc = () => {
    const surf = parseFloat(fhliFoamSurface);
    const taux = getTauxReflexe();
    const conc = parseFloat(fhliFoamConc);
    const tmp = parseFloat(fhliFoamTempDur);
    const ext = parseFloat(fhliFoamExtDur);
    const maint = parseFloat(fhliFoamMaintDur);
    if(!surf||!taux||!conc||!tmp||!ext||!maint) { setFhliFoamDebit(''); setBesoinEmulseurTotal(''); return; }
    const debit = surf * taux;
    const total = [calcBesoinEmulseur(debit,tmp,conc,true), calcBesoinEmulseur(debit,ext,conc), calcBesoinEmulseur(debit,maint,conc)].map(Number).reduce((a,b)=>a+b,0).toFixed(2);
    setFhliFoamDebit(debit.toFixed(0));
    setBesoinEmulseurTotal(total);
  };

  // Styles avant return
  const styles = StyleSheet.create({
  resultBlock: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginTop: 22,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#f1f1f1',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width:0, height:2},
    elevation: 2,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  resultHeader: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  resultLine: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  resultLabel: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 17,
  },
  resultDetail: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 2,
  },
  warningBox: {
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  warningText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'left',
  },
    container:{flexGrow:1,backgroundColor:'#f8fafc',paddingBottom:30},
    card:{backgroundColor:'#fff',borderRadius:18,padding:18,margin:10,shadowColor:'#000',shadowOpacity:0.06,shadowRadius:8,shadowOffset:{width:0,height:2},elevation:2},
    title:{fontSize:14,fontWeight:'bold',textAlign:'center',marginVertical:8,color:Colors.light.primary},
    tabContainer:{flexDirection:'row',justifyContent:'center',marginVertical:6},
    tab:{flexDirection:'row',alignItems:'center',paddingVertical:6,paddingHorizontal:16,marginHorizontal:4,backgroundColor:'#e5e7eb',borderRadius:20},
    tabActive:{backgroundColor:'#D32F2F'},
    tabText:{color:'#111',fontWeight:'500'},
    tabTextActive:{color:'#fff',fontWeight:'500'},
    strategieTitle:{fontWeight:'bold',color:'#111',fontSize:16,marginTop:10,marginBottom:6},
    label:{fontWeight:'bold',color:'#D32F2F',marginBottom:4,fontSize:15},
    input:{borderWidth:1,borderColor:'#d1d5db',borderRadius:10,padding:10,marginBottom:8,backgroundColor:'#fff',fontSize:13,fontWeight:'500'},
    selectRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:4},
    button:{backgroundColor:'#e5e7eb',borderRadius:20,paddingVertical:8,paddingHorizontal:14,marginHorizontal:4},
    selectedButton:{backgroundColor:'#D32F2F'},
    buttonText:{color:'#111',fontWeight:'500'},buttonTextSelected:{color:'#fff',fontWeight:'500'},
    combustibleSliderBox:{marginTop:14,marginBottom:10,alignItems:'center',width:'100%',maxWidth:400,alignSelf:'center'},
    combustibleValue:{color:'#D32F2F',fontWeight:'bold',fontSize:20,marginVertical:2},
    combustibleSliderLabels:{flexDirection:'row',justifyContent:'space-between',width:'100%',marginBottom:2},
    combustibleSliderLabelTouch:{flex:1,alignItems:'center',justifyContent:'center',minWidth:60},
    combustibleSliderLabel:{color:'#D32F2F',fontSize:15,textAlign:'center'},
    combustibleSliderLabelActive:{fontWeight:'bold',textDecorationLine:'underline'},
    resultBox:{marginTop:20,backgroundColor:'#f1f5f9',borderRadius:10,padding:16,alignItems:'center'},
    resultText:{fontSize:16,color:'#334155'},resultTitle:{fontSize:17,fontWeight:'bold',marginBottom:6}
  });

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={{flex:1}}>

    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        {/* Titre */}
        {!hideTitle && (
          <Text style={styles.title} numberOfLines={1}>Dimensionnement des moyens hydrauliques</Text>
        )}
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab,mode==='combustible'&&styles.tabActive]} onPress={()=>setMode('combustible')}>
            <MaterialCommunityIcons name="fire" size={16} color={mode==='combustible'?'#fff':'#111'} style={{marginRight:4}}/>
            <Text style={[styles.tabText,mode==='combustible'&&styles.tabTextActive]}>Puissance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab,mode==='surface'&&styles.tabActive]} onPress={()=>setMode('surface')}>
            <MaterialCommunityIcons name="vector-square" size={16} color={mode==='surface'?'#fff':'#111'} style={{marginRight:4}}/>
            <Text style={[styles.tabText,mode==='surface'&&styles.tabTextActive]}>Surface</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab,mode === 'fhli' && styles.tabActive]} onPress={()=>setMode('fhli')}>
            <MaterialCommunityIcons name="gas-station" size={16} color={mode==='fhli'?'#fff':'#111'} style={{marginRight:4}}/>
            <Text style={[styles.tabText,mode === 'fhli' && styles.tabTextActive]}>FHLI</Text>
          </TouchableOpacity>
        </View>

        <View>
          {/* Combustible */}
          {mode === 'combustible' && (
            <View>
              <Text style={styles.strategieTitle}>Stratégie</Text>
              <View style={styles.selectRow}>
                <TouchableOpacity style={[styles.button,strategie==='offensive'&&styles.selectedButton]} onPress={()=>setStrategie('offensive')}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <MaterialCommunityIcons name="fire-truck" size={16} color={strategie==='offensive'?'#fff':'#111'} style={{marginRight:4}}/>
                    <Text style={[styles.buttonText,strategie==='offensive'&&styles.buttonTextSelected]}>Attaque offensive</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,strategie==='propagation'&&styles.selectedButton]} onPress={()=>setStrategie('propagation')}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <MaterialCommunityIcons name="shield" size={16} color={strategie==='propagation'?'#fff':'#111'} style={{marginRight:4}}/>
                    <Text style={[styles.buttonText,strategie==='propagation'&&styles.buttonTextSelected]}>Lutte propagation</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {strategie === 'propagation' && (
  <View>
    <Text style={{fontWeight:'bold', color:'#111', marginTop:12, marginBottom:4}}>Surface verticale à protéger (m²)</Text>
    <TextInput
      style={styles.input}
      value={surfaceVertical}
      onChangeText={setSurfaceVertical}
      keyboardType="numeric"
      placeholder="Surface verticale en m²"
    />
    <Text style={{fontWeight:'bold', color:'#111', marginTop:16, marginBottom:4}}>Taux d'application (L/min/m²)</Text>
    <Text style={{fontWeight:'bold', color:'#D32F2F', fontSize:18, textAlign:'center', marginBottom:2}}>{tauxApplication} L/min/m²</Text>
    <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
      <Slider
        style={{flex:1}}
        minimumValue={1}
        maximumValue={20}
        step={1}
        value={tauxApplication}
        onValueChange={setTauxApplication}
        minimumTrackTintColor="#D32F2F"
        maximumTrackTintColor="#eee"
        thumbTintColor="#D32F2F"
      />
    </View>
    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:2}}>
      <TouchableOpacity onPress={()=>setTauxApplication(1)}>
        <Text style={{color:tauxApplication===1?'#D32F2F':'#888', fontWeight:tauxApplication===1?'bold':'normal'}}>1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>setTauxApplication(6)}>
        <Text style={{color:tauxApplication===6?'#D32F2F':'#888', fontWeight:tauxApplication===6?'bold':'normal'}}>6</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>setTauxApplication(20)}>
        <Text style={{color:tauxApplication===20?'#D32F2F':'#888', fontWeight:tauxApplication===20?'bold':'normal'}}>20</Text>
      </TouchableOpacity>
    </View>
    <View style={{alignItems:'center', marginTop:14}}>
      <PropagationButtons onReset={handleReset} onCalculate={handleCalculate} />
      {/* Résultat sous les boutons */}
      {resultPropagation && (
  <View style={styles.resultBlock}>
  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:10}}>
    <Text style={{
      color: '#D32F2F', // Rouge pompier
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
      flexShrink: 0
    }}>Résultat</Text>
    <TouchableOpacity
      onPress={() => setShowInfoPopupPropagation(true)}
      style={{marginLeft: 8, backgroundColor:'#f1f1f1', borderRadius: 12, paddingHorizontal:6, paddingVertical:2, borderWidth:1, borderColor:'#ccc', alignSelf:'center'}}
      accessibilityLabel="Informations sur le calcul propagation"
    >
      <Text style={{fontStyle:'italic', color:'#D32F2F', fontSize:17, fontWeight:'bold'}}>i</Text>
    </TouchableOpacity>
  </View>
  {/* Affichage du débit requis en L/min et m³/h */}
  {(() => {
    const debitLmin = parseFloat(resultPropagation);
    const debitM3h = debitLmin / 16.67;
    return (
      <Text style={[styles.resultText, {fontWeight:'bold', fontSize:17}]}>Débit requis : {debitLmin.toFixed(0)} L/min ({debitM3h.toFixed(2)} m³/h)</Text>
    );
  })()}
  <InfoPopup
    visible={showInfoPopupPropagation}
    onClose={() => setShowInfoPopupPropagation(false)}
    customText={`• Calcul du débit total :\nQ = Surface verticale à protéger (m²) x Taux d'application (L/min/m²) .\nEx. 120 m² × 6 L/min/m² = 720 L/min (43,2 m³/h).\nSélectionnez un taux adapté à votre situation opérationnelle.\n  • 1–3 L/min/m² pour des risques faibles ou peu exposés au rayonnement.\n  • 10–20 L/min/m² pour des parois très exposées ou proches de liquides inflammables.\n\n• Objectif\nGagner du temps pour :\n  1. Protéger une façade / un mur coupe‑feu,\n  2. Empêcher la propagation vers d’autres cellules ou bâtiments,\n  3. Attendre les renforts ou l’arrivée de moyens d’attaque grande puissance.`}
  />
      onClose={() => setShowInfoPopupPropagation(false)}
      customText={`Calcul du débit total\u202F:\nQ = Surface à protéger (m²) x Taux d'application (L/min/m²).\nEx.\u202F120\u202Fm² ×\u202F6\u202FL/min/m²\u202F=\u202F720\u202FL/min (43,2\u202Fm³/h).\nSélectionnez un taux adapté à votre situation opérationnelle\u202F:\n\u2022\u202F1–3\u202FL/min/m² pour des risques faibles ou peu exposé au rayonnement.\n\u2022\u202F10–20\u202FL/min/m² pour des parois très exposées ou proches de liquides inflammables.\n\nObjectif\nGagner du temps\u202Fpour\u202F:\n\u2022\u202FStabiliser la façade / le mur coupe‑feu,\n\u2022\u202FPrévenir la propagation vers d’autres cellules ou bâtiments,\n\u2022\u202FAttendre le renfort ou l’arrivée de moyens d’attaque offensifs.`}
    />
  </View>
)}
    </View>
  </View>
)}

{strategie === 'offensive' && (
                <View>
                  {/* Puissance par m³ de combustible */}
                  <Text style={{fontWeight:'bold', color:'#111'}}>Puissance par m³ de combustible</Text>
                  <View style={styles.combustibleSliderBox}>
                    <Text style={styles.combustibleValue}>{combustible.toFixed(2)} MW/m³</Text>
                    <Slider
                      minimumValue={1}
                      maximumValue={2.7}
                      step={0.01}
                      value={combustible}
                      onValueChange={setCombustible}
                      minimumTrackTintColor="#D32F2F"
                      maximumTrackTintColor="#eee"
                      thumbTintColor="#D32F2F"
                      style={{marginVertical:6,width:'100%'}}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                      {[1, 2, 2.7].map(val=>(
                        <TouchableOpacity key={val} style={styles.combustibleSliderLabelTouch} onPress={()=>setCombustible(val)}>
                          <Text style={[
                            styles.combustibleSliderLabel,
                            { color: '#D32F2F', textDecorationLine: combustible >= val - 0.01 && combustible <= val + 0.01 ? 'underline' : 'none', fontWeight: combustible >= val - 0.01 && combustible <= val + 0.01 ? 'bold' : 'normal', textAlign: 'center' }
                          ]}>{val}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  {/* Surface */}
                  <Text style={{fontWeight:'bold', color:'#111'}}>Surface (m²)</Text>
                  <TextInput style={styles.input} value={surface} onChangeText={setSurface} keyboardType="numeric" placeholder="Surface en m²"/>
                  <Text style={{fontWeight:'bold', color:'#111'}}>Hauteur (m)</Text>
                  <TextInput style={styles.input} value={hauteur} onChangeText={setHauteur} keyboardType="numeric" placeholder="Hauteur en m"/>
                  {/* Slider FRACTION */}
                  <Text style={{fontWeight:'bold', color:'#111'}}>Volume en feu (%)</Text>
                  <View style={styles.combustibleSliderBox}>
                    <Text style={styles.combustibleValue}>{fraction}%</Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={fraction}
                      onValueChange={setFraction}
                      minimumTrackTintColor="#D32F2F"
                      maximumTrackTintColor="#eee"
                      thumbTintColor="#D32F2F"
                      style={{marginVertical:6,width:'100%'}}
                    />
                    <View style={styles.combustibleSliderLabels}>
                      {[0,25,50,75,100].map(val=>(
                        <TouchableOpacity key={val} style={styles.combustibleSliderLabelTouch} onPress={()=>setFraction(val)}>
                          <Text style={[
                            styles.combustibleSliderLabel, fraction===val && styles.combustibleSliderLabelActive
                          ]}>{val}%</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <Text style={{fontWeight:'bold', color:'#111'}}>Rendement des lances</Text>
                  <View style={styles.selectRow}>
                    {[{label: '20%', value: 0.2}, {label: '50%', value: 0.5}].map(opt => (
                      <TouchableOpacity key={opt.label} style={[styles.button,rendement===opt.value&&styles.selectedButton]} onPress={()=>setRendement(opt.value)}>
                        <Text style={[styles.buttonText,rendement===opt.value&&styles.buttonTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* Boutons et résultat */}
                  <View style={{alignItems:'center', marginTop:14}}>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:8}}>
                      <TouchableOpacity
                        style={{
                          borderWidth: 2,
                          borderColor: '#D32F2F',
                          backgroundColor: '#fff',
                          borderRadius: 18,
                          paddingVertical: 8,
                          paddingHorizontal: 22,
                          marginRight: 8
                        }}
                        onPress={handleReset}
                      >
                        <Text style={{color: '#D32F2F', fontWeight: 'bold', fontSize: 16}}>Réinitialiser</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#D32F2F',
                          borderRadius: 18,
                          paddingVertical: 8,
                          paddingHorizontal: 22
                        }}
                        onPress={handleCalculate}
                      >
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Calculer</Text>
                      </TouchableOpacity>
                    </View>
                    {/* Résultat sous les boutons */}
                    {resultOffensive && mode === 'combustible' && strategie === 'offensive' && (
  <View style={styles.resultBlock}>
    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:10}}>
  <Text style={{
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  }}>Résultat</Text>
  <TouchableOpacity
    onPress={() => setShowInfoPopup(true)}
    style={{marginLeft: 8, backgroundColor:'#f1f1f1', borderRadius: 12, paddingHorizontal:6, paddingVertical:2, borderWidth:1, borderColor:'#ccc'}}
    accessibilityLabel="Informations sur le calcul"
  >
    <Text style={{fontStyle:'italic', color:'#444', fontSize:15, fontWeight:'bold'}}>i</Text>
  </TouchableOpacity>
</View>
<InfoPopup
  visible={showInfoPopup}
  onClose={() => setShowInfoPopup(false)}
  customText={`Comment ce débit est‑il calculé ?\n\t1.\tOn estime la puissance P du feu (en MW) par :\nPmax = S(m2) x H(m) x P(MW/m³) x ( %du volume en feu) .\nou P vaut 1 MW/m³ pour le bois, 2 MW/m³ pour un stockage mixte, 2,7 MW/m³ pour du plastique.\n\n\t2.\tOn déduit le débit d’eau Q (en L/min) nécessaire pour absorber cette puissance, en tenant compte du rendement des lances :\nQ = Pmax x 42,5 (pour 50 % de rendement des lances)\nQ = Pmax x 106 (pour 20 % de rendement des lances)\n\n\t3.\tPour obtenir Q en m³/h, on multiplie par 0,06 :\nQ(m³/h) = Q (L/min) x0,06\n\nSi Q dépasse 12 000 L/min (720 m³/h), la limite réglementaire ou opérationnelle est atteinte.`}
/>

    {/* Extraction des valeurs pour affichage détaillé */}
    {(() => {
      const surf = parseFloat(surface);
      const haut = parseFloat(hauteur);
      const pmax = surf * haut * combustible * (fraction/100);
      let multiplier = rendement === 0.5 ? 42.5 : 106;
      const qLmin = pmax * multiplier;
      const qm3h = qLmin / 16.67;
      return (
        <>
          <Text style={[styles.resultText, {fontWeight:'bold'}]}>Puissance max libérée par l'incendie :</Text>
          <Text style={styles.resultText}>{pmax.toFixed(2)} MW</Text>
          <Text style={[styles.resultText, {fontWeight:'bold', marginTop:8}]}>Débit requis :</Text>
          <Text style={styles.resultText}>{qLmin.toFixed(0)} L/min ({qm3h.toFixed(2)} m³/h)</Text>
        </>
      );
    })()}
  </View>
)}
{resultOffensive && !(mode === 'combustible' && strategie === 'offensive') && (
  <View style={styles.resultBlock}>
    <Text style={styles.resultTitle}>Résultat</Text>
    <Text style={styles.resultText}>{resultOffensive}</Text>
    {calcDetailsOffensive && (
      <Text style={styles.resultText}>{calcDetailsOffensive}</Text>
    )}
  </View>
) }
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Surface */}
          {mode === 'surface' && (
            <View>
              <Text style={[styles.label,{color:'#111'}]}>Surface (m²)</Text>
              <TextInput style={styles.input} value={surfaceApprocheSurface} onChangeText={setSurfaceApprocheSurface} keyboardType="numeric"/>
              <Text style={{fontWeight:'bold', color:'#111', marginTop:16, marginBottom:4}}>Taux d'application (L/min/m²)</Text>
              <Text style={{fontWeight:'bold', color:'#D32F2F', fontSize:18, textAlign:'center', marginBottom:2}}>{tauxApplication} L/min/m²</Text>
              <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                <Slider
                  style={{flex:1}}
                  minimumValue={1}
                  maximumValue={20}
                  step={1}
                  value={tauxApplication}
                  onValueChange={setTauxApplication}
                  minimumTrackTintColor="#D32F2F"
                  maximumTrackTintColor="#eee"
                  thumbTintColor="#D32F2F"
                />
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:2}}>
                <TouchableOpacity onPress={()=>setTauxApplication(1)}>
                  <Text style={{color:tauxApplication===1?'#D32F2F':'#888', fontWeight:tauxApplication===1?'bold':'normal'}}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setTauxApplication(10)}>
                  <Text style={{color:tauxApplication===10?'#D32F2F':'#888', fontWeight:tauxApplication===10?'bold':'normal'}}>10</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setTauxApplication(20)}>
                  <Text style={{color:tauxApplication===20?'#D32F2F':'#888', fontWeight:tauxApplication===20?'bold':'normal'}}>20</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', justifyContent:'center', gap:10, marginTop:14}}>
                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: '#D32F2F',
                    backgroundColor: '#fff',
                    borderRadius: 18,
                    paddingVertical: 8,
                    paddingHorizontal: 22,
                  }}
                  onPress={() => {
                    setSurfaceApprocheSurface('');
                    setTauxApplication(6);
                    setResultPropagation(null);
                    setCalcDetailsPropagation(null);
                  }}
                >
                  <Text style={{color: '#D32F2F', fontWeight: 'bold', fontSize: 16}}>Réinitialiser</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#D32F2F',
                    borderRadius: 18,
                    paddingVertical: 8,
                    paddingHorizontal: 22,
                  }}
                  onPress={() => {
                    // Calcul spécifique à l'approche Surface
                    const surf = parseFloat(surfaceApprocheSurface);
                    const taux = parseFloat(String(tauxApplication));
                    if (isNaN(surf) || isNaN(taux)) return;
                    const debit = surf * taux;
                    const res = debit.toFixed(2);
                    setResultPropagation(res);
                    setCalcDetailsPropagation(`${surf} m² × ${taux} L/min/m² = ${res} L/min`);
                  }}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Calculer</Text>
                </TouchableOpacity>
              </View>
              {/* Résultat sous les boutons */}
              {resultPropagation && (
                <View style={styles.resultBlock}>
                  <Text style={styles.resultTitle}>Résultat</Text>
                  <Text style={styles.resultText}>{resultPropagation} L/min</Text>
                  {calcDetailsPropagation && (
                    <Text style={styles.resultText}>{calcDetailsPropagation}</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* FHLI */}
          {mode === 'fhli' && (
            <View>
              <View style={styles.selectRow}>
                <TouchableOpacity style={[styles.button, fhliTab==='foam' && styles.selectedButton]} onPress={()=>setFhliTab('foam')}>
                  <Text style={[styles.buttonText, fhliTab==='foam' && styles.buttonTextSelected]}>Mousse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, fhliTab==='structure' && styles.selectedButton]} onPress={()=>setFhliTab('structure')}>
                  <Text style={[styles.buttonText, fhliTab==='structure' && styles.buttonTextSelected]}>Structure</Text>
                </TouchableOpacity>
              </View>
              {fhliTab==='foam' && (
                <View>
                  <Text style={styles.label}>Surface (m²)</Text>
                  <TextInput style={styles.input} value={fhliFoamSurface} onChangeText={setFhliFoamSurface} keyboardType="numeric"/>
                  <Text style={styles.label}>Type de liquide</Text>
                  <View style={styles.selectRow}>
                    {FHLI_FOAM_OPTIONS.map(opt => (
                      <TouchableOpacity key={opt.label} style={[styles.button, fhliFoamRateType===opt.label && styles.selectedButton]} onPress={()=>setFhliFoamRateType(opt.label as any)}>
                        <Text style={[styles.buttonText, fhliFoamRateType===opt.label && styles.buttonTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {fhliFoamRateType==='Taux du POI' && (
                    <TextInput style={styles.input} value={fhliFoamCustomRate} onChangeText={setFhliFoamCustomRate} keyboardType="numeric" placeholder="Taux personnalisé (L/min/m²)"/>
                  )}
                  <Text style={styles.label}>Concentration (%)</Text>
                  <TextInput style={styles.input} value={fhliFoamConc} onChangeText={setFhliFoamConc} keyboardType="numeric" placeholder="Concentration (%)"/>
                  <Text style={styles.label}>Durée de temporisation (min)</Text>
                  <TextInput style={styles.input} value={fhliFoamTempDur} onChangeText={setFhliFoamTempDur} keyboardType="numeric" placeholder="20"/>
                  <Text style={styles.label}>Durée d’extinction (min)</Text>
                  <TextInput style={styles.input} value={fhliFoamExtDur} onChangeText={setFhliFoamExtDur} keyboardType="numeric" placeholder="40"/>
                  <Text style={styles.label}>Durée de maintien (min)</Text>
                  <TextInput style={styles.input} value={fhliFoamMaintDur} onChangeText={setFhliFoamMaintDur} keyboardType="numeric" placeholder="10"/>
                  <TouchableOpacity style={styles.button} onPress={handleFhliFoamCalc}>
                    <Text style={styles.buttonText}>Calculer mousse</Text>
                  </TouchableOpacity>
                </View>
              )}
              {fhliFoamDebit && (
                <View style={styles.resultBlock}>
                  <Text style={styles.resultTitle}>Débit instantané</Text>
                  <Text style={styles.resultText}>{fhliFoamDebit} L/min</Text>
                </View>
              )}
              {besoinEmulseurTotal && (
                <View style={styles.resultBlock}>
                  <Text style={styles.resultTitle}>Besoin total émulseur</Text>
                  <Text style={styles.resultText}>{besoinEmulseurTotal} m³</Text>
                </View>
              )}
              {fhliTab==='structure' && (
                <View>
                  <Text style={styles.label}>Débit du rideau d’eau</Text>
                  <View style={styles.selectRow}>
                    {FHLI_STRUCT_OPTIONS.map(opt => (
                      <TouchableOpacity key={opt.label} style={[styles.button, fhliStructOption===opt.flow && styles.selectedButton]} onPress={()=>setFhliStructOption(opt.flow)}>
                        <Text style={[styles.buttonText, fhliStructOption===opt.flow && styles.buttonTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={[styles.label,{color:'#111'}]}>Longueur (m)</Text>
                  <TextInput style={styles.input} value={fhliStructLength} onChangeText={setFhliStructLength} keyboardType="numeric" placeholder="Longueur en m"/>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
      </>
  );
}

export default GrandFeuxCalculator;

