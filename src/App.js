import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const api_key = process.env.REACT_APP_API_KEY;

function App() {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
            setCountries(response.data);
        });
    }, []);

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(filter.toLowerCase()),
    );

    return (
        <div>
            <Filter onChange={(e) => setFilter(e.target.value)} />
            <div>
                <Countries countries={filteredCountries} filter={filter} />
            </div>
        </div>
    );
}

function Countries({ countries, filter }) {
    const message = filter ? 'too many countries' : 'search';
    if (countries.length <= 10 && countries.length > 1) {
        return (
            <div>
                <Country countries={countries} />
            </div>
        );
    } else if (countries.length === 1) {
        countries = countries[0];
        return <CountryInfo country={countries} />;
    } else {
        return <div>{message}</div>;
    }
}

function Country({ countries }) {
    const [showOneCountry, setShowOneCountry] = useState(false);

    if (showOneCountry) {
        return <CountryInfo country={showOneCountry} />;
    }

    return (
        <div>
            {countries.map((country) => (
                <p key={country.name}>
                    {country.name} <button onClick={() => setShowOneCountry(country)}>show</button>
                </p>
            ))}
        </div>
    );
}

function CountryInfo({ country }) {
    console.log(country);
    return (
        <div>
            <h1>{country.name}</h1>
            <p>capital: {country.capital}</p>
            <p>population: {country.population}</p>
            <h3>languages</h3>
            <ul>
                {country.languages.map((language) => (
                    <li key={language.name}>{language.name}</li>
                ))}
            </ul>
            <img src={country.flag} alt="" style={imgSize} />
            <WeatherInfo country={country} />
        </div>
    );
}

function WeatherInfo({ country }) {
    const [weather, setWeather] = useState(false);

    useEffect(() => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`,
            )
            .then((response) => {
                setWeather(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    if (weather) {
        return (
            <div>
                <h2>weather in {country.capital}</h2>
                <p>
                    <strong>temperature:</strong> {weather.main.temp} f
                </p>
                <p>
                    <strong>wind:</strong> {weather.wind.speed} mph
                </p>
            </div>
        );
    }
    return null;
}

function Filter({ onChange }) {
    return (
        <p>
            <input onChange={onChange} />
        </p>
    );
}

const imgSize = {
    width: '150px',
    height: '100px',
};

export default App;
