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
  TextInput,
  StyleSheet,
} from 'react-native';

import API from '../Services/API';

let pokemonNumber = 1,
  counter = 1;

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Names: [],
      loading: true,
      color: '#fc474f',
      counter: counter,
      previousPage: '',
      nextPage: '',
      id: '',
    };

    //this.CharacterScreen = this.CharacterScreen.bind(this);
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
    if (counter == 1)
      Alert.alert(
        'Ação negada!',
        'Você já está na primeira página, não há páginas anteriores a esta!',
      );
    else {
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
    if (counter == 41)
      Alert.alert(
        'Ação negada!',
        'Você já está na última página, não há páginas após esta!',
      );
    else {
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

  // CharacterScreen(id) {
  //   // Chama a próxima tela passando o id do pokemon selecionado
  //   this.props.navigation.navigate('CharacterScreen', {id: id});
  // }

  renderItem = data => {
    // Define a numeração do pokemon
    const url = data.item.url;
    const pokemonNumber = url.split('/')[url.split('/').length - 2];
    // Pega a imagem do pokemon de acordo com sua numeração
    const imageUrl =
      'https://pokeres.bastionbot.org/images/pokemon/' + pokemonNumber + '.png';
      // Transforma a primeira letra em maiúsculo
    const name = data.item.name;
    const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);

    return (
      <TouchableOpacity
        style={styles.gridButton}
        onPress={() => ('')}>
        <StatusBar backgroundColor="#fc474f" barStyle="light-content" />
        <View style={[styles.grid, {backgroundColor: this.state.color}]}>
          <Text style={styles.indexFont}>{pokemonNumber}</Text>
          <Image
            resizeMode="contain"
            source={{uri: imageUrl}}
            style={styles.imagem}
          />
          <Text style={styles.fonte}>{pokemonName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  getID = async value => {
    // Pega o id do pokemon de acordo com o nome ou id digitado
    const response = await api.get(value + '/');
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
            <Text style={styles.presentationFont}>
              Pokedéx
            </Text>
            <View style={styles.containerHeader}>
              <Image
                resizeMode="contain"
                //source={require('../../img/loupe.png')}
                style={styles.imagemSearch}
              />
              <TextInput
                style={styles.input}
                placeholder="Buscar por nome ou ID..."
                onChangeText={value => this.getID(value.toLocaleLowerCase())}
              />
            </View>
          </View>
          <View>
            <View style={styles.containerArrows}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={this.previousPage}>
                <Image
                  resizeMode="contain"
                  //source={require('../../img/left-arrow.png')}
                  style={styles.imagemArrow}
                />
              </TouchableOpacity>

              <View style={styles.arrowButton}>
                <Text style={styles.count}>{this.state.counter}</Text>
              </View>

              <TouchableOpacity
                style={styles.arrowButton}
                onPress={this.nextPage}>
                <Image
                  resizeMode="contain"
                  //source={require('../../img/right-arrow.png')}
                  style={styles.imagemArrow}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              numColumns={2}
              data={Names}
              extraData={pokemonNumber}
              refreshing={true}
              renderItem={this.renderItem}
              keyExtractor={item => item}
              style={{marginBottom: '21.3%'}}
            />
          </View>
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
  grid: {
    flex: 1,
    margin: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 5.5,
    borderBottomWidth: 0,
  },
  gridButton: {
    backgroundColor: 'transparent',
    width: '50%',
  },
  fonte: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: '7%',
    marginBottom: '10%',
  },
  indexFont: {
    alignSelf: 'flex-start',
    marginLeft: '3%',
    marginTop: '2%',
    color: 'white',
  },
  presentationFont: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  imagem: {
    backgroundColor: 'transparent',
    height: 100,
    width: 100,
  },
  imagemArrow: {
    backgroundColor: 'transparent',
    height: 30,
    width: 30,
  },
  imagemSearch: {
    backgroundColor: 'transparent',
    height: 20,
    width: 20,
  },
  arrowButton: {
    backgroundColor: 'transparent',
    marginTop: '2.55%',
    marginHorizontal: '5%',
    padding: '2%',
    marginBottom: '2.5%',
  },
  containerArrows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  count: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#c3c3c3',
  },
  header: {
    height: '12%',
    width: '100%',
    backgroundColor: '#fc474f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: '2%',
  },
  input: {
    color: 'white',
    backgroundColor: 'white',
    padding: 10,
    fontSize: 14,
    borderRadius: 10,
    height: 36,
    width: '60%',
    textAlign: 'center',
  },
});
