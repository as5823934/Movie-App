import React from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Text, View, TouchableOpacity, Image  } from 'react-native';
import db from './tmdb'

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
      isLoading: true,
      dataSource: []
    }
  }

  componentDidMount(){
    return fetch('https://api.themoviedb.org/3/discover/movie?api_key=97b14acad53b20d73f2eda02d46da480&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.results,
        }, function(){
  
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  renderTop() {
    return(
      <View style={{alignItems: 'center', padding: 20, backgroundColor: 'yellow', marginBottom: 8}}>
        <Text style={{fontSize: 30}}>
          Movie App
        </Text>
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          marginVertical: 6
        }}
      >
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderBottomWidth: 0,
            backgroundColor: '#f5f5f5'
          }}
        >
          <View style={{ flexDirection: 'row', paddingVertical: 4, marginBottom: 1 }}>
            <Image
              style={{width: 90, height: 130}}
              source={{uri:'https://image.tmdb.org/t/p/w500'+ item.poster_path}}
            />
            <View style={{flexDirection: 'column', paddingLeft: 8}}>
              <Text style={{fontSize: 17,padding: 2, fontWeight: 'bold'}}>
                {item.title}
              </Text>
              <Text style={{fontSize: 15, padding: 2}}>
                Date: {item.release_date}
              </Text>
              <Text style={{fontSize: 15, padding: 2}}>
                Rating: {item.vote_average}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )  
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(  
      <View style={{flex: 1, paddingTop:20, backgroundColor: '#000'}}>
      {this.renderTop()}
        <FlatList
          data={this.state.dataSource}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
