import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';

let sheetAPI = 'https://sheet.best/api/sheets/a9845046-7530-4432-9f09-f54626eeb6ce';


type ChildProps = {
  childName: string;
  childId: string;
};

let fatherName = "";

const Child: React.FC<ChildProps> = ({ childName, childId }) => (
  <View style={styles.childBlock}>
    <Image
      style={styles.childImage}
      source={require('../assets/images/child_placeholder.png')}
    />
    <View style={styles.childTextContainer}>
      <View style={styles.childTextBlock}>
        <Text style={styles.childLabel}>Nombre del estudiante:</Text>
        <Text style={styles.childValue}>{childName}</Text>
      </View>
      <View style={styles.childTextBlock}>
        <Text style={styles.childLabel}>No. Id</Text>
        <Text style={styles.childValue}>{childId}</Text>
      </View>
    </View>
  </View>
);


export default function List(): React.JSX.Element {

  const { fatherData, childsData, user } = useLocalSearchParams();
  let parsedFatherData;
  let parsedChildData;

  if (typeof fatherData === 'string') {
    parsedFatherData = JSON.parse(fatherData);
  } else {
    parsedFatherData = {};
  }

  if (typeof childsData === 'string') {
    parsedChildData = JSON.parse(childsData);
  } else {
    parsedChildData = {};
  }

  fatherName = parsedFatherData.name + " " + parsedFatherData.first_lastname + " " + parsedFatherData.second_lastname;

  const handleAction = async () => {
    let record = [];
    const now = new Date();
    const fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const hora = now.getHours();
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const horaymin = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    try {
      for (const item of parsedChildData) {
        let action = "";
        const response = await axios.get(sheetAPI + "/tabs/record/search?id=" + item.childId + "&date=" + fecha);
        let entries = response.data;
        if (entries.length == 0) {
          action = "E";
        } else {
          const lastEntry = entries[entries.length - 1];
          if (lastEntry.action == "E") {
            action = "S";
          } else {
            action = "E";
          }
        }
        record.push({
          id: item.childId,
          date: fecha,
          hour: horaymin,
          action: action,
          leaves: fatherName,
          receives: user,
          child_name: item.childName,
        });
      };
      await axios.post(sheetAPI + "/tabs/record", record);
      router.back();
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundTop}>
        <Image
          style={styles.profileImage}
          source={require('../assets/images/father_placeholder.png')}
        />
        <View style={styles.textContainer}>
          <View style={styles.textRow}>
            <View style={styles.textBlock1}>
              <Text style={styles.label}>Nombre del Padre:</Text>
              <Text style={styles.value}>{parsedFatherData.name} {parsedFatherData.first_lastname} {parsedFatherData.second_lastname}</Text>
            </View>
            <View style={styles.textBlock2}>
              <Text style={styles.label}>Dirección</Text>
              <Text style={styles.value} numberOfLines={3}>{parsedFatherData.address}</Text>
            </View>
          </View>
          <View style={styles.textRow}>
            <View style={styles.textBlock1}>
              <Text style={styles.label}>No. Id</Text>
              <Text style={styles.value}>{parsedFatherData.id}</Text>
            </View>
            <View style={styles.textBlock2}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{parsedFatherData.phone}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.backgroundBottom}>
        <FlatList
          style={styles.flatList}
          data={parsedChildData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Child
              childName={item.childName}
              childId={item.childId}
            />
          )}
        />

      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.pinkButton}>
          <Text style={styles.buttonText}>Reportar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.greenButton} onPress={handleAction}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  backgroundTop: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0077b6',
    position: 'absolute',
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  profileImage: {
    width: 150,
    height: 150,
    top: "2%"
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    marginTop: "8%",
    width: '80%',
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    width: '100%',
    marginTop: 5,
  },
  textBlock1: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textBlock2: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    left: 35,
    paddingRight: "20%"
  },
  label: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 12,
    color: '#ffffff',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21.784,
    color: '#ffffff',
    textAlign: 'left',
    marginTop: 3,
  },
  infoContainer: {
    width: '73%',
    height: '7%',
    position: 'relative',
    zIndex: 12,
    marginTop: '1%',
  },
  infoBlock: {
    width: '37%',
    height: '7%',
    position: 'absolute',
    zIndex: 9,
  },
  backgroundBottom: {
    width: '100%',
    height: '55%',
    top: "49%",
    backgroundColor: '#ffffff',
    borderRadius: 15,
    position: 'absolute',
  },
  childBlock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'flex-start',
    paddingTop: 15,
  },
  childImage: {
    flex: 1,
    width: 100,
    height: 100,
    left: 15,
  },
  childTextContainer: {
    flex: 2,
    left: 30,
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  childTextBlock: {
    position: 'relative',
  },
  childLabel: {
    fontSize: 9,
    fontWeight: '400',
    lineHeight: 12,
    color: '#0077b6',
  },
  childValue: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21.784,
    color: '#0077b6',
    marginTop: 3,
  },
  flatList: {
    marginBottom: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: "5%",
    right: "5%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  greenButton: {
    backgroundColor: '#bbe41f',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  pinkButton: {
    backgroundColor: '#eb5290',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});