const connectDB =require('./db')
const express = require('express')
const cors = require('cors');

connectDB();



const app = express()
const port = 5000
app.use(express.json())
app.use(cors());
//Available Routes


app.use('/api/auth',require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})