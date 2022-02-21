import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height } = Dimensions.get('window');

const API_KEY = 'f9671855cc1dad83ce46159fd131fc7f';

const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Rain: 'rain',
  Drizzle: 'rains',
  Thunderstorm: 'lightning',
}

export default function App () {
  const [city, setCity] = useState('Loding...');
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const [location] = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location.city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  }

  const getPermission = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
  }

  useEffect(async () => {
    await getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length ?
          days.map((day, i) =>
            <View style={styles.day} key={i}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
              >
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={54} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>) :
            <View style={{...styles.day, alignItems: 'center'}}>
              <ActivityIndicator color='white' size='large' style={{ marginTop: 10 }} />
            </View>
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 54,
    fontWeight: '500',
    color: 'white'
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 150,
    fontWeight: '500',
    color: 'white'
  },
  description: {
    marginTop: -15,
    fontSize: 50,
    fontWeight: '500',
    color: 'white'
  },
  tinyText: {
    fontSize: 22,
    color: 'white'
  }
});
