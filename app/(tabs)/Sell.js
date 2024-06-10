// import { StyleSheet, Text, View,FlatList, RefreshControl  } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { Picker } from "@react-native-picker/picker";


// const db = getFirestore();

// const Sell = () => {
//   const [products, setProducts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const productsCollection = collection(db, "products");
//       const snapshot = await getDocs(productsCollection);
//       const productList = snapshot.docs.map((doc) => doc.data());
//       setProducts(productList);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProducts();
//   };

//   return (
//     <View style={styles.item}>
//       <Picker onPress={() => console.log(product)}>
//         {products.map((product) => {
//           console.log(product.name);
//           return (
//             <View>
//               <Picker.Item
//                 key={product.id}
//                 label={product.name}
//                 value={product.name}
//               />
//             </View>
//           );
//         })}
//       </Picker>
//     </View>
//   );
// }

// export default Sell

// const styles = StyleSheet.create({
//   item:{
//     padding: 40,
//   }
// });
