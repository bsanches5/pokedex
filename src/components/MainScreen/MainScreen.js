import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import API from '../../services/API';

let pokemonNumber = 1,
  counter = 1;

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      names: [],
      loading: true,
      counter: counter,
      previousPage: '',
      nextPage: '',
      id: '',
    };

    this.CharacterScreen = this.CharacterScreen.bind(this);
    this.getPokemonID = this.getPokemonID.bind(this);
  }

  async componentDidMount() {
    counter = 1;
    this.setState({counter: 1});

    // Requisição dos nomes de cada pokemon e os links para as próximas páginas
    var response = await API.get();
    // console.log(response);
    this.setState({
      names: response.data.results,
      loading: false,
      nextPage: response.data.next,
      previousPage: response.data.previous,
    });
  }

  previousPage = async () => {
    // Verificaça se o usuário está na primeira página
    if (counter !== 1) {
      counter--;
      this.setState({counter: counter});

      const {previousPage} = this.state;
      // Puxa os dados da página anterior
      var response = await API.get(previousPage);
      this.setState({
        names: response.data.results,
        previousPage: response.data.previous,
        nextPage: response.data.next,
      });
    }
  };

  nextPage = async () => {
    // Verifica se o usuário está na última página
    if (counter !== 29) {
      counter++;
      this.setState({counter: counter});

      const {nextPage} = this.state;
      // Puxa os dados da página seguinte
      var response = await API.get(nextPage);
      this.setState({
        names: response.data.results,
        previousPage: response.data.previous,
        nextPage: response.data.next,
      });
    }
  };

  especificPage = async (count, offset) => {
    counter = count;
    this.setState({counter: counter});

    // Puxa os dados da página específica da busca
    var response = await API.get(
      'https://pokeapi.co/api/v2/pokemon/?offset=' + offset + '&limit=20',
    );
    this.setState({
      names: response.data.results,
      previousPage: response.data.previous,
      nextPage: response.data.next,
    });
  };

  CharacterScreen(id) {
    // Chama a próxima tela passando o id do pokemon selecionado
    this.props.navigation.navigate('Character', {id: id});
  }

  renderItem = data => {
    const url = data.item.url;
    const pokemonNumber = url.split('/')[url.split('/').length - 2];
    // Pega a imagem do pokemon de acordo com sua numeração
    const imageUrl =
      'https://pokeres.bastionbot.org/images/pokemon/' + pokemonNumber + '.png';
    // Muda a primeira letra do nome do pokemon para maiúsculo
    const name = data.item.name;
    const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);

    return (
      <View style={styles.gridContainer}>
        <TouchableOpacity onPress={() => this.CharacterScreen(pokemonNumber)}>
          <StatusBar backgroundColor="#fc474f" barStyle="light-content" />
          <View style={styles.gridButtons}>
            <Text style={styles.pokemonID}>{pokemonNumber}</Text>
            <Image
              resizeMode="contain"
              source={{uri: imageUrl}}
              style={styles.images}
            />
            <Text style={styles.nomePokemon}>{pokemonName}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  getPokemonID = async value => {
    // Pega o id do pokemon de acordo com o nome ou id digitado
    const response = await API.get(value + '/');
    this.setState({
      id: response.data.id,
    });
    const idNumber = parseInt(response.data.id);
    let page = Math.ceil(idNumber / 20);
    let limit = (page - 1) * 20;

    // Faz a busca utilizando o id pesquisado
    if (idNumber > 0 && idNumber <= 807) {
      this.especificPage(page, limit);
    } else if (idNumber != '' && idNumber != null) {
      Alert.alert('Error!', 'Name or ID not found!');
      this.especificPage(1, 1);
    } else this.especificPage(1, 1);
  };

  render() {
    const {names, loading} = this.state;

    if (!loading) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Pokedéx</Text>
            <View style={styles.subHeader}>
              <Image
                source={require('../../../assets/imgs/search-icon.png')}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Search for name or ID..."
                onChangeText={value =>
                  this.getPokemonID(value.toLocaleLowerCase())
                }
                underlineColorAndroid="transparent"
              />
            </View>
          </View>

          <View style={styles.arrowsContainer}>
            <View style={{flex: 1}}>
              {this.state.counter === 1 ? null : (
                <TouchableOpacity
                  style={styles.arrowButtonLeft}
                  onPress={this.previousPage}>
                  <Icon name="arrow-alt-circle-left" size={35} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.counterText}>{this.state.counter}</Text>
            </View>

            <View style={{flex: 1}}>
              {this.state.counter === 29 ? null : (
                <TouchableOpacity
                  style={styles.arrowButtonRight}
                  onPress={this.nextPage}>
                  <Icon name="arrow-alt-circle-right" size={35} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            numColumns={2}
            data={names}
            extraData={pokemonNumber}
            refreshing={true}
            renderItem={this.renderItem}
            keyExtractor={item => item}
            resizeMode="contain"
          />
        </View>
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fc474f',
  },
  gridButtons: {
    margin: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 5.5,
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
  gridContainer: {
    backgroundColor: '#fc474f',
    width: '50%',
  },
  nomePokemon: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: '7%',
    marginBottom: '10%',
  },
  pokemonID: {
    alignSelf: 'flex-start',
    marginLeft: '3%',
    marginTop: '2%',
    color: '#000',
    fontSize: 18,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  images: {
    height: 100,
    width: 100,
  },
  arrowButtonLeft: {
    marginTop: '2.55%',
    padding: '2%',
    paddingLeft: 20,
    marginBottom: '2.5%',
    alignSelf: 'flex-start',
  },
  arrowButtonRight: {
    marginTop: '2.55%',
    padding: '2%',
    paddingRight: 20,
    marginBottom: '2.5%',
    alignSelf: 'flex-end',
  },
  arrowsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fc474f',
    width: '100%',
    height: 70,
  },
  counterText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#FFF',
    alignSelf: 'center',
  },
  header: {
    height: '15%',
    width: '100%',
    backgroundColor: '#fc474f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  input: {
    color: '#000',
    backgroundColor: 'white',
    padding: 10,
    fontSize: 14,
    borderRadius: 10,
    height: 36,
    width: '60%',
    textAlign: 'center',
  },
  searchIcon: {
    padding: 13,
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
