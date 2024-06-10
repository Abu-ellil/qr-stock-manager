import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera';

const Scan = () => {
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = (qr) => {
    checkProductExists(qr.data);
    setScanned(true);
    
  };

  const handleScanAgain = () => {
    setScanned(false);
  };


    const checkProductExists = async (barcode) => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "products"), where("barcode", "==", barcode))
        );
        console.log(querySnapshot);
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data();
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error checking product existence:", error);
        return null;
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["codabar", "code39", "code93", "code128", "qr"],
          }}
          onBarcodeScanned={(qr) => {
            if (!scanned) {
              handleBarCodeScanned(qr);
            }
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        {scanned && (
          <TouchableOpacity style={styles.button} onPress={handleScanAgain}>
            <Text style={styles.text}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 18,
    margin: 20,
    color: "#333",
  },
  cameraContainer: {
    flex: 4,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "orange",
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
    margin: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});


export default Scan

