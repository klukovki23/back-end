import { useState, useEffect } from "react";
import axios from "axios";
import nameService from "./services/persons";

const Persons = ({ name, number, onDelete }) => {
  return (
    <p>
      {name} {number} <button onClick={onDelete}>delete</button>
    </p>
  );
};

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({ newName, newNumber, onNameChange, onNumberChange }) => {
  return (
    <>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} />{" "}
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </>
  );
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notification">{message}</div>;
};

const ErrorMessage = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null;
  }

  return <div className="error">{errorMessage}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    nameService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const deleteNames = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      nameService.deleteName(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setMessage(`${name} was deleted`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    }
  };
  const addName = (event) => {
    event.preventDefault();

    const nameExists = persons.find((person) => person.name === newName);
    if (nameExists) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedNumber = { ...nameExists, number: newNumber };

        nameService
          .update(nameExists.id, updatedNumber)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) => (p.id !== nameExists.id ? p : returnedPerson))
            );
            setMessage(`Updated ${returnedPerson.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setErrorMessage(
              ` Information of person ${nameExists.name} has already been deleted from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter((p) => p.id !== nameExists.id));
            setNewName("");
            setNewNumber("");
          });
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      };
      nameService.create(nameObject).then((returnedName) => {
        setPersons(persons.concat(returnedName));
        setMessage(`Added ${returnedName.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);

        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.trim().toLowerCase())
  );

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />{" "}
      <ErrorMessage errorMessage={errorMessage} />
      <div>
        <Filter filter={filter} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <PersonForm
          newName={newName}
          newNumber={newNumber}
          onNameChange={handleNameChange}
          onNumberChange={handleNumberChange}
        />
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <Persons
          key={person.name}
          name={person.name}
          number={person.number}
          onDelete={() => deleteNames(person.id, person.name)}
        />
      ))}
    </div>
  );
};

export default App;
