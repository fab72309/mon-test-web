import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import Slider from '@react-native-community/slider';
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

export default function GrandFeuxCalculator() {
  // Fonction de réinitialisation
  const handleReset = () => {
    setSurface('');
    setHauteur('');
    setFraction(0);
    setCombustible(2);
    setRendement(0.2);
    setSurfaceVertical('');
    setResult(null);
  }
  // États
  const [mode, setMode] = useState<'combustible'|'surface'|'fhli'>('combustible');
  const [strategie, setStrategie] = useState<'offensive'|'propagation'>('offensive');
  const [surface, setSurface] = useState('');
  const [hauteur, setHauteur] = useState('');
  const [fraction, setFraction] = useState(0);
  const [combustible, setCombustible] = useState(2);
  const [rendement, setRendement] = useState(0.2);
  const [surfaceVertical, setSurfaceVertical] = useState('');
  const [result, setResult] = useState<string|null>(null);
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
    let res = '';
    if (mode === 'combustible') {
      const surf = parseFloat(surface);
      const haut = parseFloat(hauteur);
      if (isNaN(surf)||isNaN(haut)) return;
      const vol = surf * haut * (fraction/100);
      res = (vol * combustible * rendement).toFixed(2);
    } else if (mode === 'surface') {
      const surf = parseFloat(surface);
      const haut = parseFloat(hauteur);
      if (isNaN(surf)||isNaN(haut)) return;
      res = (surf * haut).toFixed(2);
    } else {
      // FHLI structure calc
      const length = parseFloat(fhliStructLength);
      if (isNaN(length)) return;
      res = ((fhliStructOption * length)/1000).toFixed(2);
    }
    setResult(res);
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
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={1}>Dimensionnement des moyens hydrauliques</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab,mode==='combustible'&&styles.tabActive]} onPress={()=>setMode('combustible')}>
              <MaterialCommunityIcons name="fire" size={16} color={mode==='combustible'?'#fff':'#111'} style={{marginRight:4}}/><Text style={[styles.tabText,mode==='combustible'&&styles.tabTextActive]}>Puissance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab,mode==='surface'&&styles.tabActive]} onPress={()=>setMode('surface')}>
              <MaterialCommunityIcons name="vector-square" size={16} color={mode==='surface'?'#fff':'#111'} style={{marginRight:4}}/><Text style={[styles.tabText,mode==='surface'&&styles.tabTextActive]}>Surface</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab,mode==='fhli'&&styles.tabActive]} onPress={()=>setMode('fhli')}>
              <MaterialCommunityIcons name="gas-station" size={16} color={mode==='fhli'?'#fff':'#111'} style={{marginRight:4}}/><Text style={[styles.tabText,mode==='fhli'&&styles.tabTextActive]}>FHLI</Text>
            </TouchableOpacity>
          </View>

          {/* Combustible */}
          {mode==='combustible'&&(
            <View>
              <Text style={styles.strategieTitle}>Stratégie</Text>
              <View style={styles.selectRow}>
                <TouchableOpacity style={[styles.button,strategie==='offensive'&&styles.selectedButton]} onPress={()=>setStrategie('offensive')}><View style={{flexDirection:'row',alignItems:'center'}}><MaterialCommunityIcons name="fire-truck" size={16} color={strategie==='offensive'?'#fff':'#111'} style={{marginRight:4}}/><Text style={[styles.buttonText,strategie==='offensive'&&styles.buttonTextSelected]}>Attaque offensive</Text></View></TouchableOpacity>
                <TouchableOpacity style={[styles.button,strategie==='propagation'&&styles.selectedButton]} onPress={()=>setStrategie('propagation')}><View style={{flexDirection:'row',alignItems:'center'}}><MaterialCommunityIcons name="shield" size={16} color={strategie==='propagation'?'#fff':'#111'} style={{marginRight:4}}/><Text style={[styles.buttonText,strategie==='propagation'&&styles.buttonTextSelected]}>Lutte propagation</Text></View></TouchableOpacity>
              </View>
              {strategie==='offensive'&&(
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
  <TouchableOpacity style={[styles.combustibleSliderLabelTouch, {flex: 1, alignItems: 'flex-start'}]} onPress={()=>setCombustible(1)}>
    <Text style={[
      styles.combustibleSliderLabel,
      { color: '#D32F2F', textDecorationLine: combustible >= 0.99 && combustible <= 1.01 ? 'underline' : 'none', fontWeight: combustible >= 0.99 && combustible <= 1.01 ? 'bold' : 'normal', textAlign: 'left' }
    ]}>Bois</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.combustibleSliderLabelTouch, {flex: 1, alignItems: 'center'}]} onPress={()=>setCombustible(2)}>
    <Text style={[
      styles.combustibleSliderLabel,
      { color: '#D32F2F', textDecorationLine: combustible >= 1.99 && combustible <= 2.01 ? 'underline' : 'none', fontWeight: combustible >= 1.99 && combustible <= 2.01 ? 'bold' : 'normal', textAlign: 'center' }
    ]}>Mixte</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.combustibleSliderLabelTouch, {flex: 1, alignItems: 'flex-end'}]} onPress={()=>setCombustible(2.7)}>
    <Text style={[
      styles.combustibleSliderLabel,
      { color: '#D32F2F', textDecorationLine: combustible >= 2.69 && combustible <= 2.71 ? 'underline' : 'none', fontWeight: combustible >= 2.69 && combustible <= 2.71 ? 'bold' : 'normal', textAlign: 'right' }
    ]}>Plastique</Text>
  </TouchableOpacity>
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
                          <Text style={[styles.combustibleSliderLabel, fraction===val && styles.combustibleSliderLabelActive]}>{val}%</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <Text style={{fontWeight:'bold', color:'#111'}}>Rendement des lances</Text>
                  <View style={styles.selectRow}>
                    {rendementOptions.map(opt => (
                      <TouchableOpacity key={opt.label} style={[styles.button,rendement===opt.value&&styles.selectedButton]} onPress={()=>setRendement(opt.value)}>
                        <Text style={[styles.buttonText,rendement===opt.value&&styles.buttonTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 10}}>
  <TouchableOpacity
    style={{
      borderWidth: 2,
      borderColor: '#D32F2F',
      backgroundColor: '#fff',
      borderRadius: 18,
      paddingVertical: 8,
      paddingHorizontal: 22,
      marginRight: 4,
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
      paddingHorizontal: 22,
    }}
    onPress={handleCalculate}
  >
    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Calculer</Text>
  </TouchableOpacity>
</View>
                  {result&&(<View style={styles.resultBox}><Text style={styles.resultText}>{result}</Text></View>)}
                </View>
              )}
              {strategie==='propagation'&&(<View><Text style={[styles.label,{color:'#111'}]}>Surface verticale (m²)</Text><TextInput style={styles.input} value={surfaceVertical} onChangeText={setSurfaceVertical} keyboardType="numeric" placeholder="Surface verticale en m²"/><View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 10}}>
  <TouchableOpacity
    style={{
      borderWidth: 2,
      borderColor: '#D32F2F',
      backgroundColor: '#fff',
      borderRadius: 18,
      paddingVertical: 8,
      paddingHorizontal: 22,
      marginRight: 4,
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
      paddingHorizontal: 22,
    }}
    onPress={handleCalculate}
  >
    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Calculer</Text>
  </TouchableOpacity>
</View>{result&&(<View style={styles.resultBox}><Text style={styles.resultText}>{result}</Text></View>)}</View>)}
            </View>
          )}

          {/* Surface */}
          {mode==='surface'&&(<View><Text style={[styles.label,{color:'#111'}]}>Surface (m²)</Text><TextInput style={styles.input} value={surface} onChangeText={setSurface} keyboardType="numeric"/><Text style={[styles.label,{color:'#111'}]}>Hauteur (m)</Text><TextInput style={styles.input} value={hauteur} onChangeText={setHauteur} keyboardType="numeric"/><View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 10}}>
  <TouchableOpacity
    style={{
      borderWidth: 2,
      borderColor: '#D32F2F',
      backgroundColor: '#fff',
      borderRadius: 18,
      paddingVertical: 8,
      paddingHorizontal: 22,
      marginRight: 4,
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
      paddingHorizontal: 22,
    }}
    onPress={handleCalculate}
  >
    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Calculer</Text>
  </TouchableOpacity>
</View>{result&&(<View style={styles.resultBox}><Text style={styles.resultText}>{result}</Text></View>)}</View>)}

          {/* FHLI */}
          {mode==='fhli' && (
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
