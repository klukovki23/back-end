const express = require('express')
const morgan = require ('morgan')

const app = express()

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = 
   [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
  ]

app.use(express.json())

app.use(express.static('dist'))


app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  const currentTime = new Date();
  const count = persons.length;

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const newId =
    Math.floor(Math.random() * 1000000)
  return String(newId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name|| !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }
  const nameExists = persons.some(p => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    name: body.name,
    number:body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})