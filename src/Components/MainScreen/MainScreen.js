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

import API from '../../Services/API';

let pokemonNumber = 1,
  counter = 1;

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Names: [],
      loading: true,
      counter: counter,
      previousPage: '',
      nextPage: '',
      id: '',
    };

    this.CharacterScreen = this.CharacterScreen.bind(this);
    this.getID = this.getID.bind(this);
  }

  async componentDidMount() {
    counter = 1;
    this.setState({counter: 1});

    // Requisição dos nomes de cada pokemon e os links para as próximas páginas
    var response = await API.get();
    this.setState({
      Names: response.data.results,
      loading: false,
      nextPage: response.data.next,
      previousPage: response.data.previous,
    });
  }

  previousPage = async () => {
    // Verificação caso o usuário já permanece na primeira página
    if (counter !== 1) {
      counter--;
      this.setState({counter: counter});

      const {previousPage} = this.state;
      // Puxa os dados da página anterior
      var response = await API.get(previousPage);
      this.setState({
        Names: response.data.results,
        previousPage: response.data.previous,
        nextPage: response.data.next,
      });
    }
  };

  nextPage = async () => {
    // Verificação caso o usuário já permanece na última página
    if (counter !== 29) {
      counter++;
      this.setState({counter: counter});

      const {nextPage} = this.state;
      // Puxa os dados da página seguinte
      var response = await API.get(nextPage);
      this.setState({
        Names: response.data.results,
        previousPage: response.data.previous,
        nextPage: response.data.next,
      });
    }
  };

  especificPage = async (cont, offset) => {
    counter = cont;
    this.setState({counter: counter});

    // Puxa os dados da página específica da busca
    var response = await API.get(
      'https://pokeapi.co/api/v2/pokemon/?offset=' + offset + '&limit=20',
    );
    this.setState({
      Names: response.data.results,
      previousPage: response.data.previous,
      nextPage: response.data.next,
    });
  };

  CharacterScreen(id) {
    // Chama a próxima tela passando o id do pokemon selecionado
    this.props.navigation.navigate('Character', {id: id});
  }

  // Pega o type do pokemon
  // setPokemonGridColor = async value => {
  //   const response = await API.get(value + '/');
  //   this.setState({
  //     pokemonId: response.data.id,
  //   });

  //   const types = response.data.types.map(type => type.type.name);
  //   themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;
  //   this.setState({color: themeColor});
  // };

  renderItem = data => {
    // Define a numeração do pokemon
    const url = data.item.url;
    const pokemonNumber = url.split('/')[url.split('/').length - 2];
    // Pega a imagem do pokemon de acordo com sua numeração
    const imageUrl =
      'https://pokeres.bastionbot.org/images/pokemon/' + pokemonNumber + '.png';
    // Muda a primeira letra do nome do pokemon para maiúsculo
    const name = data.item.name;
    const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);
    // // Pega o type do pokemon

    // const types = pokemonNumber.data.types.map(type => type.type.name);
    // themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;
    // this.setState({color: themeColor});

    return (
      <View style={styles.gridContainer}>
        <TouchableOpacity onPress={() => this.CharacterScreen(pokemonNumber)}>
          <StatusBar backgroundColor="#fc474f" barStyle="light-content" />
          <View style={styles.gridButtons}>
            <Text style={styles.pokemonID}>{pokemonNumber}</Text>
            <Image
              resizeMode="contain"
              source={{uri: imageUrl}}
              style={styles.image}
            />
            <Text style={styles.font}>{pokemonName}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  getID = async value => {
    // Pega o id do pokemon de acordo com o nome ou id digitado
    const response = await API.get(value + '/');
    this.setState({
      id: response.data.id,
    });
    const valueId = parseInt(response.data.id);
    let page = Math.ceil(valueId / 20);
    let limit = (page - 1) * 20;

    // Faz a busca utilizando o id pesquisado
    if (valueId <= 0)
      Alert.alert(
        'Erro na busca!',
        'Não existem pokemons com ID menores ou iguais à zero!',
      );
    else if (valueId > 0 && valueId <= 807) {
      this.especificPage(page, limit);
    } else if (valueId != '' && valueId != null) {
      Alert.alert('Erro na busca!', 'O nome/ID digitado não foi encontrado!');
      this.especificPage(1, 1);
    } else this.especificPage(1, 1);
  };

  render() {
    const {Names, loading} = this.state;

    if (!loading) {
      return (
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Text style={styles.title}>Pokedéx</Text>
            <View style={styles.subHeader}>
              <Image
                source={require('../../../assets/imgs/search-icon.png')}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Buscar por nome ou ID..."
                onChangeText={value => this.getID(value.toLocaleLowerCase())}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>

          <View style={styles.containerArrows}>
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
              <Text style={styles.countFont}>{this.state.counter}</Text>
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
            data={Names}
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
    alignItems: 'center',
    justifyContent: 'center',
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
  font: {
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
  image: {
    height: 100,
    width: 100,
  },
  iconArrow: {
    color: 'white',
    height: 50,
    width: '20%',
  },
  imageSearch: {
    height: 20,
    width: 20,
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
  count: {
    marginTop: '2.55%',
    marginHorizontal: '5%',
    padding: '2%',
    marginBottom: '2.5%',
  },
  containerArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fc474f',
    width: '100%',
    height: 70,
  },
  countFont: {
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
