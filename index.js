const express = require('express')
const app = express()
const http = require('http')
const socket = require('socket.io')
const server = http.createServer(app)
const io = socket(server)

// const cors = require('cors');
// app.use(cors({ origin: true, credentials: true }));

app.get('/', (request, response) => {
  response.send('Hello, world!!!')
})

rooms = {}

io.on('connection', socket => {
  socket.on('join room', roomID => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id)
    } else {
      rooms[roomID] = [socket.id]
    }

    const otherUser = rooms[roomID].find(id => id !== socket.id)
    if (otherUser) {
      socket.emit('other user', otherUser)
      socket.to(otherUser).emit('user joined', socket.id) // aqui não é io.to('otherUser)...??? // não tem ninguém olhando esse evento???
    }
  })

  socket.on('offer', payload => {
    io.to(payload.target).emit('offer', payload) // aqui não seria socket.to(payload.target)...???
  })

  socket.on('answer', payload => {
    io.to(payload.target).emit('answer', payload) // aqui não seria socket.to(payload.target)...???
  })

  socket.on('ice-candidate', payload => {
    io.to(payload.target).emit('ice-candidate', payload.candidate) // aqui não seria socket.to(payload.target)...???
  })

})


const port = process.env.PORT || 8080
server.listen(port, () => console.log(`server is running on port ${port}`))
