import React, { useState, useEffect } from 'react';
import './App.css';
import personService from './services/personService';
import './index.css';

function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        personService.getAll().then((initPhonebook) => {
            setPersons(initPhonebook);
        });
    }, []);

    function addPerson(e) {
        e.preventDefault();
        const names = persons.map((person) => person.name);

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
                    })
                    .catch((error) => {
                        setMessage(
                            `Error. ${person.name} has already been removed from the server`,
                        );
                    });
                setMessage(`${person.name}'s number has been updated`);
            }
        } else {
            const newPerson = {
                name: newName,
                number: newNumber,
            };
            personService
                .create(newPerson)
                .then((returnedPerson) => {
                    setPersons(persons.concat(returnedPerson));
                    setMessage(`${newPerson.name} has been added to the phonebook`);
                })
                .catch((err) =>
                    setMessage(
                        `Validation Error. Name bust be at least 3 characters long and number 8 digits long`,
                    ),
                );
        }
        setTimeout(() => {
            setMessage(null);
        }, 5000);
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
            <Notification message={message} />
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

function Notification({ message }) {
    if (message === null) {
        return null;
    }
    return <p className={message.includes('Error') ? 'failure' : 'success'}>{message}</p>;
}

export default App;
