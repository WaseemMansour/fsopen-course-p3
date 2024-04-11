const app = require('express')();
const morgan = require('morgan');
app.use(require('express').json());


morgan.token('reqBody', (req, res) => {
  return req.body ? JSON.stringify(req.body) : '';
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));

let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find(person => person.id === id);
  if(person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  phonebook = phonebook.filter(person => person.id !== id);
  res.status(204).end();
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for 2 people</p>
    <p>${new Date()}</p>
  `);
});

const generateId = () => {
  const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(person => person.id))
    : 0;
  return maxId + 1;
}

app.post('/api/persons', ((req, res) => {
  const { body } = req;

    if(!body.name || !body.number) {
      return res.status(400).json({
        error: 'name or number missing'
      })
    }

    if(phonebook.find(person => person.name === body.name)) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    };
    phonebook = phonebook.concat(person);
    res.status(201).json(person);

}))

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
