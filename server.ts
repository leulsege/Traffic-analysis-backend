import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import app from './app'

const DB = process.env.DATABASE

const connectDB = async (): Promise<void> => {
  try {
    const options: ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions

    await mongoose.connect(DB, options)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

connectDB()

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
