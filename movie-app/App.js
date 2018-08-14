import React from 'react';
import { StyleSheet, FlatList, TextInput, ActivityIndicator, Text, View, TouchableOpacity, Image  } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Constants } from 'expo';
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
      isLoading: true,
      dataSource: [],
      listToDisplay: [],
      searchKeyword: '',
      option: 'now_playing',
    }
  }

  componentDidMount(){
    this.fetchData()
  }

  fetchData = async() => {
    const option = this.state.option
    await fetch(`https://api.themoviedb.org/3/movie/${option}?api_key=97b14acad53b20d73f2eda02d46da480&language=en-US&page=1`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.results,
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  changePopularOption = () => {
    this.setState({
      option: 'popular'
    }, ()=> this.fetchData())
  }

  changeNowPlayingOption = () => {
    this.setState({
      option: 'now_playing'
    }, () => this.fetchData())
  }

  changeTopRatedOption = () => {
    this.setState({
      option: 'top_rated'
    }, () => this.fetchData())
  }

  renderTop() {
    return(
      <View style={{padding: 20, alignItems: 'center' , backgroundColor: 'black', marginBottom: 3}}>
        <Text style={{fontSize: 30, color: 'white'}}>
          Movie
        </Text>
        
      </View>
    );
  }

  renderBottomTab = () =>{
    console.log('footer');
    return(
    <View style={{flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', backgroundColor: 'lightgray', padding: 2, height: 50}}>
        <TouchableOpacity onPress={() => this.changePopularOption()}>
          <Icon name='fire' type='font-awesome' size={30} />
      </TouchableOpacity>
        <TouchableOpacity onPress={() => this.changeNowPlayingOption()}>
        <Icon name='film' type='font-awesome' size={30} />
      </TouchableOpacity>
        <TouchableOpacity onPress={() => this.changeTopRatedOption()}>
        <Icon name='star' type='font-awesome' size={30} />
      </TouchableOpacity>
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

  onPress = () => {
    if(this.state.searchKeyword === '') {
      return;
    }
    const tempArr = this.state.entireUserList.filter(x =>
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

  _deleteSearchText = () => {
    this.setState({ searchKeyword: '' });
    this._textInput.setNativeProps({ text: '' });
  }

  _returnCloseIcon = () => (
    <TouchableOpacity onPress={() => this._deleteSearchText()} flex={2} paddingRight={10}>
      <Icon name='close' marginRight={10} />
    </TouchableOpacity>
  )

  _returnSearchIcon = () => {
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
          }
          }
          returnKeyType='search'
          underlineColorAndroid={'transparent'}
        />

        {this.state.searchKeyword.trim() === '' ? this._returnSearchIcon() : this._returnCloseIcon()}
      </View>
    );
  }

  renderList = () => {
    if (this.state.searchKeyword === '') {
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

  render(){
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    
    return(  
      <View style={{flex: 1, backgroundColor: '#000', flexDirection: 'column', paddingTop: Constants.statusBarHeight}}>
      {this.renderTop()}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
});
