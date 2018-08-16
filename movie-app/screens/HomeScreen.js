import React from 'react';
import { StyleSheet, FlatList, TextInput, ActivityIndicator, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Constants } from 'expo';
import { fetchData, IMAGE_URL } from "../config_keys";

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            listToDisplay: [],
            searchKeyword: '',
            option: 'now_playing',
        }
    }

    componentDidMount() {
        this.getData(this.state.option)
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Movie',
    });

    getData = async (option) => {
        const data = await fetchData(option);
        this.setState({
            isLoading: false,
            dataSource: data
        })
    }

    changePopularOption = () => {
        this.setState({
            isLoading: true,
            option: 'popular'
        }, () => this.getData(this.state.option))
    }

    changeNowPlayingOption = () => {
        this.setState({
            isLoading: true,
            option: 'now_playing'
        }, () => this.getData(this.state.option))
    }

    changeTopRatedOption = () => {
        this.setState({
            isLoading: true,
            option: 'top_rated'
        }, () => this.getData(this.state.option))
    }

    renderBottomTab = () => {
        return (
            <View style={styles.bottomTabStyle}>
                <TouchableOpacity onPress={() => this.changePopularOption()}>
                    <Icon name='fire' type='font-awesome' size={30} color={this.state.option === 'popular' ? 'tomato':'gray'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeNowPlayingOption()}>
                    <Icon name='film' type='font-awesome' size={30} color={this.state.option === 'now_playing' ? 'tomato' : 'gray'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeTopRatedOption()}>
                    <Icon name='star' type='font-awesome' size={30} color={this.state.option === 'top_rated' ? 'tomato' : 'gray'}/>
                </TouchableOpacity>
            </View>
        );
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 6,
                }}
                onPress={() => this.props.navigation.navigate('DetailPage', {data: item.id})}
            >
                <View
                    style={{
                        flex: 1,
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                        borderBottomWidth: 0,
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 4, marginBottom: 1 }}>
                        <Image
                            style={{ width: 110, height: 160 }}
                            source={{ uri: IMAGE_URL + item.image_url }}
                        />
                        <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 8 }}>
                            <Text style={{ fontSize: 17, padding: 2, fontWeight: 'bold' }}>
                                {item.title}
                            </Text>
                            <Text style={{ fontSize: 15, padding: 2 }}>
                                Date: {item.releaseDate}
                            </Text>
                            <Text style={{ fontSize: 15, padding: 2 }}>
                                Rating: {item.rating}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    onPress = () => {
        if (this.state.searchKeyword === '') {
            return;
        }
        const tempArr = this.state.dataSource.filter(x =>
            this.isSearched(x.title.toLowerCase(), this.state.searchKeyword)
        );

        this.setState({ listToDisplay: tempArr });
    }

    autoSearch = (keyword) => {
        this.setState({ searchKeyword: keyword });

        const tempArr = this.state.dataSource.filter(x =>
            this.isSearched(`${x.title.toLowerCase()}`, keyword.toLowerCase())
        );

        this.setState({ listToDisplay: tempArr });
        console.log(this.state.listToDisplay)
    }

    isSearched = (target, keyword) => {
        if (target.search(keyword) >= 0) {
            return true;
        }
        return false;
    }

    deleteSearchText = () => {
        this.setState({ searchKeyword: '' });
        if (Platform.OS === 'ios') {
            this._textInput.setNativeProps({ text: ' ' });
        }
        setTimeout(() => {
            this._textInput.setNativeProps({ text: '' });
        });
    }

    returnCloseIcon = () => (
        <TouchableOpacity onPress={() => this.deleteSearchText()} flex={2} paddingRight={10}>
            <Icon name='close' marginRight={10} />
        </TouchableOpacity>
    )

    returnSearchIcon = () => {
        console.log('there is no search texts');
        return (
            <TouchableOpacity onPress={() => this.onPress()} flex={2} paddingRight={10}>
                <Icon name='search' marginRight={10} />
            </TouchableOpacity>
        );
    }

    renderSearchBar() {
        return (
            <View style={styles.searchBarStyle} >
                <TextInput
                    paddingLeft={10}
                    autoCapitalize='none'
                    flex={5}
                    placeholder='search'
                    fontSize={18}
                    autoCorrect={false}
                    ref={component => (this._textInput = component)}
                    onChangeText={(value) => {
                        this.autoSearch(value);
                        this.setState({ searchKeyword: value });
                        console.log(value);
                    }}
                    returnKeyType='search'
                    underlineColorAndroid={'transparent'}
                />

                {this.state.searchKeyword.trim() === '' ? this.returnSearchIcon() : this.returnCloseIcon()}
            </View>
        );
    }

    renderList = () => {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }
        if (this.state.searchKeyword.trim() === '') {
            return (
                <FlatList
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ backgroundColor: 'black' }}
                />
            )
        } else {
            return (
                <FlatList
                    data={this.state.listToDisplay}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderTop()} */}
                {this.renderSearchBar()}
                {this.renderList()}
                {this.renderBottomTab()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'darkgray',
        flexDirection: 'column',
        //paddingTop: Constants.statusBarHeight
    },
    searchBarStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        borderBottomColor: '#efefef',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    topStyle: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'lightgray',
        marginBottom: 3
    },
    bottomTabStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        padding: 2,
        height: 50
    }
});
