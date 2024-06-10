import React, { useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import { query } from "firebase/database";

const Scanner = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [productData, setProductData] = useState({ barcode: "" });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [productFound, setProductFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const addProductToDb = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "products"), {
        barcode: productData.barcode,
        name,
        price,
        quantity,
      });
      Alert.alert("Success!", "Product added to database.");
      setProductData({ barcode: "" });
      setName("");
      setPrice("");
      setQuantity("");
      setScanned(false);
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error!", "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await lookForQRInDB(productData.barcode);
    setRefreshing(false);
  };

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      setProductData({ barcode: data });
      await lookForQRInDB(data);
      setScanned(true);
    } catch (error) {
      console.error("Error in handleBarCodeScanned:", error);
    }
  };

  const lookForQRInDB = async (barcode) => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("barcode", "==", barcode));
      const querySnapshot = await getDocs(q);
      setLoading(false);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const productData = doc.data();
          setName(productData.name);
          setPrice(productData.price);
          setQuantity(productData.quantity);
          setProductFound(true);
          console.log("Product found:", productData);
        });
      } else {
        setProductFound(false);
        console.log("Product not found");
      }
    } catch (error) {
      console.error("Error searching for product:", error);
      setLoading(false);
    }
  };

  const scanAgain = () => {
    setScanned(false);
    setProductFound(false);
    setProductData({ barcode: "" });
    setName("");
    setPrice("");
    setQuantity("");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading && (
        <ActivityIndicator
          style={styles.indicator}
          size="xlarge"
          color="odgerblue"
        />
      )}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["codabar", "code39", "code93", "code128", "qr"],
          }}
          onBarcodeScanned={!scanned ? handleBarCodeScanned : undefined}
        />
      </View>
      <View style={styles.buttonContainer}>
        {scanned && <Button title={"Tap to Scan Again"} onPress={scanAgain} />}

        {scanned && (
          <View style={styles.formContainer}>
            {productFound ? (
              <View>
                <Text style={styles.title}>Product Details</Text>
                <View style={styles.infContainer}>
                  <Text style={styles.label}>الاسم:</Text>
                  <Text style={styles.label}>{name}</Text>
                </View>
                <View style={styles.infContainer}>
                  <Text style={styles.label}>السعر:</Text>
                  <Text style={styles.label}>{price}</Text>
                </View>
                <View style={styles.infContainer}>
                  <Text style={styles.label}>الكمية:</Text>
                  <Text style={styles.label}>{quantity}</Text>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>Add New Product</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Product Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Quantity"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <Button
                  title="Save Product"
                  onPress={addProductToDb}
                  disabled={!name || !price || !quantity}
                  color="#007bff"
                />
                {loading && (
                  <ActivityIndicator
                    style={styles.indicator}
                    size="large"
                    color="black"
                  />
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
  },
  cameraContainer: {
    flex: 2,
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    textAlign: "center",
    fontSize: 18,
    margin: 20,
    color: "#333",
  },
  formContainer: {
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  buttonContainer: {
    flex: 3,
    backgroundColor: "orange",
    padding: 15,
    justifyContent: "space-around",
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
  infContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#57545423",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 32,
    marginBottom: 15,
    color: "#333",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  indicator: {
    position: "absolute",
    marginTop: 20,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
