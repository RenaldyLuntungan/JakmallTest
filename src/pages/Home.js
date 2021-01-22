import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      initialData: [],
      tempData: [],
      refreshing: true,
      jokeLimit: true,
    };
  }

  componentDidMount = () => {
    this._fetchItem();
  };

  //function fetch data API
  _fetchItem = () => {
    return fetch('https://api.icndb.com/jokes/random/3')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson.value,
          initialData: [...responseJson.value],
          tempData: responseJson.value,
          refreshing: false,
        });
        console.log(this.state.dataSource);
      })
      .catch(error => {
        console.error(error);
      });
  };

  //function fetch more data API
  _fetchMore = () => {
    return fetch('https://api.icndb.com/jokes/random/1')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: [...this.state.dataSource, ...responseJson.value],
          tempData: [...this.state.tempData, ...responseJson.value],
          refreshing: false,
        });
        if (this.state.dataSource.length === 5) {
          this.setState({jokeLimit: false});
        }
        console.log(this.state.dataSource);
      })
      .catch(error => {
        console.error(error);
      });
  };

  //function loading before running function fetch more data API
  moreJoke = () => {
    this.setState({
      refreshing: true,
    });
    this._fetchMore();
  };

  //function splice the selected data to first index
  upData = index => {
    var array = [...this.state.dataSource];
    var arrayMove = [...this.state.dataSource];
    for (var check = 0; check < this.state.dataSource.length; check++) {
      if (this.state.dataSource[check].id === index) {
        index = check;
      }
    }
    for (var a = index; a >= 1; a--) {
      this.setState({
        tempData: this.state.dataSource.splice(a, 1, array[a - 1]),
      });
    }
    this.setState({
      tempData: this.state.dataSource.splice(0, 1, arrayMove[index]),
      dataSource: this.state.tempData,
    });

    this.setState({
      tempData: this.state.dataSource,
      dataSource: this.state.dataSource,
    });
    console.log(this.state.dataSource);
  };

  //function refresh to initial data
  refreshData = () => {
    if (this.state.dataSource.length === 3) {
      this.setState({
        dataSource: [...this.state.initialData],
      });
      console.log('refresh data', this.state.dataSource);
    } else {
      this.setState({
        dataSource: this.state.initialData,
        tempData: this.state.initialData,
        jokeLimit: true,
      });
      console.log('refresh data', this.state.dataSource);
    }
  };

  _itemComponent = ({item}) => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#f1f1f1', '#fee2e7', '#e3cacf']}
          style={{
            width: '80%',
            height: 140,
            borderRadius: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <View
              style={{
                flex: 3,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.actionFunction(item.joke)}>
                <Text>{item.joke}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.upData(item.id)}>
                <IconFontAwesome name="arrow-up" size={35} color={'#ee3124'} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  //separator to each flatlist items
  _separatorComponent = () => {
    return <View style={{backgroundColor: 'transparent', height: 20}} />;
  };

  //function action onPress to flatlist data
  actionFunction = joke => {
    Alert.alert('Joke', joke, [{text: 'Nice'}]);
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ee3124'}}>
        <View
          style={{
            width: '100%',
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 50,
            backgroundColor: '#f9a025',
          }}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>
            By Renaldy Luntungan
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            borderTopRightRadius: 50,
            backgroundColor: '#ee3124',
          }}>
          <View
            style={{
              width: '100%',
              height: 40,
              backgroundColor: '#f9a025',
            }}>
            <View
              style={{
                width: '100%',
                height: 50,
                borderTopRightRadius: 50,
                backgroundColor: '#ee3124',
              }}
            />
          </View>
          <FlatList
            data={this.state.dataSource}
            renderItem={this._itemComponent}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={this._separatorComponent}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.refreshData}
              />
            }
          />
        </View>
        <View
          style={{
            height: 50,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-end',
            alignSelf: 'center',
            backgroundColor: '#f9a025',
          }}>
          <View
            style={{
              height: 50,
              width: '100%',
              borderBottomLeftRadius: 50,
              position: 'absolute',
              left: 0,
              backgroundColor: 'red',
            }}
          />
          {this.state.jokeLimit ? (
            <TouchableOpacity
              onPress={this.moreJoke}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{fontWeight: 'bold', color: 'white', marginRight: 10}}>
                More Joke
              </Text>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f9a025',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 20,
                }}>
                <IconFontAwesome name="plus" size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
