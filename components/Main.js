import React, {Component} from "react";
import {fetchUser, fetchUserFollowing, fetchUserPosts, clearData, fetchUserChats} from "../redux/actions/index";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import FeedScreen from "./main/Feed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";
import firebase from "firebase/compat";

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return  (
        <>
        </>
    )
}
export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
        this.props.fetchUserChats();
    }

    render() {
        return (
            <Tab.Navigator initialRouteName={"Feed"} labeled={false} activeColor={"#71717a"} inactiveColor={"#3f3f46"} barStyle={{ backgroundColor: '#f4f4f5' }}
            >
                <Tab.Screen name="Feed" component={FeedScreen}
                            options={{
                                tabBarIcon: ({color}) => (
                                    <MaterialCommunityIcons name={"home-outline"} color={color} size={26}/>
                                )
                            }}
                />
                <Tab.Screen name="Search" component={SearchScreen}
                            options={{
                                tabBarIcon: ({color}) => (
                                    <MaterialCommunityIcons name={"magnify"} color={color} size={26}/>
                                )
                            }}
                            navigation={this.props.navigation}
                />
                <Tab.Screen name="MainAdd" component={EmptyScreen}
                            listeners={({navigation}) => ({
                                tabPress: event => {
                                    event.preventDefault();
                                    navigation.navigate("Add");
                                }
                            })}
                            options={{
                                tabBarIcon: ({color}) => (
                                    <MaterialCommunityIcons name={"plus-box-outline"} color={color} size={26}/>
                                )
                            }}
                />
                <Tab.Screen name="Profile" component={ProfileScreen}
                            listeners={({navigation}) => ({
                                tabPress: event => {
                                    event.preventDefault();
                                    navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid});
                                }
                            })}
                            options={{
                                tabBarIcon: ({color}) => (
                                    <MaterialCommunityIcons name={"account-outline"} color={color} size={26}/>
                                )
                            }}
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing, clearData, fetchUserChats}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main);