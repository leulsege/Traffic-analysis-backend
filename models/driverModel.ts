import mongoose, { Document, Schema, Types, Query } from 'mongoose'
import VehicleModel from './vehicleModel'
import VehicleAccidentModel from './vehicleAccidentModel'
import TrainingModal from './trainingModel'

interface Configuration extends Document {
  givenPoint: number
  trainingEntryPoint: number
}

interface Driver extends Document {
  fullName: string
  licenseLevel: string
  licenseNumber: string
  licenseExpiredDate: Date
  gender: string
  phoneNumber: string
  commencementDate: Date
  terminationDate: Date | null
  age: number
  idNumber: string
  birthDate: Date
  active: boolean
  photo?: string | null
  haveAccident: boolean
  accidentRecord: any
  vehicle?: Schema.Types.ObjectId | null
}

const configurationSchema = new Schema<Configuration>({
  givenPoint: {
    type: Number,
    required: true,
    default: 100,
  },
  trainingEntryPoint: {
    type: Number,
    required: true,
    default: 0,
  },
})

const ConfigurationModel = mongoose.model<Configuration>(
  'Configuration',
  configurationSchema,
)

const driverSchema = new Schema<Driver>(
  {
    fullName: {
      type: String,
      required: true,
    },
    licenseLevel: {
      type: String,
    },
    licenseNumber: {
      type: String,
      unique: true,
      required: true,
    },
    licenseExpiredDate: {
      type: Date,
    },
    gender: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    commencementDate: {
      type: Date,
    },
    terminationDate: {
      type: Date,
      default: null,
    },
    birthDate: {
      type: Date,
    },
    idNumber: {
      type: String,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    haveAccident: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: null,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// ... (previous code)

driverSchema.virtual('currentPoint').get(async function (this: Driver) {
  // Retrieve configuration values
  let configuration = await ConfigurationModel.findOne()

  if (!configuration) {
    await ConfigurationModel.create({
      givenPoint: 100,
      trainingEntryPoint: 0,
    })

    configuration = await ConfigurationModel.findOne()
  }
  try {
    // Find all accidents related to this driver and calculate the sum of reduced points
    const totalReducedPoints = await VehicleAccidentModel.aggregate([
      {
        $match: { driver: this._id },
      },
      {
        $group: {
          _id: null,
          totalReducedPoints: { $sum: '$reducedPoint' },
        },
      },
    ])

    // If there are accidents, subtract the total reduced points from the givenPoint
    const currentPoint =
      configuration?.givenPoint -
        (totalReducedPoints[0]?.totalReducedPoints || 0) || 0

    // Subtract the trainingEntryPoint from the netGivenPoint
    const downTrainingPoint =
      currentPoint - (configuration?.trainingEntryPoint || 0)

    // Update TrainingModel based on currentPoint
    await updateTrainingStatus(this._id, downTrainingPoint)

    return currentPoint
  } catch (error) {
    console.error('Error calculating currentPoint:', error)
    // Return default givenPoint in case of an error
    return configuration?.givenPoint | 0
  }
})

async function updateTrainingStatus(
  driverId: Schema.Types.ObjectId,
  downTrainingPoint: number,
): Promise<void> {
  const training = await TrainingModal.findOne({ driver: driverId })

  if (downTrainingPoint <= 0) {
    // If downTrainingPoint is less than 0, add the driver to training
    if (!training) {
      await TrainingModal.create({
        driver: driverId,
        // Add other training details as needed
      })
    }
  } else {
    // If downTrainingPoint is greater than or equal to 0, remove the driver from training if they exist
    if (training && !training?.trainingStartDate) {
      await TrainingModal.findByIdAndDelete(training._id)
    }
  }
}

// driverSchema.virtual('faultRecord', {
//   ref: 'FaultRecord',
//   foreignField: 'driver',
//   localField: '_id',
// })

driverSchema.virtual('accidentRecord', {
  ref: 'Accident',
  foreignField: 'driver',
  localField: '_id',
})

driverSchema.pre(
  /^find/,
  function (this: Query<Driver[], Driver, unknown>, next) {
    this.populate('vehicle')
    next()
  },
)
const DriverModel = mongoose.model<Driver>('Driver', driverSchema)

export { DriverModel, ConfigurationModel }
