import React, {useState} from "react";
import {View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, TouchableHighlight} from "react-native";
import {container, form} from "../styles";
import firebase from "firebase/compat";
import styles from "./style";
import { colors } from "../Theme/Colors";

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    const onSignIn = () => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => console.log("Sign in successfully!"))
    }
    return (
    <SafeAreaView style={container.center}>
        <View style = {styles.logoContainer}>
        <Image
            source={require("../../assets/insta-icon.png")}
            style={{ height: 140, width: 140 }}
          />
           <Image
            source={require("../../assets/Instagram.png")}
            style={{ height: 60, width: 200 }}
          />
         </View>
        <View style={container.center}>
            <View style={container.formCenter}>
                <TextInput
                    style={form.textInput}
                    placeholder="Email"
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    style={form.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <Button
                    style={form.button}
                    onPress={() => onSignIn()}
                    title="Sign In"
                />
            </View>
            <View style={form.bottomButton}>
            <TouchableOpacity style={styles.dontHaveAccount}>
                <Text
                    title="Register"
                    onPress={() => props.navigation.navigate("Register")}>
                <Text style={styles.donthaveAccountText}>Don’t have an account?</Text>
                 <Text style={styles.signUpText}> Sign up</Text>
                </Text>
            </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    )
}

