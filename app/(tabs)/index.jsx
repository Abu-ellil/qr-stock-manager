
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, RefreshControl, SafeAreaView } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


const db = getFirestore();

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);
      const productList = snapshot.docs.map(doc => doc.data());
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}> 
    <Image
        source={require("../../assets/images/prod.png")}
        style={styles.productImage}
      />
      <Text> {item.name}</Text>
      <Text>الكمية:  {item.quantity}</Text>
     <Text>السعر:  {item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.barcode}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
            progressBackgroundColor="#fff"
          />
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop:40,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between"
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  titleContainer: {
    flexDirection: "row",
  },
});