import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  ScrollView,
  Image,
  StatusBar,
  Platform
} from 'react-native';

const App = () => {
  const [showDownload, setShowDownload] = useState(false);

  // رابط التحميل المباشر بتاعك
  const apkLink = "https://drive.google.com/uc?export=download&id=1i1rBWbByhcCHj0bKVk3O65HCIdbELHEX";

  const handleDownload = () => {
    Linking.openURL(apkLink).catch(err => 
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <ScrollView style={styles.container>
