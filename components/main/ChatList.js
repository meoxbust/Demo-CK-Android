import React, {useEffect, useState} from "react";
import firebase from "firebase/compat";
import {Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchUsersData} from "../../redux/actions";
import {timeDifference} from "./ultils";
require("firebase/compat/firestore")

function Chat(props) {
    const [chats, setChats] = useState([])
    useEffect(() => {
        for (let i = 0; i < props.chats.length; i++) {
            if (props.chats[i].hasOwnProperty("otherUser")) {
                continue;
            }
            let otherUserId;
            if (props.chats[i].users[0] === firebase.auth().currentUser.uid) {
                otherUserId = props.chats[i].users[1];
            }
            else {
                otherUserId = props.chats[i].users[0];
            }
            const user = props.users.find(x => x.uid === otherUserId);
            if (user === undefined) {
                props.fetchUsersData(otherUserId, false);
            }
            else {
                props.chats[i].otherUser = user;
            }
        }
        setChats(props.chats)
    }, [props.chats, props.users])

    console.log(chats)

    return (
        <View style={[styles.container, {alignItems: "center"}]}>
            {chats.length !== 0 ?
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={chats}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <View style={!item[firebase.auth().currentUser.uid] ? {backgroundColor: "#d2eeff"} : null}>
                            <TouchableOpacity
                                style={[styles.horizontal, {padding: 15}]}
                                onPress={() => {
                                    props.navigation.navigate("Chat", {user: item.otherUser, uid: item.otherUser.uid})
                                }}>
                                <View>
                                    <Text style={{fontWeight: "bold"}}>{item.otherUser.name}</Text>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{marginRight: 15, marginBottom: 5, paddingBottom: 10}}>
                                        {item.lastMessage} {" "}
                                        {item.lastMessageTimestamp === null ? (
                                            <Text style={{marginBottom: 5, color: "grey"}}>Now</Text>
                                        ) : (
                                            <Text style={{marginBottom: 5, color: "grey"}}>
                                                {timeDifference(new Date(), item.lastMessageTimestamp.toDate())}
                                            </Text>
                                        )}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                :
                <View style={styles.container}>
                    <Text>No chat available!</Text>
                </View>
            }
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    chats: store.userState.chats,
    users: store.usersState.users,
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Chat);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImages: {
        flex: 1,
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        margin: 2
    },
    horizontal: {
        flexDirection: 'row',
        display: 'flex',
    },
})