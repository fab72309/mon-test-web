import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, SafeAreaView } from 'react-native';
import { Header } from '@/components/ui/Header';
import { useThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMemoSegments } from '../../context/MemoSegmentsContext';

import { Colors } from '../../constants/Colors';

const deniveaux = [-30, -20, -10, 0, 10, 20, 30]; // boutons rapides, puis affinement par pas de 0.5
const pressions = [5, 6, 7, 8];

const getStyles = (palette: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
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
  labelSection: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: palette.text,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  savedDesc: {
    flex: 1,
    color: palette.text,
    fontSize: 15,
  },
  savedVal: {
    color: palette.title,
    fontSize: 16,
    marginHorizontal: 8,
  },
  savedTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: palette.title,
    marginBottom: 4,
  },
  section: {
    backgroundColor: palette.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: palette.accent,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  paramBtn: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: palette.inputBackground,
    alignItems: 'center',
  },
  paramBtnSelected: {
    backgroundColor: palette.primary,
  },
  paramBtnTxt: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paramBtnSelectedTxt: {
    color: palette.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  calcBtn: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: palette.accent,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calcBtnTxt: {
    fontSize: 22,
    color: palette.title,
    fontWeight: 'bold',
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
  resultValue: {
    fontWeight: 'bold',
    color: palette.text,
    fontSize: 18,
    marginBottom: 4,
  },
});

