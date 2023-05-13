import React, {useState} from "react";
import {Button, Image, TextInput, View} from "react-native";
import firebase from "firebase/compat";
import {NavigationContainer} from "@react-navigation/native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fetchUserPosts} from "../../redux/actions";

require("firebase/compat/firestore")
require("firebase/compat/storage")
export function Save(props, {navigation}){
    const imageUrl = props.route.params.imageTaken;
    const [caption, setCaption] = useState("");
    const uploadImage = async () => {
        const response = await fetch(imageUrl);
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        const blob = await response.blob();
        const task = firebase.storage()
            .ref()
            .child(childPath)
            .put(blob);
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = snapshot => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
            })
        }
        const taskError = snapshot => {
            console.log(snapshot);
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }
    const savePostData = (downloadUrl) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadUrl,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                likesCount: 0,
        }).then((function (){
            props.fetchUserPosts();
            props.navigation.popToTop();
        }))
    }
    return (
        <View style={{flex: 1}}>
            <Image source={{uri: imageUrl}} style={{flex: 1}} />
            <TextInput
                placeholder={"Write a Caption..."}
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title={"Save"} onPress={() => uploadImage()}/>
        </View>
    )
}

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserPosts }, dispatch);
export default connect(null, mapDispatchProps)(Save);