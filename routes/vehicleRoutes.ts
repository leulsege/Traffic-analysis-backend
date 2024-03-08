import express from 'express'
import {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController'
import { protect, restrictTo } from '../middleware/authMiddleware'

const vehicleRouter = express.Router()

vehicleRouter.route('/').all(protect).post(createVehicle).get(getAllVehicles)
vehicleRouter
  .route('/:id')
  .all(protect)
  .get(getVehicle)
  .patch(updateVehicle)
  .delete(deleteVehicle)

export default vehicleRouter
