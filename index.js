const PORT = 1984
const server = require('./server').listen(PORT)

const listening = `Server listening on port ${PORT}`
server.on('listening', () => console.log(listening))
