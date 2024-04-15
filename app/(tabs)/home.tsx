import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';

export default function Home() {

    return (
        <View style={styles.home}>

            <View style={styles.topGroup}>
                <Image
                    style={styles.background}
                    source={require('../../assets/images/bkg.png')}
                />
                <Image
                    style={{ width: 81, height: 25, paddingBottom: 5 }}
                    source={require('../../assets/images/logo.png')}
                />
                <View style={styles.circle1}>
                    <View style={styles.circle2}>
                        <View style={styles.circle3}>
                            <View style={styles.circle4}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('../../assets/images/QR.png')}
                                />
                                <Text style={styles.verQr}>Ver QR</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.bottomGroup}>
        <Text style={styles.entradas}>Entradas</Text>
      </View>

        </View>
    )
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
        paddingTop: 66,
        backgroundColor: "rgba(231,247,255,1)",
    },
    background: {
        position: "absolute",
        top: 330,
        width: "100%",
        height: 556,
    },
    circle1: {
        width: 300,
        height: 300,
        padding: 34,
        top: 30,
        borderRadius: 1000,
        backgroundColor: "rgba(239, 83, 143, 0.1)",
    },
    circle2: {
        width: "100%",
        height: "100%",
        padding: 32,
        borderRadius: 1000,
        backgroundColor: "rgba(239, 83, 143, 0.2)",
    },
    circle3: {
        width: "100%",
        height: "100%",
        padding: 19,
        borderRadius: 1000,
        backgroundColor: "rgba(239, 83, 143, 0.25)",
    },
    circle4: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingLeft: 46,
        paddingRight: 47,
        paddingTop: 39,
        paddingBottom: 40,
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
        paddingTop: 5,
    },
    bottomGroup: {
        position: "absolute",
        top: 460,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: 419,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 29,
        paddingBottom: 81,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: "rgba(255,255,255,1)",
    },
    entradas: {
        color: "rgba(0,119,182,1)",
        fontSize: 16,
        lineHeight: 16,
        fontWeight: "700",
    },
})



