import React from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, Dimensions, FlatList } from 'react-native';

const childsData=[
  {
    childName: "Josefina Vazquez",
    childId: "12340",
  },
  {
    childName: "Marco Vazquez",
    childId: "12341",
  },
  {
    childName: "Alexa Vazquez",
    childId: "12342",
  },

];
type ChildProps = {
  childName: string;
  childId: string;
};

const Child: React.FC<ChildProps> = ({ childName, childId }) => (
  <View style={styles.childBlock}>
    <Image
      style={styles.childImage}
      source={require('../../assets/images/child_placeholder.png')}
    />
    <View style={styles.childTextContainer}>
      <View style={styles.childTextBlock}>
        <Text style={styles.childLabel}>Nombre del estudiante:</Text>
        <Text style={styles.childValue}>Josefina Vázquez</Text>
      </View>
      <View style={styles.childTextBlock}>
        <Text style={styles.childLabel}>No. Id</Text>
        <Text style={styles.childValue}>123456789</Text>
      </View>
    </View>
  </View>
);

export default function Profile(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundTop}>
        <Image
          style={styles.profileImage}
          source={require('../../assets/images/father_placeholder.png')}
        />
        <View style={styles.textContainer}>
          <View style={styles.textRow}>
            <View style={styles.textBlock1}>
              <Text style={styles.label}>Nombre del Padre:</Text>
              <Text style={styles.value}>Pedro Vázquez</Text>
            </View>
            <View style={styles.textBlock2}>
              <Text style={styles.label}>Dirección</Text>
              <Text style={styles.value} numberOfLines={3}>col. lomas, 5 de febrero #142</Text>
            </View>
          </View>
          <View style={styles.textRow}>
            <View style={styles.textBlock1}>
              <Text style={styles.label}>No. Id</Text>
              <Text style={styles.value}>123456789</Text>
            </View>
            <View style={styles.textBlock2}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value} >
                555-1234
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.backgroundBottom}>
        <FlatList
          style={styles.flatList}
          data={childsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Child 
              childName={item.childName}
              childId={item.childId}
            />
          )}
        />
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
    top: "7%"
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    marginTop: "16%",
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
    top: "55%",
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
    width: 115,
    height: 115,
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
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 12,
    color: '#0077b6',
  },
  childValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21.784,
    color: '#0077b6',
    marginTop: 3,
  },
  flatList: {
    marginBottom: 80,
  }
});
