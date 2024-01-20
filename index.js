const connectDB =require('./db')
const express = require('express')

connectDB();



const app = express()
const port = 3000
app.use(express.json())
//Available Routes


app.use('/api/auth',require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})