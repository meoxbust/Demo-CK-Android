import React, {useState} from "react";
import {FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View, ScrollView} from "react-native";
import firebase from "firebase/compat";
import styles from "../../components/auth/style";
require("firebase/compat/firestore")
require("firebase/compat/storage")
import Icon from 'react-native-vector-icons/FontAwesome';
import {utils, container, text} from "../styles";
export default function Search(props){
    const [users, setUsers] = useState([])
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection("users")
            .where("name", ">=", search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return  {
                        id, ...data
                    }
                })
                setUsers(users)
            })
    }
    return (
        <SafeAreaView style={{padding: 10, backgroundColor: "white"}}>
            <View style={{ marginVertical: 30, paddingHorizontal: 20 }}>
                <TextInput
                    style={utils.searchBar}
                    placeholder="Type Here..."
                    onChangeText={(search) => fetchUsers(search)} />
            </View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={[container.horizontal, utils.padding10Sides, utils.padding10Top, { borderRadius: 20}]}
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}  >
                        <ScrollView style ={styles.scrollView}>
                            <View style={[utils.justifyCenter, {paddingLeft: 10, borderRadius: 20, backgroundColor: "transparent"}]}>
                                <Text style={text.username}>{item.username}</Text>
                                <Text style={text.name} >{item.name}</Text>
                            </View>
                        </ScrollView>
                    </TouchableOpacity>
                )}/>
        </SafeAreaView>
    )
}