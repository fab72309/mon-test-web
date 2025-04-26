import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Header } from '@/components/ui/Header';
import { useThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';

const getStyles = (palette: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: palette.background,
  },
  resultUnit: {
    color: palette.secondaryText,
    fontSize: 16,
    fontWeight: 'normal',
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  detailsToggleText: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsBox: {
    backgroundColor: palette.card,
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    width: '100%',
  },
  detailsLine: {
    fontSize: 14,
    color: palette.text,
    marginBottom: 2,
  },
  detailsLabel: {
    color: palette.primary,
    fontWeight: 'bold',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  infoBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: 24,
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    color: palette.primary,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: palette.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  modalBtnText: {
    color: palette.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  calculateBtn: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  calculateBtnText: {
    color: palette.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'center',
  },

  backBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, marginBottom: 10 },
  backTxt: { color: palette.primary, fontWeight: 'bold', fontSize: 18, marginLeft: 6 },
  formSection: { width: '100%', maxWidth: 340, alignSelf: 'center', marginTop: 24, marginBottom: 18 },
  label: { fontSize: 14, fontWeight: 'bold', color: palette.text, marginTop: 8, marginBottom: 3, marginLeft: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  input: { width: 90, borderWidth: 1, borderColor: palette.border, borderRadius: 7, padding: 6, fontSize: 15, backgroundColor: palette.inputBackground, color: palette.text, textAlign: 'center' },
  resultBox: { width: '100%', marginTop: 12, padding: 8, borderRadius: 10, backgroundColor: palette.card, alignItems: 'center' },
  resultLabel: { fontSize: 15, fontWeight: 'bold', color: palette.primary, marginBottom: 4 },
  resultValue: { fontSize: 18, color: palette.text, fontWeight: 'bold' },
});

export default function DebitMaxPEI() {
  const { theme } = useThemeContext();
  const palette = Colors[theme];
  const isDark = theme === 'dark';
  const styles = getStyles(palette);
  const navigation = useNavigation();
  const [pressionStatique, setPressionStatique] = React.useState('');
  const [pressionResiduelle, setPressionResiduelle] = React.useState('');
  const [debitRefoulement, setDebitRefoulement] = React.useState('');
  const [resultat, setResultat] = React.useState('-');
  const [resultatArrondi, setResultatArrondi] = React.useState('-');
  const [resultatM3h, setResultatM3h] = React.useState('-');
  const [details, setDetails] = React.useState({ps: '', pr: '', pUtil: '', qUtil: '', qMax: '', qDispo: ''});
  const [infoVisible, setInfoVisible] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  function handleCalcul() {
    const ps = parseFloat(pressionStatique.replace(',', '.'));
    const pr = parseFloat(pressionResiduelle.replace(',', '.'));
    const qUtil = parseFloat(debitRefoulement.replace(',', '.'));
    if (
      isNaN(ps) || isNaN(pr) || isNaN(qUtil) || ps <= pr || ps <= 0 || qUtil <= 0
    ) {
      setResultat('-');
      setResultatArrondi('-');
      setResultatM3h('-');
      setDetails({ps: '', pr: '', pUtil: '', qUtil: '', qMax: '', qDispo: ''});
      return;
    }
    const pUtil = ps - pr;
    const qMax = qUtil * Math.sqrt(ps / pUtil);
    const qDispo = qMax - qUtil;
    const qDispoArrondi = Math.round(qDispo);
    const qDispoM3h = (qDispoArrondi * 0.06).toFixed(2); // 1 L/min = 0.06 m3/h
    setResultat(qDispo.toFixed(2));
    setResultatArrondi(qDispoArrondi.toString());
    setResultatM3h(qDispoM3h);
    setDetails({
      ps: ps.toString(),
      pr: pr.toString(),
      pUtil: pUtil.toFixed(2),
      qUtil: qUtil.toString(),
      qMax: qMax.toFixed(2),
      qDispo: qDispo.toFixed(2),
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header harmonisé */}
        <Header title="Débit max du PEI" iconName="opacity" iconFamily="MaterialIcons" iconColor="#D32F2F" titleColor="#D32F2F" iconSize={32} style={{marginBottom: 10, marginTop: 0, paddingLeft: 0}} />
        <View style={styles.card}>
          <View style={styles.formSection}>
            <Text style={styles.label}>Pression statique (bar)</Text>
            <View style={styles.inputRow}>
              <Ionicons name="speedometer" size={22} color={palette.primary} style={{ marginRight: 6 }} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="ex: 6.0"
                value={pressionStatique}
                onChangeText={setPressionStatique}
              />
            </View>
            <Text style={styles.label}>Pression résiduelle (bar)</Text>
            <View style={styles.inputRow}>
              <Ionicons name="water" size={22} color="#2196F3" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="ex: 2.5"
                value={pressionResiduelle}
                onChangeText={setPressionResiduelle}
              />
            </View>
            <Text style={styles.label}>Débit de refoulement (L/min)</Text>
            <View style={styles.inputRow}>
              <Ionicons name="swap-vertical" size={22} color={palette.primary} style={{ marginRight: 6 }} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="ex: 500"
                value={debitRefoulement}
                onChangeText={setDebitRefoulement}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.calculateBtn} onPress={handleCalcul}>
          <Text style={styles.calculateBtnText}>Calculer</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultLabel, {color: theme === 'dark' ? '#fff' : '#D32F2F'}]}>Débit disponible :</Text>
            <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.infoBtn}>
              <Ionicons name="information-circle-outline" size={22} color="#1976D2" />
            </TouchableOpacity>
          </View>
          <View style={[styles.resultBox, {backgroundColor: theme === 'dark' ? '#23242b' : '#f7f7f7'}]}>
            <Text style={[styles.resultValue, {color: theme === 'dark' ? '#fff' : '#222'}]}>{resultatArrondi} L/min <Text style={styles.resultUnit}>({resultatM3h} m³/h)</Text></Text>
          </View>
        </View>
        <TouchableOpacity style={styles.detailsToggle} onPress={() => setShowDetails((v) => !v)}>
          <Ionicons name={showDetails ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#1976D2" />
          <Text style={styles.detailsToggleText}>{showDetails ? "Masquer les détails" : "Voir le détail du calcul"}</Text>
        </TouchableOpacity>
        {showDetails && (
          <View style={[styles.detailsBox, {backgroundColor: theme === 'dark' ? '#181A20' : '#f7f7f7'}]}>
            <Text style={[styles.detailsLine, {color: theme === 'dark' ? '#fff' : '#333'}]}><Text style={styles.detailsLabel}>Pression statique :</Text> {details.ps} bar</Text>
            <Text style={[styles.detailsLine, {color: theme === 'dark' ? '#fff' : '#333'}]}><Text style={styles.detailsLabel}>Pression résiduelle :</Text> {details.pr} bar</Text>
            <Text style={[styles.detailsLine, {color: theme === 'dark' ? '#fff' : '#333'}]}><Text style={styles.detailsLabel}>Pression utilisée :</Text> {details.pUtil} bar</Text>
            <Text style={[styles.detailsLine, {color: theme === 'dark' ? '#fff' : '#333'}]}><Text style={styles.detailsLabel}>Débit utilisé :</Text> {details.qUtil} L/min</Text>
            <Text style={[styles.detailsLine, {color: theme === 'dark' ? '#fff' : '#333'}]}><Text style={styles.detailsLabel}>Q max :</Text> {details.qMax} L/min</Text>
            <Text style={[styles.detailsLine, {color: theme === 'dark' ? '#fff' : '#333'}]}><Text style={styles.detailsLabel}>Débit disponible :</Text> {details.qDispo} L/min</Text>
          </View>
        )}
      </ScrollView>
      <Modal visible={infoVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: theme === 'dark' ? '#23242b' : '#fff'}]}>
            <Text style={[styles.modalTitle, {color: theme === 'dark' ? '#fff' : '#222'}]}>Débit disponible</Text>
            <Text style={[styles.modalText, {color: theme === 'dark' ? '#fff' : '#222'}]}>
              Cette valeur correspond au débit supplémentaire que l’hydrant peut fournir, en plus du débit actuellement utilisé, dans les conditions de pression mesurées.
            </Text>
            <TouchableOpacity onPress={() => setInfoVisible(false)} style={styles.modalBtn}>
              <Text style={styles.modalBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 32,
  },
  resultUnit: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'normal',
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  detailsToggleText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    width: '100%',
  },
  detailsLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  detailsLabel: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  infoBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: '#1976D2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calculateBtn: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  calculateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'center',
  },
  
  headerBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 32, 
    marginBottom: 18 
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F', letterSpacing: 1 },

  backBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, marginBottom: 10 },
  backTxt: { color: '#D32F2F', fontWeight: 'bold', fontSize: 18, marginLeft: 6 },
  formSection: { width: '100%', maxWidth: 340, alignSelf: 'center', marginTop: 24, marginBottom: 18 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 18, marginBottom: 6, marginLeft: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  input: { width: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, fontSize: 16, backgroundColor: '#f8f8f8', color: '#222', textAlign: 'center' },
  resultBox: { width: '100%', marginTop: 28, padding: 16, borderRadius: 10, backgroundColor: '#f2f2f2', alignItems: 'center' },
  resultLabel: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', marginBottom: 6 },
  resultValue: { fontSize: 22, color: '#222', fontWeight: 'bold' },
});
