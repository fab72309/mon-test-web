import React from 'react';
import { Platform } from 'react-native';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function InfoPopup({ visible, onClose, strategy = 'offensive', customText }: { visible: boolean; onClose: () => void; strategy?: 'offensive' | 'propagation'; customText?: string }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {customText ? (
            <>
              <Text style={styles.title}>Comment ce débit est-il calculé ?</Text>
              <Text style={styles.text}>{customText}</Text>
            </>
          ) : strategy === 'propagation' ? (
            <>
              <Text style={styles.title}>Comment ce débit est-il calculé ?</Text>
              <Text style={styles.text}>
Comment est calculé le débit ?{"\n"}
Le débit total (Q) en L/min est obtenu par :{"\n"}
Q = Surface en feu (m²) x Taux (L/min/m²).{"\n"}
Ex. Pour 500 m² à 3 L/min/m² → 500×3=1 500 L/min (1,50 m³/h).{"\n\n"}
Un taux par défaut de 3 L/min/m² correspond aux recommandations GOC pour les entrepôts non sprinklés (risque important). Ajustez-le selon le type de combustible et la doctrine (1–4 L/min/m² pour feux structurels, 10–20 L/min/m² pour feux hydrocarbures).
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Comment ce débit est-il calculé ?</Text>
              <Text style={styles.text}>
1. On estime la puissance P du feu (en MW) par :
<Text style={styles.formula}>P = S (m²) × H (m) × P₍vol₎ (MW/m³) × (% volume / 100)</Text>
  où P₍vol₎ vaut 1 MW/m³ pour le bois, 2 MW/m³ pour un stockage mixte, 2,7 MW/m³ pour du plastique.{"\n\n"}
2. On déduit le débit d'eau Q (en L/min) nécessaire pour absorber cette puissance, en tenant compte du rendement des lances :
<Text style={styles.formula}>Q = P × {`{ 42,5 pour 50% de rendement\n      106 pour 20% de rendement`}</Text>{"\n\n"}
3. Pour obtenir Q en m³/h, on multiplie par 0,06 :
<Text style={styles.formula}>Q₍m³/h₎ = Q₍L/min₎ × 0,06</Text>{"\n\n"}
Si Q dépasse 12 000 L/min (720 m³/h), la limite réglementaire ou opérationnelle est atteinte.
              </Text>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    maxWidth: 330,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
    color: '#D32F2F',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#222',
    marginBottom: 14,
  },
  formula: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    color: '#222',
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
