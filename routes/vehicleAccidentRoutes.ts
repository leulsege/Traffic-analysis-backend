import express from 'express'
import {
  getAllVehicleAccidents,
  getVehicleAccident,
  updateVehicleAccident,
  deleteVehicleAccident,
  createVehicleAccident,
  uploadAccidentPhoto,
  resizeAccidentPhoto,
} from '../controllers/vehicleAccidentController'
import { protect, restrictTo } from '../middleware/authMiddleware'

const vehicleAccidentRouter = express.Router()

vehicleAccidentRouter
  .route('/uploadphoto/:id')
  .patch(
    protect,
    uploadAccidentPhoto,
    resizeAccidentPhoto,
    updateVehicleAccident,
  )

vehicleAccidentRouter
  .route('/')
  .all(protect)
  .post(createVehicleAccident)
  .get(getAllVehicleAccidents)
vehicleAccidentRouter
  .route('/:id')
  .all(protect)
  .get(getVehicleAccident)
  .patch(updateVehicleAccident)
  .delete(deleteVehicleAccident)

export default vehicleAccidentRouter
