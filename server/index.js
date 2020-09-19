const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio.listen(server)

io.on('connection', () => {
  console.log('nuevo socket conectado');
})


app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

const SerialPort = require('serialport')
const readLine = SerialPort.parsers.Readline
const parser = new readLine()

const mySerial = new SerialPort('COM4', {
  baudRate: 9600
})

mySerial.on('open', () => {
  console.log('Puerto serial abierto');
})

mySerial.on('data', (data) => {
  console.log(data.toString());

  io.emit('arduino:data', {
    value: data.toString()
  })
})

mySerial.on('err', (error) => {
  console.log(error.message);
})

server.listen(3000, () => {
  console.log('Server on port 3000');
})