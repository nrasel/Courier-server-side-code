const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('food delivery server running')
})

app.listen(port, () => {
    console.log(`food delivery server listening at http://localhost:${port}`)
})