const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(cors())
morgan.token("body", req => JSON.stringify(req.body))
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body"
  )
)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
]

app.get("/", (req, res) => {
  res.json(notes)
})

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === parseInt(id))
  return note ? res.json(note) : res.status(404).end()
})

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  console.log(notes)
  res.status(204).end()
})

const generateId = () =>
  notes.length === 0 ? 1 : Math.max(...notes.map(note => note.id)) + 1

app.post("/api/notes", (req, res) => {
  const body = req.body

  if (!body.content) {
    res.status(400).json({
      error: "Missing content",
    })
    return
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
    date: new Date(),
  }

  notes = notes.concat(note)
  res.json(note)
})

app.use((req, res, next) => {
  res.status(404).send({ error: "unknown endpoint" })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log("Listening on port ", PORT)
})
