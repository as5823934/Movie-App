import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { fetchDetailMovie, IMAGE_URL } from "../config_keys";
export default class DetailScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            id: this.props.navigation.getParam('data'),
            dataSource: []
        }   
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Detail',
    });

    componentDidMount() {
        this.getDetailMovie(this.state.id)
    }

    getDetailMovie = async (id) => {
        const data = await fetchDetailMovie(id);
        this.setState({
            isLoading: false,
            dataSource: data
        })
    }
    
    renderContent = () => {
        const data = this.state.dataSource
        return (
            <View
                style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 6,
                    backgroundColor:'black'
                }}
            >
                <View
                    style={{
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderBottomWidth: 0,
                        backgroundColor: '#f5f5f5',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 4, marginBottom: 1 }}>
                        <Image
                            style={{ width: 150, height: 230 }}
                            source={{ uri: IMAGE_URL + data.image_url }}
                        />
                        <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 8 }}>
                            <Text style={{ fontSize: 20, padding: 3, fontWeight: 'bold' }}>
                                Title: {data.title}
                            </Text>
                            <Text style={{ fontSize: 18, padding: 3 }}>
                                Date: {data.releaseDate}
                            </Text>
                            <Text style={{ fontSize: 18, padding: 3 }}>
                                Rating: {data.rating}
                            </Text>
                            <Text style={{ fontSize: 18, padding: 3 }}>
                                Rating: {data.runtime} mins
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{fontSize: 25, fontWeight: 'bold'}}>Overview:</Text>
                        <Text style={{ fontSize: 18}}>{data.overview}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <View style={{flex: 1, backgroundColor: 'black'}}>
                {this.renderContent()}
            </View>
        )
    }
}
