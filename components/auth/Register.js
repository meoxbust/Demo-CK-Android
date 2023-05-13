import React, {useState} from "react";
import {View, Button, Text, TextInput, Image} from "react-native";
import {Snackbar} from "react-native-paper";
import firebase from "firebase/compat";
import {container, form} from "../styles";
import styles from "./style";

export default function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [isValid, setIsValid] = useState(true);

    const onSignUp = () => {
        if (name.length === 0 || username.length === 0 || email.length === 0 || password.length === 0) {
            setIsValid({bool: true, boolSnack: true, message: "Please fill out everything"})
            return;
        }
        if (password.length < 6) {
            setIsValid({bool: true, boolSnack: true, message: "passwords must be at least 6 characters"})
            return;
        }
        if (password.length < 6) {
            setIsValid({bool: true, boolSnack: true, message: "passwords must be at least 6 characters"})
            return;
        }
        firebase.firestore()
            .collection('users')
            .where('username', '==', username)
            .get()
            .then((snapshot) => {
                if (!snapshot.exist) {
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then(() => {
                            console.log(email, password)
                            if (snapshot.exist) {
                                return
                            }
                            firebase.firestore().collection("users")
                                .doc(firebase.auth().currentUser.uid)
                                .set({
                                    name,
                                    email,
                                    username,
                                    image: 'default',
                                    followingCount: 0,
                                    followersCount: 0,
                                })
                        })
                        .catch(() => {
                            setIsValid({bool: true, boolSnack: true, message: "Can't create account"})
                        })
                }
            }).catch(() => {
            setIsValid({bool: true, boolSnack: true, message: "Something went wrong"})
        })

    }
    return (
        <View style={[container.center]}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/Instagram.png")}
                    style={{height: 60, width: 200}}
                />
            </View>
            <View style={container.formCenter}>
                <TextInput
                    style={form.textInput}
                    placeholder="Username"
                    value={username}
                    keyboardType="twitter"
                    onChangeText={(username) => setUsername(username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').replace(/[^a-z0-9]/gi, ''))}
                />
                <TextInput
                    style={form.textInput}
                    placeholder="Full Name"
                    onChangeText={(name) => setName(name)}
                />
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
                    onPress={() => onSignUp()}
                    title="Sign Up"
                />
            </View>

            <View style={form.bottomButton} >
                <Text
                    onPress={() => props.navigation.navigate("Login")} >
                    Already have an account?
                    <Text style={styles.signUpText}> Sign In</Text>
                </Text>
            </View>
            <Snackbar
                visible={isValid.boolSnack}
                duration={2000}
                onDismiss={() => { setIsValid({ boolSnack: false }) }}>
                {isValid.message}
            </Snackbar>
        </View>
    );
}
