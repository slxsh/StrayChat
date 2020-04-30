const express = require('express')
const redis = require('redis')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const moment = require('moment')
const path = require('path')

app.use(express.static(path.join(__dirname, 'build')))

// Redis Connection
const client = new redis.createClient() // default = localhost
client.on('connect', () => {
    console.log('Connected to Redis.')
})
client.on('error', (err) => {
    console.log(err)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
// redirect to homepage in any other case
app.get('*', (req, res) => {
    res.redirect('/')
})

// function to make rooms for two users until queue contains less than 2 users
const pairing = () => {
    client.llen('usersQueue', (err, len) => {
        if(err) console.log(err) 
        else {
            if(len/2 >= 1) {
                client.lpop('usersQueue', (err, user1) => {
                    if(err) console.log(err)
                    else {
                        client.lpop('usersQueue', (err, user2) => {
                            if(err) console.log(err)
                            else {
                                var room = user1.toString() + user2.toString()
                                client.hset('rooms', user1, room, (err) => {
                                    if(err) console.log(err)
                                    else
                                        client.hset('rooms', user2, room, (err) => {
                                            if(err) console.log(err) 
                                            else {
                                                io.to(user1).emit('found')
                                                io.to(user2).emit('found')
                                                io.sockets.connected[user1].join(room)
                                                io.sockets.connected[user2].join(room)
                                                pairing()
                                            } 
                                        })
                                })
                            } 
                        })
                    }
                })
            } 
        }
    })   
}

// socket connection
io.on('connection', (socket) => {
    client.rpush('usersQueue', socket.id, (err, reply) => {
        if(err)
            console.log(err)
        else {
            pairing()
        }
    })
    socket.on('message', (data) => {
        client.hget('rooms', socket.id, (err, reply) => {
            if(err) console.log(err)
            else {
                io.sockets.in(reply).emit('message', {
                    id : socket.id,
                    message : data.message,
                    time : moment.utc().format('h:mm a, Do MMMM')
                })
            }
        })
    })
    socket.on('typing', () => {
        client.hget('rooms', socket.id, (err, reply) => {
            if(err) console.log(err)
            else {
                socket.broadcast.to(reply).emit('typing')
            }
        })
    })
    socket.on('notyping', () => {
        client.hget('rooms', socket.id, (err, reply) => {
            if(err) console.log(err)
            else {
                socket.broadcast.to(reply).emit('notyping')
            }
        })
    })
    socket.on('disconnect', () => {
        client.lrem('usersQueue', 0, socket.id)
        client.hget('rooms', socket.id, (err, reply) => {
            if(err) console.log(err)
            else {
                socket.broadcast.to(reply).emit('disconnected')
                client.hdel('rooms', socket.id)
            }
        })
    })
})

server.listen(4000, () => console.log('Server has started'))
