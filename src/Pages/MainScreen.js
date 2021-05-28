import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setPokemons(data.results);
      });
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        data={pokemons}
        keyExtractor={pokemon => pokemon.name}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={PokemonShow}
      />
    </SafeAreaView>
  );
}

function PokemonShow(item) {
  const {name, url} = item.item;

  const pokemonNumber = url
    .replace('https://pokeapi.co/api/v2/pokemon/', '')
    .replace('/', '');
  const imageURL =
    'https://pokeres.bastionbot.org/images/pokemon/' + pokemonNumber + '.png';

  return (
    <View style={styles.container}>
      <Image style={styles.imagens} source={{uri: imageURL}} />
      <Text>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  imagens: {
    width: 50,
    height: 50,
  },
});
