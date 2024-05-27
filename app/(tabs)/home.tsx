import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, FlatList, Animated, Easing, TouchableOpacity, View, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

let sheetAPI = 'https://sheetdb.io/api/v1/nkf1qqmfh8elz';
let recentEntry = "";
const SPRING_CONFIG = { tension: 2, friction: 3 };
let now = new Date();
let fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
const scale = new Animated.Value(1);

type EntryProps = {
    childName: string;
    entryDate: string;
    entryHour: string;
};

interface ScanArguments {
    data: string;
};

const entriesData: EntryProps[] = [];

const Entry: React.FC<EntryProps> = ({ childName, entryDate, entryHour }) => (
    <View style={styles.Entry}>
        <View style={styles.EntryGroup}>
            <Text style={styles.EntryName}>{childName}</Text>
            <Text style={styles.EntryDate}>{entryDate}</Text>
        </View>
        <Text style={styles.EntryHour}>{entryHour}</Text>
    </View>
);

export default function Home(): React.JSX.Element {
    const navigation = useNavigation();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(false);
    const [entryRecorded, setEntryRecorded] = useState(false);
    const { user } = useLocalSearchParams();
    const [entriesData, setEntriesData] = useState<EntryProps[]>([]);

    useEffect(() => {
        startBreathingAnimation();
        (async () => {
            await requestPermission();
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
          fetchEntriesData();
          return () => {
          };
        }, [])
      );

    const fetchEntriesData = async () => {
        try {
            const response = await axios.get(sheetAPI + "/search?date=" + fecha + "&action=E&sheet=record");
            setEntriesData(response.data);
            console.log(entriesData);
        } catch (error) {
            console.error(error);
        }
    };
    const startBreathingAnimation = () => {
        Animated.sequence([
            Animated.spring(scale, {
                ...SPRING_CONFIG,
                toValue: 1.04,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                ...SPRING_CONFIG,
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start(() => startBreathingAnimation());
    }

    const handleScanPress = () => {
        setIsScanning(true);
    };

    const goBack = () => {
        setIsScanning(false);
    };

    const handleBarcodeScanned = async ({ data }: ScanArguments) => {
        if (recentEntry != data) {
            // console.log("escaneado", data);

            recentEntry = data;

            try {
                const fatherReq = await axios.get(sheetAPI + "/search?id=" + data + "&sheet=fathers");
                const fatherData = fatherReq.data[0];
                const childsReq = await axios.get(sheetAPI + "/search?father_id=" + data + "&sheet=fatherHasChilds");
                const childsData = childsReq.data;
                router.navigate({
                    pathname: '/list',
                    params: {
                        fatherData: JSON.stringify(fatherData),
                        childsData: JSON.stringify(childsData),
                        user,
                    }
                });
            } catch (error) {
                console.log("Error al interactuar con la hoja de cálculo", error);
                Alert.alert('Error', 'Ocurrió un error al procesar el escaneo. Intente nuevamente.', [{ text: 'OK' }]);
            }
        }
    };

    if (!permission) {
        return <View style={styles.container}><Text>Solicitando permisos...</Text></View>;
    }

    if (!permission.granted) {
        return <View style={styles.container}><Text>Se necesitan permisos para la cámara</Text></View>;
    }

    return (
        <View style={styles.container}>
            {!isScanning && (
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
                                        <TouchableOpacity style={styles.qr_button} onPress={handleScanPress}>
                                            <Image
                                                style={{ aspectRatio: 1, height: "35%" }}
                                                source={require('../../assets/images/QR.png')}
                                            />
                                            <Text style={styles.verQr}>Escanear QR</Text>
                                        </TouchableOpacity>
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
            )}
            {isScanning && (
                <CameraView
                    style={styles.camera}
                    facing={"back"}
                    onBarcodeScanned={handleBarcodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={goBack}>
                            <Text style={styles.text}>Volver</Text>
                        </TouchableOpacity>
                    </View>

                </CameraView>
            )}
            <Toast />
        </View>

    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
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
        paddingTop: "10%",
        borderRadius: 1000,
        backgroundColor: "rgba(239,83,143,1)",
    },
    qr_button: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "20%",
        borderRadius: 1000,
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

    camera: {
        flex: 1,
        width: '100%',
    },
    scanButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        marginBottom: 20,
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'transparent',
        justifyContent: "flex-start",
        alignItems: "flex-start",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
})

