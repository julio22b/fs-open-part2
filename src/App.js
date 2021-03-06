import React, { useState, useEffect } from 'react';
import './App.css';
import Note from './components/Note';
import noteService from './services/notes';
import Notification from './components/Notification';
import './index.css';

function App() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('add new note...');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes);
        });
    }, []);

    const notesToShow = showAll ? notes : notes.filter((note) => note.important);

    function addNote(e) {
        e.preventDefault();
        const note = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5,
        };
        noteService.create(note).then((returnedNote) => {
            setNotes(notes.concat(returnedNote));
            setNewNote('');
        });
    }

    function handleNoteChange(e) {
        setNewNote(e.target.value);
    }

    function toggleImportance(id) {
        const note = notes.find((note) => note.id === id);
        const replaceNote = { ...note, important: !note.important };

        noteService
            .update(id, replaceNote)
            .then((returnedNote) => {
                setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
            })
            .catch((error) => {
                setErrorMessage(`Note ${note.content} was already removed from server`);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter((note) => note.id !== id));
            });
    }

    return (
        <div className="App">
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map((note) => (
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportance(note.id)}
                    />
                ))}
            </ul>
            <form onSubmit={addNote}>
                <input type="text" value={newNote} onChange={handleNoteChange} />
                <button>save</button>
            </form>
        </div>
    );
}

export default App;
