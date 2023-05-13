import {
    USER_FOLLOWING_STATE_CHANGE,
    USER_POST_STATE_CHANGE,
    USER_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE,
    CLEAR_DATA, USER_CHATS_STATE_CHANGE
} from "../constants";
import firebase from "firebase/compat";
require('firebase/compat/firestore')
export function fetchUser() {
    return dispatch => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    dispatch({
                        type: USER_STATE_CHANGE,
                        currentUser: {uid: firebase.auth().currentUser.uid, ...snapshot.data()}
                    })
                }
            })
    };
}

export function fetchUserPosts() {
    return dispatch => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then(docSnapshot => {
                let posts = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id, ...data
                    }
                })
                dispatch({type: USER_POST_STATE_CHANGE, posts: posts});
            })
    };
}

export function fetchUserFollowing() {
    return dispatch => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot(snapshot => {
                let following = snapshot.docs.map(doc => {
                    return doc.id;
                })
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following});
                for (let i = 0; i < following.length; ++i) {
                    dispatch(fetchUsersData(following[i], true));
                }
            })
    };
}

export function fetchUsersData(uid, getPosts) {
    return (
        (dispatch, getState) => {
            const found = getState().usersState.users.some(el => el.uid === uid)
            if (!found) {
                firebase.firestore()
                    .collection("users")
                    .doc(uid)
                    .get()
                    .then(docSnapshot => {
                        if (docSnapshot.exists) {
                            let user = docSnapshot.data();
                            user.uid = docSnapshot.id;
                            dispatch({type: USERS_DATA_STATE_CHANGE, user});
                        }
                    })
                if(getPosts)
                    dispatch(fetchUsersFollowingPosts(uid))
            }
        }
    )
}

export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then(docSnapshot => {
                let uid;
                if (docSnapshot.docs.length > 0)
                    uid = docSnapshot.docs[0].ref.path.split('/')[1];
                const user = getState().usersState.users.find(el => el.uid === uid)
                let posts = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data, user}
                })
                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
                }
                dispatch({type: USERS_POSTS_STATE_CHANGE, posts: posts, uid});
            })
    };
}

export function fetchUsersFollowingLikes(uid, postId) {
    return dispatch => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot(docSnapshot => {
                let currentUserLike = false;
                if (docSnapshot.exists) {
                    currentUserLike = true;
                }
                dispatch({type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike});
            })
    };
}

export function fetchUserChats() {
    return (dispatch => {
        firebase.firestore()
            .collection("chats")
            .where("users", "array-contains", firebase.auth().currentUser.uid)
            .orderBy("lastMessageTimestamp", "desc")
            .onSnapshot(docSnapshot => {
                let chats = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                for (let i = 0; i < chats.length; i++) {
                    let otherUserId;
                    if (chats[i].users[0] === firebase.auth().currentUser.uid) {
                        otherUserId = chats[i].users[1];
                    }
                    else {
                        otherUserId = chats[i].users[0];
                    }
                    dispatch(fetchUsersData(otherUserId, false))
                }
                dispatch({type: USER_CHATS_STATE_CHANGE, chats: chats})
            })
    })
}

export function queryUsersByUsername(username) {
    return ((dispatch, getState) => {
        return new Promise((resolve, reject) => {
            if (username.length === 0) {
                resolve([])
            }
            firebase.firestore()
                .collection('users')
                .where('username', '>=', username)
                .get()
                .then((snapshot) => {
                    let users = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    });
                    resolve(users);
                })
        })
    })
}

export function clearData() {
    return dispatch => {
        dispatch({ type: CLEAR_DATA })
    }
}