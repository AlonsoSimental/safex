import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, FlatList, Animated, Easing, TouchableOpacity, View, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import axios from 'axios';

let sheetAPI = 'https://sheetdb.io/api/v1/nkf1qqmfh8elz';
let recentEntry = "";
const SPRING_CONFIG = { tension: 2, friction: 3 };

type EntryProps = {
    childName: string;
    entryDate: string;
    entryHour: string;
};

interface ScanArguments {
    data: string;
}

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
const scale = new Animated.Value(1);

export default function Home() {

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(false);
    const [entryRecorded, setEntryRecorded] = useState(false);
    const [X, setX] = useState(0);
    const [Y, setY] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        startBreathingAnimation();
        (async () => {
            await requestPermission();
        })();
    }, []);

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
            recentEntry = data;
            const now = new Date();
            const fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            const hora = now.getHours();
            const minutos = now.getMinutes().toString().padStart(2, '0');
            const horaymin = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            // try {
            //     // Consultar todos los registros del día
            //     const response = await axios.get(sheetAPI);
            //     const registrosDelDia = response.data;
            //     console.log(registrosDelDia)

            //     // Filtrar los registros para encontrar los que coinciden con el ID del alumno
            //     const registrosAlumno = registrosDelDia.filter(registro => registro.Fecha === fecha && registro.ID === data);

            //     let registro = { Fecha: fecha, ID: data, Registro: '', Hora: `${hora}:${minutos}` };
            //     let mensajeAlerta = '';

            //     // Lógica para determinar si se registra una entrada o salida
            //     if ((hora >= 7 && hora < 9) || registrosAlumno.length === 0) {
            //       registro.Registro = 'E'; // Entrada
            //       mensajeAlerta = `ID alumno: ${data}\nEntrada registrada correctamente\nHora: ${hora}:${minutos}`;
            //     } else {
            //       const entradaExistente = registrosAlumno.some(reg => reg.Registro === 'E');
            //       if (entradaExistente) {
            //         const ultimoRegistro = registrosAlumno[registrosAlumno.length-1];
            //         if(ultimoRegistro.Registro === 'S') {
            //           registro.Registro = 'E'; // Entrada fuera de tiempo
            //           mensajeAlerta = `ID alumno: ${data}\nEntrada fuera de tiempo registrada correctamente\nHora: ${hora}:${minutos}`;
            //         }else {
            //           registro.Registro = 'S'; // Salida
            //           mensajeAlerta = `ID alumno: ${data}\nSalida registrada correctamente\nHora: ${hora}:${minutos}`;
            //         }
            //       } else {
            //         registro.Registro = 'E'; // Entrada fuera de tiempo
            //         mensajeAlerta = `ID alumno: ${data}\nEntrada fuera de tiempo registrada correctamente\nHora: ${hora}:${minutos}`;
            //       }
            //     }

            //     // Enviar el nuevo registro al spreadsheet
            //     await axios.post(sheetAPI, registro);

            //     Alert.alert('Código QR Escaneado', mensajeAlerta, [{ text: 'OK', onPress: () => setIsScanning(true) }], { cancelable: false });
            //   } catch (error) {
            //     console.error("Error al interactuar con la hoja de cálculo", error);
            //     Alert.alert('Error', 'Ocurrió un error al procesar el escaneo. Intente nuevamente.', [{ text: 'OK' }]);
            //   }
            try {
                let action = "";
                const response2 = await axios.get(sheetAPI+"/search?id="+data+"&date="+fecha+"&sheet=Sheet2");
                let entries= response2.data;
                if (entries.length == 0) {
                    action = "E";
                } else {
                    const lastEntry = entries[entries.length-1];
                    if(lastEntry.action == "E"){
                        action = "S";
                    } else {
                        action = "E";
                    }
                }
                await axios.post(sheetAPI+"?sheet=Sheet2", {id: data, date: fecha, hour: horaymin, action: action});
                if(action == "E"){
                    const response = await axios.get(sheetAPI+"/search?id="+data);
                    let entry = response.data[0];
                    const newEntry: EntryProps = {
                        childName: entry.name,
                        entryDate: fecha,
                        entryHour: horaymin
                    };
                    entriesData.push(newEntry);
                }    

                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'QR escaneado con éxito',
                    visibilityTime: 2000, 
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 40,
                    onShow: () => {},
                    onHide: () => {} 
                });
            } catch (error) {
                console.log("Error al interactuar con la hoja de cálculo", error);
                Alert.alert('Error', 'Ocurrió un error al procesar el escaneo. Intente nuevamente.', [{ text: 'OK' }]);
            }   
            

            
        }
        // setIsScanning(false);
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
                    facing={facing}
                    onBarcodeScanned={handleBarcodeScanned}
                    barCodeScannerSettings={{
                        barCodeTypes: ['qr'],
                    }}
                >
                     <View style={{
                        position: 'absolute',
                        top: Y, 
                        left: X, 
                        width: width, 
                        height: height, 
                        borderColor: 'green', 
                        borderWidth:2, 
                        backgroundColor: 'transparent'
                    }}>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={goBack}>
                            <Text style={styles.text}>Volver atras</Text>
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

