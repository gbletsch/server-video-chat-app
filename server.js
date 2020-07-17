const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)



const port = process.env.PORT || 8000
server.listen(port, () => console.log(`server is running on port ${port}`))
