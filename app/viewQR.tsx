import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';

export default function List() {

    return(

        <View style={styles.container}>
            <Text>ver QR sin tabs</Text>
        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 70,
        backgroundColor: '#fff',
    }

});



