import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image, Button, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
require("firebase/compat/firestore")
import Icon from 'react-native-vector-icons/FontAwesome';
import {Feather} from "@expo/vector-icons";
import {utils, container} from "../styles";

function Feed(props){
    const [posts, setPosts] = useState(props.feed.map(post => ({ ...post, likesCount: 0})))
    useEffect(() => {
        if (props.usersFollowingLoaded === (props.following.length ?? 0)) {
            props.feed.sort((x, y) => {
                return x.creation - y.creation;
            })
            setPosts(props.feed)
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = async (userId, postId) => {
        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})

        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({"likesCount": firebase.firestore.FieldValue.increment(1)})
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId && post.user.uid === userId) {
                    return {
                        ...post,
                        likesCount: post.likesCount + 1,
                        currentUserLike: true,
                    };
                }
                return post;
            })
        );
    }
    const onDislikePress = async (userId, postId) => {
        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()

        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({"likesCount": firebase.firestore.FieldValue.increment(-1)});
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId && post.user.uid === userId) {
                    return {
                        ...post,
                        likesCount: post.likesCount,
                        currentUserLike: false,
                    };
                }
                return post;
            })
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.containerImages}>
                            <View style = {styles.row}>
                                <TouchableOpacity
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                    onPress={() => props.navigation.navigate("ProfileOther", { uid: item.user.uid})}
                                >
                                    <Image
                                        style={{ width: 40, height: 40, marginLeft: 10, marginRight: 10, borderRadius: 40 }}
                                        resizeMode="contain"
                                        source={{ uri: item.user.image }}
                                    />
                                    <Text style={styles.UserName}>{item.user.name}</Text>
                                </TouchableOpacity>
                            </View>
                                <Text style={styles.Caption}> {item.caption}</Text>
                                <Image style={styles.image} source={{uri: item.downloadUrl}}/>  
                            <View style = {styles.row}>
                                <View style={[utils.padding10, container.horizontal]}>
                                    {item.currentUserLike ?
                                        (
                                            <Feather name="heart" size={30} color="red" onPress={() => onDislikePress(item.user.uid, item.id)} />
                                        )
                                        :
                                        (
                                            <Feather name="heart" size={30} color="black" onPress={() => onLikePress(item.user.uid, item.id)} />
                                        )
                                    }
                                </View>
                             <Text style={{ fontSize: 20, color: 'red', fontWeight: 'bold'}}>{item.likesCount} </Text>
                            <View style = {styles.Icon}>
                              <TouchableOpacity  onPress={() => {
                                    props.navigation.navigate("Comment", {postId: item.id, uid: item.user.uid})
                                }}>
                                <Icon name="comment-o" size={30} color="black"  />
                            </TouchableOpacity>
                            </View>
                            </View> 
                        </View>
                    )
                    }
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed);

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
        marginTop: 20
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        margin: 2
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    UserName:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#020617'
    },
    Heart:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#900',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    },
    Caption: {
        padding: 10,
        fontSize: 16
    },
    Icon: {
        marginLeft: 10,
        marginRight: 10
    }
})