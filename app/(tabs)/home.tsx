import React, { Component } from 'react';
import { StyleSheet, Image, FlatList, Animated, Easing } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';

const SPRING_CONFIG = { tension: 2, friction: 3 };

const entriesData = [
    {
        childName: 'Niño 1',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:00 am'
    },
    {
        childName: 'Niño 2',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:01 am'
    },
    {
        childName: 'Niño 3',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:03 am'
    },
    {
        childName: 'Niño 4',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:03 am'
    },
    {
        childName: 'Niño 5',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:04 am'
    },
    {
        childName: 'Niño 6',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:06 am'
    },
    {
        childName: 'Niño 7',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:20 am'
    },
    {
        childName: 'Niño 8',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:20 am'
    },
    {
        childName: 'Niño 9',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:20 am'
    },
    {
        childName: 'Niño 10',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:20 am'
    },
    {
        childName: 'Niño 11',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:20 am'
    },
    {
        childName: 'Niño 12',
        entryDate: 'Lunes 26 Junio 2024',
        entryHour: '8:20 am'
    },

];

type EntryProps = {
    childName: string;
    entryDate: string;
    entryHour: string;
};

const Entry: React.FC<EntryProps> = ({ childName, entryDate, entryHour }) => (
    <View style={styles.Entry}>
        <View style={styles.EntryGroup}>
            <Text style={styles.EntryName}>{childName}</Text>
            <Text style={styles.EntryDate}>{entryDate}</Text>
        </View>
        <Text style={styles.EntryHour}>{entryHour}</Text>
    </View>
);


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: new Animated.Value(1), // Valor inicial de escala (1 = sin cambio)
        };
    }
    componentDidMount() {
        this.startBreathingAnimation();
    }

    startBreathingAnimation() {
        Animated.sequence([
            Animated.spring(this.state.scale, {
                ...SPRING_CONFIG,
                toValue: 1.04, // Escala a 1.1 (expansión)
                useNativeDriver: true,
            }),
            Animated.spring(this.state.scale, {
                ...SPRING_CONFIG,
                toValue: 1, // Escala a 1 (contracción)
                useNativeDriver: true,
            }),
        ]).start(() => this.startBreathingAnimation()); // Repetir la animación
    }
    render() {
        const { scale } = this.state;

        return (
            <View style={styles.home} >

                <View style={styles.topGroup}>
                    <Image
                        style={styles.background}
                        source={require('../../assets/images/bkg.png')}
                    />
                    <Image
                        style={{ width: 81, height: 25, paddingBottom: 5 }}
                        source={require('../../assets/images/logo.png')}
                    />
                    <Animated.View style={[styles.circle1, { transform: [{ scale }] }]}>
                        <Animated.View style={[styles.circle2, { transform: [{ scale }] }]}>
                            <Animated.View style={[styles.circle3, { transform: [{ scale }] }]}>
                                <Animated.View style={[styles.circle4, { transform: [{ scale }] }]}>
                                    <Image
                                        style={{ aspectRatio: 1, height: "35%" }}
                                        source={require('../../assets/images/QR.png')}
                                    />
                                    <Text style={styles.verQr}>Ver QR</Text>
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                </View>
                <View style={styles.bottomGroup}>
                    <Text style={styles.entries}>Entradas</Text>
                    <View style={styles.Entrylist}>
                        <FlatList
                            data={entriesData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Entry
                                    childName={item.childName}
                                    entryDate={item.entryDate}
                                    entryHour={item.entryHour}
                                />
                            )}
                        />

                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    home: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        backgroundColor: "rgba(255,255,255,1)",
    },
    topGroup: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "10%",
        backgroundColor: "rgba(231,247,255,1)",
    },
    background: {
        position: "absolute",
        top: "40%",
        width: "100%",
        height: "80%",
    },
    circle1: {
        width: "70%",
        aspectRatio: 1,
        padding: "7%",
        top: "3%",
        borderRadius: 1000,
        backgroundColor: "rgba(239, 83, 143, 0.1)",
    },
    circle2: {
        width: "100%",
        height: "100%",
        padding: "13%",
        borderRadius: 1000,
        backgroundColor: "rgba(239, 83, 143, 0.2)",
    },
    circle3: {
        width: "100%",
        height: "100%",
        padding: "13%",
        borderRadius: 1000,
        backgroundColor: "rgba(239, 83, 143, 0.3)",
    },
    circle4: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "20%",
        borderRadius: 1000,
        backgroundColor: "rgba(239,83,143,1)",
    },
    verQr: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(255,255,255,1)",
        fontSize: 12,
        lineHeight: 12,
        fontWeight: "400",
        textAlign: "center",
        bottom: "35%",
        paddingTop: 5,
    },
    bottomGroup: {
        position: "absolute",
        top: "55%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "53%",
        paddingLeft: "4%",
        paddingRight: "4%",
        paddingTop: "8%",
        paddingBottom: "22%",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: "rgba(255,255,255,1)",
    },
    entries: {
        color: "rgba(0,119,182,1)",
        fontSize: 16,
        lineHeight: 16,
        fontWeight: "700",
    },
    Entrylist: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        paddingLeft: "6%",
        paddingRight: "6%",
        paddingTop: "6%",
        borderRadius: 10,
        backgroundColor: "rgba(245,247,250,1)",

    },
    EntryGroup: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(245,247,250,1)",
    },
    EntryName: {
        color: "rgba(76,94,102,1)",
        fontSize: 14,
        lineHeight: 14,
        fontWeight: "700",
    },
    EntryDate: {
        color: "rgba(105,112,115,1)",
        fontSize: 12,
        lineHeight: 12,
        fontWeight: "400",
    },
    EntryHour: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        color: "rgba(105,112,115,1)",
        fontSize: 12,
        lineHeight: 12,
        fontWeight: "700",
        textAlign: "right",
    },
    Entry: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: "rgba(245,247,250,1)",
    },
})


export default Home;
