import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/persons').then((response) => {
            setPersons(response.data);
        });
    }, []);

    function addPerson(e) {
        e.preventDefault();
        const names = persons.map((person) => person.name);
        names.includes(newName)
            ? alert(`${newName} is already added to the phonebook`)
            : setPersons(persons.concat({ name: newName, phone: newPhone }));
        setNewName('');
        setNewPhone('');
    }

    const filteredPhonebook = persons.filter((person) =>
        person.name.toLocaleLowerCase().includes(filter.toLowerCase()),
    );

    const showThis = filter ? filteredPhonebook : persons;

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
            <AddForm
                onSubmit={addPerson}
                newName={newName}
                newPhone={newPhone}
                setNewName={(e) => setNewName(e.target.value)}
                setNewPhone={(e) => setNewPhone(e.target.value)}
            />
            <h2>Numbers</h2>
            {showThis.map((person) => (
                <Person key={person.name} person={person} />
            ))}
        </div>
    );
}

function AddForm({ onSubmit, newName, newPhone, setNewName, setNewPhone }) {
    return (
        <form onSubmit={onSubmit}>
            <h3>add new</h3>
            <div>
                name: <input value={newName} onChange={setNewName} />
                <br />
                <br />
                phone: <input value={newPhone} onChange={setNewPhone} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
}

function Filter({ filter, onChange }) {
    return (
        <p>
            find person <input value={filter} onChange={onChange} />
        </p>
    );
}

function Person({ person }) {
    return (
        <p>
            {person.name}, {person.phone}
        </p>
    );
}

export default App;
