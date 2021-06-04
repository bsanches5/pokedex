import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ProgressBar} from '@react-native-community/progress-bar-android';

import API from '../.././Services/API';

// Cores para serem usadas de acordo com o elemento do pokemon
let themeColor;
const TYPE_COLORS = {
  bug: '#dced51',
  dark: '#4f3a2d',
  dragon: '#755edf',
  electric: '#f5c038',
  fairy: '#f4b1f4',
  fighting: '#382b38',
  fire: '#ff673d',
  flying: '#a3b3f7',
  ghost: '#6060b2',
  grass: '#9ae65e',
  ground: '#d3b357',
  ice: '#a3e7fd',
  normal: '#c8c4bc',
  poison: '#934594',
  psychic: '#ed4882',
  rock: '#b9a156',
  steel: '#b5b5c3',
  water: '#3295f6',
};

export default class CharacterScreen extends Component {
  // Configuração do header do navigator
  static navigationOptions = {
    title: 'Características',
    headerStyle: {
      backgroundColor: '#fa716c',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTintColor: 'white',
  };

  constructor(props) {
    super(props);

    this.state = {
      nome: '',
      peso: '',
      pesoKg: '',
      altura: '',
      alturaM: '',
      expBase: '',
      descricao: '',
      hp: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      specialAttack: 0,
      specialDefense: 0,
      loading: false,
      type: '',
    };

    this.voltar = this.voltar.bind(this);
  }

  async componentDidMount() {
    const pokemonNumber = this.props.route.params.id;

    // Requisição das informações básicas e conversão das mesmas
    const response = await API.get(pokemonNumber + '/');
    console.log(response);
    this.setState({
      loading: false,
      elementos: response.data.types.type,
      nome: response.data.name,
      peso: response.data.weight,
      pesoKg: (response.data.weight * 0.1).toFixed(1),
      altura: response.data.height,
      alturaM: (response.data.height * 0.1).toFixed(1),
      expBase: response.data.base_experience,
    });

    // Seleção da cor para ser usada
    const types = response.data.types.map(type => type.type.name);
    this.setState({type: types[0]})
    themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;
    this.setState({color: themeColor});

    // Requisição dos status
    const stats = response.data.stats.map(stats => stats.base_stat);
    const statsSeparados = stats.toString().split(',', 6);
    this.setState({
      speed: statsSeparados[0],
      specialDefense: statsSeparados[1],
      specialAttack: statsSeparados[2],
      defense: statsSeparados[3],
      attack: statsSeparados[4],
      hp: statsSeparados[5],
    });

    // Requisição da descrição
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonNumber}/`;
    await API.get(pokemonSpeciesUrl).then(res => {
      res.data.flavor_text_entries.some(flavor => {
        if (flavor.language.name === 'en')
          this.setState({descricao: flavor.flavor_text.replace(/\s/g, ' ')});
      });
    });
  }

  voltar() {
    // Volta à tela anterior
    this.props.navigation.navigate('Main');
  }

  pokemonNameToUpperCase(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  render() {
    const {loading} = this.state;
    const pokemonNumber = this.props.route.params.id;
    const imageUrl =
      'https://pokeres.bastionbot.org/images/pokemon/' + pokemonNumber + '.png';
    const formatedType = this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1)

    if (!loading) {
      return (
        <ScrollView style={{flex: 1, backgroundColor: themeColor}}>
          <StatusBar backgroundColor={themeColor} barStyle="light-content" />
          <View style={styles.container}>

            <View style={[styles.box1, {backgroundColor: themeColor}]}>
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={this.voltar}>
                  <Icon name="arrow-left" size={35} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.pokemonIndex}>#{pokemonNumber}</Text>
              </View>
            </View>

            <View style={[styles.box2, {backgroundColor: 'white'}]}>
            <Image
                resizeMode="contain"
                source={{uri: imageUrl}}
                style={[styles.imagem, {
                  top: -125,
                  position: 'absolute'
                }]}
              />
            <Text style={[styles.pokemonName, {color: themeColor}]}>
                  {this.pokemonNameToUpperCase(this.state.nome)}
                </Text>
              <Text style={styles.typeText}>{formatedType}</Text>
              <Text style={[styles.titulo, {color: themeColor}]}>Stats</Text>
              <View style={styles.directionStatus}>
                <Text style={[styles.status, {color: themeColor}]}>HP</Text>
                <ProgressBar
                  style={[styles.progressBar, {color: themeColor}]}
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={this.state.hp * 0.01}
                />
                <Text style={[styles.numberStatus, {color: themeColor}]}>
                  {this.state.hp}
                </Text>
              </View>
              <View style={styles.directionStatus}>
                <Text style={[styles.status, {color: themeColor}]}>Attack</Text>
                <ProgressBar
                  style={[styles.progressBar, {color: themeColor}]}
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={this.state.attack * 0.01}
                />
                <Text style={[styles.numberStatus, {color: themeColor}]}>
                  {this.state.attack}
                </Text>
              </View>
              <View style={styles.directionStatus}>
                <Text style={[styles.status, {color: themeColor}]}>
                  Defense
                </Text>
                <ProgressBar
                  style={[styles.progressBar, {color: themeColor}]}
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={this.state.defense * 0.01}
                />
                <Text style={[styles.numberStatus, {color: themeColor}]}>
                  {this.state.defense}
                </Text>
              </View>
              <View style={styles.directionStatus}>
                <Text style={[styles.status, {color: themeColor}]}>Speed</Text>
                <ProgressBar
                  style={[styles.progressBar, {color: themeColor}]}
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={this.state.speed * 0.01}
                />
                <Text style={[styles.numberStatus, {color: themeColor}]}>
                  {this.state.speed}
                </Text>
              </View>
              <View style={styles.directionStatus}>
                <Text style={[styles.status, {color: themeColor}]}>
                  Special Attack
                </Text>
                <ProgressBar
                  style={[styles.progressBar, {color: themeColor}]}
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={this.state.specialAttack * 0.01}
                />
                <Text style={[styles.numberStatus, {color: themeColor}]}>
                  {this.state.specialAttack}
                </Text>
              </View>
              <View style={styles.directionStatus}>
                <Text style={[styles.status, {color: themeColor}]}>
                  Special Defense
                </Text>
                <ProgressBar
                  style={[styles.progressBar, {color: themeColor}]}
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={this.state.specialDefense * 0.01}
                />
                <Text style={[styles.numberStatus, {color: themeColor}]}>
                  {this.state.specialDefense}
                </Text>
              </View>
              <Text style={[styles.titulo, {color: themeColor}]}>
                Basic Infos
              </Text>
              <Text style={styles.description}>{this.state.descricao}</Text>
              <View style={{flexDirection: 'row'}}>    
                <Text style={[styles.infoTitle, {color: themeColor}]}>
                  Weight:{' '}
                </Text>
                <Text style={styles.info}>
                  {this.state.peso} hectograms ({this.state.pesoKg}{' '}
                  kg)
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.infoTitle, {color: themeColor}]}>
                  Height:{' '}
                </Text>
                <Text style={styles.info}>
                  {this.state.altura} decimeters ({this.state.alturaM} m)
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginBottom: '8%'}}>
                <Text style={[styles.infoTitle, {color: themeColor}]}>
                  Base Experience:{' '}
                </Text>
                <Text style={styles.info}>{this.state.expBase} XP</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    backgroundColor: 'transparent',
    height: 160,
    width: 160,
    alignSelf: 'center'
  },
  infoTitle: {
    fontSize: 18,
    marginLeft: '8%',
    color: 'grey',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
    color: 'grey',
    marginRight: '10%',
  },
  titulo: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: '2%',
    marginTop: '5%',
  },
  box1: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    marginTop: -5,
  },
  box2: {
    width: '100%',
    flex: 1,
    elevation: 5.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#000',
    paddingTop: 18,
    marginTop: 90,
  },
  arrowButton: {
    marginTop: '2.55%',
    marginLeft: 15,
    padding: '2%',
    marginBottom: '2.5%',
  },
  progressBar: {
    flex: 1,
  },
  description: {
    fontSize: 18,
    color: 'grey',
    alignSelf: 'center',
    marginHorizontal: '8%',
    marginBottom: 15,
  },
  typeText: {
    fontSize: 18,
    color: 'grey',
    alignSelf: 'center',
    marginHorizontal: '8%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  pokemonName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '2.55%',
    padding: '2%',
    alignSelf: 'center'
  },
  pokemonIndex: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: '2.55%',
    padding: '2%',
    marginRight: 15,
  },
  status: {
    marginRight: '2%',
    marginLeft: '8%',
    fontSize: 15,
    fontWeight: 'bold',
  },
  directionStatus: {
    flexDirection: 'row',
    marginTop: '3%',
  },
  numberStatus: {
    marginRight: '8%',
    marginLeft: '2%',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
