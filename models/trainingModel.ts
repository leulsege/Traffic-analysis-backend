import mongoose, { Schema, Document, Query } from 'mongoose'

interface Training extends Document {
  trainingType: String
  trainingStartDate: Date
  trainingEndDate: Date
  trainingPassPoint: Number
  trainingResult: Number
  checkUp: String
  driver: Schema.Types.ObjectId
}

const trainingSchema: Schema = new mongoose.Schema({
  trainingType: {
    type: String,
  },
  trainingStartDate: {
    type: Date,
  },
  trainingEndDate: {
    type: Date,
  },
  trainingPassPoint: {
    type: Number,
  },
  trainingResult: {
    type: Number,
  },
  checkUp: {
    type: String,
  },
  activeTrainer: {
    type: Boolean,
    default: true,
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, 'training belongs to a driver'],
  },
})

trainingSchema.pre(
  /^find/,
  function (this: Query<Training[], Training, unknown>, next) {
    this.populate('driver')
    next()
  },
)

const TrainingModal = mongoose.model<Training>('Training', trainingSchema)

export default TrainingModal
