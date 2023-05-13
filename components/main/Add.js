import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
export default function Add({navigation}) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);
    const [imageTaken, setImageTaken] = useState(null);
    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null);
            setImageTaken(data.uri)
        }
    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result) {
            setImageTaken(result.assets[0].uri);
        }
    };


    return (
        <View style={{flex: 1}}>
            <View style={styles.camera}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={"1:1"}
                ></Camera>
            </View>
            <Button style={styles.button} onPress={toggleCameraType} title={"Flip Image"}>
                <Text style={styles.text}>Flip Camera</Text>
            </Button>
            <Button title={"Take Picture"} onPress={takePicture}/>
            <Button title={"Pick Images From Gallery"} onPress={pickImage}/>
            <Button title={"Save"} onPress={() => navigation.navigate("Save", {imageTaken})}/>
            {imageTaken && <Image source={{uri: imageTaken}} style={{flex: 1}}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        flexDirection: "row"
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
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
});
