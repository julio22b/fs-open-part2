import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
            setCountries(response.data);
        });
    }, []);

    const filterByName = countries.filter((country) =>
        country.name.toLowerCase().includes(filter.toLowerCase()),
    );
    let countriesToDisplay;
    let message;
    if (filterByName.length > 10 && filter) {
        message = 'too many matches';
    } else if (filterByName.length <= 10 && filterByName.length > 1) {
        message = '';
        countriesToDisplay = filterByName.map((country) => (
            <Country key={country.name} name={country.name} />
        ));
    } else if (filterByName.length === 1) {
        countriesToDisplay = <Country country={filterByName} />;
    }
    return (
        <div>
            <Filter onChange={(e) => setFilter(e.target.value)} />
            <div>
                <p>{message}</p>
                {countriesToDisplay}
            </div>
        </div>
    );
}

function Filter({ onChange }) {
    return (
        <p>
            <input onChange={onChange} />
        </p>
    );
}

function Country(props) {
    return (
        <div>
            {props.name ? (
                <p>{props.name}</p>
            ) : (
                <>
                    <h2>{props.country[0].name}</h2>
                    <p>capital {props.country[0].capital}</p>
                    <p>population {props.country[0].population}</p>
                    <h3>languages</h3>
                    <ul>
                        {props.country[0].languages.map((language) => (
                            <li key={language.name}>{language.name}</li>
                        ))}
                    </ul>
                    <img src={props.country[0].flag} alt="" style={imgSize} />
                </>
            )}
        </div>
    );
}

const imgSize = {
    width: '150px',
    height: '100px',
};

export default App;