export default function CalculEtablissement(props: { key?: string }) {
  const { theme } = useThemeContext();
  const palette = Colors[theme];
  const styles = getStyles(palette);
  const isDark = theme === 'dark';
  const { segments, updateSegment, removeSegment } = useMemoSegments();
  const [denivele, setDenivele] = useState(0);
  const [pressionLance, setPressionLance] = useState(6);
  const [pressionActive, setPressionActive] = useState(true);

  // Calculs
  const perteDeCharge = segments.reduce((acc: number, t) => acc + t.perte, 0);
  const perteDenivele = denivele / 10; // 1 bar / 10m, positif ou négatif
  const pression = pressionActive ? pressionLance : 0;
  const total = perteDeCharge + perteDenivele + pression;

  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [edit, setEdit] = useState<{diametre:number, longueur:number, debit:number, perte:number}>({diametre:45, longueur:100, debit:500, perte:0});
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  // Edition
  const openEdit = (idx:number) => {
    setEdit({
      diametre: segments[idx].diametre,
      longueur: segments[idx].longueur,
      debit: segments[idx].debit,
      perte: segments[idx].perte
    });
    setEditIdx(idx);
    setError('');
    setModalVisible(true);
  };
  const handleEditSave = () => {
    // Validation : pas de doublon, bornes raisonnables
    if (segments.some((s,i) => i!==editIdx && s.diametre===edit.diametre && s.longueur===edit.longueur && s.debit===edit.debit)) {
      setError('Doublon interdit');
      return;
    }
    if (edit.longueur<1 || edit.debit<1 || edit.diametre<1) {
      setError('Valeur incorrecte');
      return;
    }
    updateSegment(segments[editIdx!].id, edit);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: palette.background}]}> 
      {/* Header */}
      <Header title="Établissement" iconName="construct" iconFamily="Ionicons" iconColor="#D32F2F" titleColor="#D32F2F" iconSize={32} style={{marginBottom: 10, marginTop: 0, paddingLeft: 0}} />
      <ScrollView contentContainerStyle={{padding:16, paddingTop:0}} keyboardShouldPersistTaps="handled">
        {/* Section Tronçons mémorisés */}
        <View style={styles.savedSection}>
          <Text style={styles.savedTitle}>Tronçons mémorisés</Text>
          {segments.length === 0 && <Text style={{color:'#888',fontStyle:'italic'}}>Aucun tronçon mémorisé</Text>}
          {segments.map((t, idx) => (
            <View style={styles.savedRow} key={t.id}>
              <Text style={styles.savedDesc}>{`T${idx+1}: Ø${t.diametre}mm - ${t.longueur}m - ${t.debit}L/min`}</Text>
              <Text style={styles.savedVal}>{t.perte.toFixed(2)}b</Text>
              <TouchableOpacity onPress={() => openEdit(idx)}>
                <Ionicons name="pencil" size={20} color={palette.accent} style={{marginRight:10}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeSegment(t.id)}>
                <Ionicons name="trash" size={20} color={palette.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Section Dénivelé */}
        <View style={[styles.section,{backgroundColor:palette.background, borderWidth:0}]}>
          <Text style={styles.labelSection}>Dénivelé</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:8, marginBottom:8}}>
            {deniveaux.map(val => (
              <TouchableOpacity key={val} style={[styles.paramBtn, denivele===val && styles.paramBtnSelected]} onPress={()=>setDenivele(val)}>
                <Text style={denivele===val?styles.paramBtnSelectedTxt:styles.paramBtnTxt}>{val>0?`+${val}`:`${val}`}m</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{textAlign:'center',marginVertical:6,color:'#888'}}>{denivele.toFixed(2)}m ({perteDenivele >= 0 ? '+' : ''}{perteDenivele.toFixed(2)} bars)</Text>
          <View style={{flexDirection:'row',justifyContent:'center',marginTop:8}}>
            <TouchableOpacity style={styles.calcBtn} onPress={()=>setDenivele(d => Math.max(-30, Math.min(30, +(d-0.5).toFixed(2))))}><Text style={styles.calcBtnTxt}>-</Text></TouchableOpacity>
            <TouchableOpacity style={styles.calcBtn} onPress={()=>setDenivele(d => Math.max(-30, Math.min(30, +(d+0.5).toFixed(2))))}><Text style={styles.calcBtnTxt}>+</Text></TouchableOpacity>
          </View>
        </View>

        {/* Section Pression à la lance */}
        <View style={styles.section}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={styles.labelSection}>Pression à la lance</Text>
            <TouchableOpacity
              onPress={()=>setPressionActive(a=>!a)}
              style={{
                marginLeft:8,
                backgroundColor: pressionActive ? palette.primary : '#eee',
                borderRadius: 16,
                paddingVertical: 4,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Ionicons name={pressionActive ? 'checkmark-circle' : 'close-circle'} size={18} color={pressionActive ? '#fff' : '#aaa'} style={{marginRight:4}}/>
              <Text style={{color: pressionActive ? '#fff' : '#888', fontWeight:'bold'}}>{pressionActive ? 'Activé' : 'Désactivé'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{fontSize:18,fontWeight:'bold',color:palette.primary,marginBottom:10}}>{pressionLance.toFixed(1)} bars</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
            {pressions.map(val => (
              <TouchableOpacity key={val} style={[styles.paramBtn, pressionLance===val && styles.paramBtnSelected]} onPress={()=>setPressionLance(val)}>
                <Text style={pressionLance===val?styles.paramBtnSelectedTxt:styles.paramBtnTxt}>{val} bars</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Résumé */}
        <View style={styles.section}>
          <Text style={styles.labelSection}>Résumé</Text>
          <Text style={{color:palette.primary,fontWeight:'bold',fontSize:16}}>Perte de charge : {perteDeCharge.toFixed(2)} bars</Text>
          <Text style={{color:palette.primary,fontWeight:'bold',fontSize:16}}>Perte dénivelé : {perteDenivele >= 0 ? '+' : ''}{perteDenivele.toFixed(2)} bars</Text>
          <Text style={{color:palette.primary,fontWeight:'bold',fontSize:16}}>Pression à la lance : {pression.toFixed(2)} bars</Text>
          <Text style={{color:palette.primary,fontWeight:'bold',fontSize:18,marginTop:8}}>Total : {total.toFixed(2)} bars</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

