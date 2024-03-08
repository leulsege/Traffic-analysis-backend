import { Request, Response, Router } from 'express'
import { ConfigurationModel } from '../models/driverModel'
import asyncError from '../utils/asyncError'
import { protect, restrictTo } from '../middleware/authMiddleware'

export const getConfiguration = asyncError(
  async (req: Request, res: Response): Promise<void> => {
    const configuration = await ConfigurationModel.findOne()
    res.json(configuration)
  },
)

// Update configuration settings
export const updateConfiguration = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { givenPoint, trainingEntryPoint } = req.body

  const existingConfig = await ConfigurationModel.findOne()

  if (existingConfig) {
    existingConfig.givenPoint = givenPoint
    existingConfig.trainingEntryPoint = trainingEntryPoint

    await existingConfig.save()

    res.json(existingConfig)
  } else {
    const newConfig = await ConfigurationModel.create({
      givenPoint,
      trainingEntryPoint,
    })

    res.json(newConfig)
  }
}

const configRouter = Router()

configRouter
  .route('/')
  .all(protect)
  .get(getConfiguration)
  .patch(updateConfiguration)

export default configRouter
