import socket from 'socket.io-client'

// const baseURL = 'http://localhost:3015'
// if (process.env.NODE_ENV == 'production') {
//   baseURL = 'https://cornergo-api.herokuapp.com'
// }

const io = socket(process.env.BASE_URL)

export { io }
