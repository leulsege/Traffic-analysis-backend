import mongoose, { Schema, Document, Query } from 'mongoose'

interface FaultRecord extends Document {
  givenPoint: Number
  reducedPoint: Number
  remainingPoint: Number
  driver: Schema.Types.ObjectId
  history: Array<{
    date: any
    givenPoint: Number
    reducedPoint: Number
    user: Schema.Types.ObjectId | null
  }>
}

const faultRecordSchema: Schema = new mongoose.Schema(
  {
    givenPoint: {
      type: Number,
      default: 10,
    },
    reducedPoint: {
      type: Number,
      default: 0,
    },
    givenDecision: String,
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'a fault belongs to a driver'],
    },
    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        givenPoint: {
          type: Number,
          required: true,
        },
        reducedPoint: {
          type: Number,
          required: true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

faultRecordSchema.virtual('remainingPoint').get(function () {
  return this.givenPoint - this.reducedPoint
})

faultRecordSchema.pre(
  /^find/,
  function (this: Query<FaultRecord[], FaultRecord, unknown>, next) {
    this.populate('driver').populate({ path: 'history.user' })
    next()
  },
)

const FaultRecordModel = mongoose.model<FaultRecord>(
  'FaultRecord',
  faultRecordSchema,
)

export default FaultRecordModel
