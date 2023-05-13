import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
import {FontAwesome5} from '@expo/vector-icons';
import {ScrollView} from 'react-native-gesture-handler';
import {container, text, utils} from "../styles";

require("firebase/compat/firestore")

function Profile(props) {
    const [userPosts, setUserPost] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false)
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    useEffect(() => {
        const {currentUser, posts} = props;

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPost(posts);
            setLoading(false);
        } else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then(snapshot => {
                    if (snapshot.exists) {
                        props.navigation.setOptions({
                            title: snapshot.data().username,
                        })

                        setUser({uid: props.route.params.uid, ...snapshot.data()});
                        setFollowersCount(snapshot.data().followersCount); // Update followers count
                        setFollowingCount(snapshot.data().followingCount); // Update following count
                    }
                    setLoading(false)
                })
                .catch(error => {
                    console.error("Error getting user document:", error);
                });

            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "desc")
                .get()
                .then(snapshot => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {
                            id, ...data
                        }
                    })
                    setUserPost(posts)
                })
                .catch(error => {
                    console.error("Error getting user document:", error);
                });
        }
        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true)
        } else {
            setFollowing(false)
        }
    }, [props.route.params.uid, props.following, props.posts, props.currentUser])
    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({}).then(() => {
            console.log("Follow successful");
            setFollowersCount(prevCount => prevCount + 1); // Increment followers count
            setFollowingCount(prevCount => prevCount + 1);
        })
    }

    const onUnFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete().then(() => {
            console.log("Unfollow successful");
            setFollowersCount(prevCount => prevCount - 1); // Decrement followers count
            setFollowingCount(prevCount => prevCount - 1);
        })
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }
    if (loading) {
        return (
            <View style={{height: '100%', justifyContent: 'center', margin: 'auto'}}>
                <ActivityIndicator style={{alignSelf: 'center', marginBottom: 20}} size="large" color="lightgrey"/>
                <Text style={[text.notAvailable]}>Loading</Text>
            </View>
        )
    }
    if (user === null) {
        return (
            <View style={{height: '100%', justifyContent: 'center', margin: 'auto'}}>
                <FontAwesome5 style={{alignSelf: 'center', marginBottom: 20}} name="dizzy" size={40} color="black"/>
                <Text style={[text.notAvailable]}>User Not Found</Text>
            </View>
        )
    }
    console.log("User's posts" ,userPosts)
    console.log("User: ", user)
    return (
        <ScrollView style={[container.container, utils.backgroundWhite]}>

            <View style={[container.profileInfo]}>

                <View style={[utils.noPadding, container.row]}>

                    {user.image === 'default' ?
                        (
                            <FontAwesome5
                                style={[utils.profileImageBig, utils.marginBottomSmall]}
                                name="user-circle" size={80} color="black"/>
                        )
                        :
                        (
                            <Image
                                style={[utils.profileImageBig, utils.marginBottomSmall]}
                                source={{
                                    uri: user.image
                                }}
                            />
                        )
                    }

                    <View
                        style={[container.container, container.horizontal, utils.justifyCenter, utils.padding10Sides]}>

                        <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                            <Text style={[text.bold, text.large, text.center]}>{userPosts.length}</Text>
                            <Text style={[text.center]}>Posts</Text>
                        </View>
                        <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                            <Text style={[text.bold, text.large, text.center]}>{user.followersCount}</Text>
                            <Text style={[text.center]}>Followers</Text>
                        </View>
                        <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                            <Text style={[text.bold, text.large, text.center]}>{user.followingCount}</Text>
                            <Text style={[text.center]}>Following</Text>
                        </View>
                    </View>

                </View>


                <View>
                    <Text style={text.bold}>{user.name}</Text>
                    <Text style={[text.profileDescription, utils.marginBottom]}>{user.description}</Text>
                    {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                            <View style={[container.horizontal]}>
                                {following ? (
                                        <TouchableOpacity
                                            style={[utils.buttonOutlined, container.container, utils.margin15Right]}
                                            title="Following"
                                            onPress={() => onUnFollow()}>
                                            <Text style={[text.bold, text.center]}>Following</Text>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <TouchableOpacity
                                            style={[utils.buttonOutlined, container.container, utils.margin15Right, utils.backgroundBlue]}
                                            title="Follow"
                                            onPress={() => onFollow()}>
                                            <Text style={[text.bold, text.center, text.white]}>Follow</Text>
                                        </TouchableOpacity>

                                    )}

                                <TouchableOpacity
                                    style={[utils.buttonOutlined, container.container]}
                                    title="Follow"
                                    onPress={() => props.navigation.navigate('Chat', {user: user, uid: props.route.params.uid})}>
                                    <Text style={[text.bold, text.center]}>Message</Text>
                                </TouchableOpacity>
                            </View>
                        ) :
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <TouchableOpacity
                                style={[utils.buttonOutlined, {flex: 1}]}
                                onPress={() => props.navigation.navigate("Edit")}>
                                <Text style={[text.bold, text.center]}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{marginLeft: 10 ,justifyContent: "center", alignItems: "center" ,borderRadius: 10, borderWidth: 1, padding: 10, borderColor: "lightgrey"}}
                                onPress={() => {
                                    props.navigation.navigate("ChatList")
                                }}
                            >
                                <FontAwesome5 style={{alignSelf: 'center'}} name="paper-plane" size={26}/>
                            </TouchableOpacity>
                        </View>}
                </View>
            </View>

            <View style={[utils.borderTopGray]}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[container.containerImage, utils.borderWhite]}>
                            <Image style={container.image} source={{ uri: item.downloadUrl }} />
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile);
