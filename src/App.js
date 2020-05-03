import React, { useState, useEffect } from 'react';
import './App.css';
import personService from './services/personService';
import './index.css';

function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        personService.getAll().then((initPhonebook) => {
            setPersons(initPhonebook);
        });
    }, []);

    function addPerson(e) {
        e.preventDefault();
        const names = persons.map((person) => person.name);
        const newPerson = {
            name: newName,
            number: newNumber,
        };

        if (names.includes(newName)) {
            const confirmation = window.confirm(
                `${newName} is already added to the phonebook, replace the old number with a new one?`,
            );
            const person = persons.find((person) => person.name === newName);
            if (confirmation) {
                personService
                    .update({ ...person, number: newNumber }, person.id)
                    .then((updatedPerson) => {
                        setPersons(
                            persons.map((person) =>
                                person.id !== updatedPerson.id ? person : updatedPerson,
                            ),
                        );
                    });
            }
        } else {
            personService.create(newPerson).then((returnedPerson) => {
                setPersons(persons.concat(returnedPerson));
            });
        }
        setNewName('');
        setNewNumber('');
    }

    const filteredPhonebook = persons.filter((person) =>
        person.name.toLocaleLowerCase().includes(filter.toLowerCase()),
    );

    const showThis = filter ? filteredPhonebook : persons;

    function removePerson(id, name) {
        const confirmation = window.confirm(`delete ${name}?`);
        if (confirmation) {
            personService.remove(id).then((response) => {
                console.log(response);
            });
            setPersons(persons.filter((person) => person.id !== id));
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
            <AddForm
                onSubmit={addPerson}
                newName={newName}
                newNumber={newNumber}
                setNewName={(e) => setNewName(e.target.value)}
                setNewNumber={(e) => setNewNumber(e.target.value)}
            />
            <h2>Numbers</h2>
            {showThis.map((person) => (
                <Person
                    key={person.name}
                    name={person.name}
                    number={person.number}
                    handleClick={() => removePerson(person.id, person.name)}
                />
            ))}
        </div>
    );
}

function AddForm({ onSubmit, newName, newNumber, setNewName, setNewNumber }) {
    return (
        <form onSubmit={onSubmit}>
            <h3>add new</h3>
            <div>
                name: <input value={newName} onChange={setNewName} />
                <br />
                <br />
                phone: <input value={newNumber} onChange={setNewNumber} />
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

function Person({ name, number, handleClick }) {
    return (
        <p>
            {name}, {number} <button onClick={handleClick}>delete</button>
        </p>
    );
}

export default App;
