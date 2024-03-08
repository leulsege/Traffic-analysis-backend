import mongoose, { Schema, Document } from 'mongoose'

interface Site extends Document {
  startingPoint: String
  destination: String
  stayingPlace: String
}

const siteSchema: Schema = new mongoose.Schema({
  startingPoint: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  stayingPlace: {
    type: String,
    required: true,
  },
})

const SiteModel = mongoose.model<Site>('Site', siteSchema)

export default SiteModel
