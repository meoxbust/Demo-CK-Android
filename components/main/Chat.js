import React, {useEffect, useRef, useState} from "react";
import firebase from "firebase/compat";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Provider} from 'react-native-paper';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchUserChats} from "../../redux/actions";
import {timeDifference} from "./ultils";
require("firebase/compat/firestore")

function Chat(props) {
    const [chat, setChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [flatList, setFlatList] = useState(null)
    const [initialFetch, setInitialFetch] = useState(false)

    useEffect(() => {
        if (initialFetch) {
            return;
        }
        const chat = props.chats.find(el => el.users.includes(props.route.params.uid));
        setChat(chat)
        if (chat !== undefined) {
            firebase.firestore()
                .collection("chats")
                .doc(chat.id)
                .collection("messages")
                .orderBy("creation", "asc")
                .onSnapshot(docSnapshot => {
                    let messages = docSnapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data}
                    })
                    setMessages(messages)
                })
            firebase.firestore()
                .collection("chats")
                .doc(chat.id)
                .update({
                    [firebase.auth().currentUser.uid]: true,
                })
            setInitialFetch(true)
        }
        else {
            createChat()
        }
    }, [props.chats])

    const createChat = () => {
        firebase.firestore()
            .collection("chats")
            .add({
                users: [firebase.auth().currentUser.uid, props.route.params.uid],
                lastMessage: "",
                lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                props.fetchUserChats();
            })
    }

    const onSend = () => {
        const textToSend = input;
        if (chat === undefined) {
            return;
        }
        if (input.length === 0) {
            return;
        }
        setInput("")

        firebase.firestore()
            .collection("chats")
            .doc(chat.id)
            .collection("messages")
            .add({
                creator: firebase.auth().currentUser.uid,
                text: textToSend,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })
        firebase.firestore()
            .collection("chats")
            .doc(chat.id)
            .update({
                lastMessage: textToSend,
                lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
                [chat.users[0]]: false,
                [chat.users[1]]: false
            })
    }

    return (
        <View style={[styles.container, {alignItems: "center"}]}>
            <Provider>
                <Text>To: {props.route.params.user.name}</Text>
                {messages.length !== 0 ?
                    <FlatList
                        numColumns={1}
                        horizontal={false}
                        data={messages}
                        ref={setFlatList}
                        onContentSizeChange={() => {
                            if (flatList !== null) {
                                flatList.scrollToEnd({animated: true})
                            }
                        }}
                        renderItem={({item}) => (
                            <View style={[styles.container, item.creator === firebase.auth().currentUser.uid ? styles.chatRight : styles.chatLeft, {padding: 10}]}>
                                {item.creator !== undefined && item.creation !== null ?
                                    <View style={styles.horizontal}>
                                        <View>
                                            <Text style={{marginBottom: 5}}>{item.text}</Text>
                                            <Text style={{marginBottom: 5, color: "white"}}>
                                                {timeDifference(new Date(), item.creation.toDate())}
                                                {/* {item.creation.toDate().toJSON()} */}
                                            </Text>
                                        </View>
                                    </View>
                                    : null}
                            </View>
                        )}
                    />
                    :
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text>No message was sent!</Text>
                    </View>
                }
                <View style={[styles.horizontal, {padding: 10, alignItems: "center"}]}>
                    <View style={[styles.horizontal, {justifyContent: "center", alignItems: "center"}]}>
                        <TextInput
                            value={input}
                            multiline={true}
                            style={[styles.fillHorizontal, styles.container, styles.input]}
                            placeholder="Message..."
                            onChangeText={input => setInput(input)}/>
                        <TouchableOpacity
                            onPress={() => onSend()}
                            style={{width: 100, alignSelf: 'center'}}>
                            <Text style={{color: "blue"}}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Provider>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    chats: store.userState.chats,
    following: store.userState.following,
    feed: store.usersState.feed,
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUserChats}, dispatch);

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
    chatRight: {
        margin: 10,
        marginBottom: 10,
        backgroundColor: 'dodgerblue',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-end'

    },
    chatLeft: {
        margin: 10,
        marginBottom: 10,
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 8,
        alignItems: 'flex-end',
        textAlign: 'right',
        alignSelf: 'flex-start'
    },
    horizontal: {
        flexDirection: 'row',
        display: 'flex',
    },
    input: {
        flexWrap: "wrap"
    },
    fillHorizontal: {
        flexGrow: 1,
        paddingBottom: 0
    },
})