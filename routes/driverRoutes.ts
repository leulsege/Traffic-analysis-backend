import express from 'express'
import {
  getAllDrivers,
  createDriver,
  getDriver,
  updateDriver,
  deleteDriver,
  uploadUserPhoto,
  resizeUserPhoto,
  backDriver,
  accidentFreeDrivers,
  clearAccident,
} from '../controllers/driverController'
import { protect, restrictTo } from '../middleware/authMiddleware'

const driverRouter = express.Router()

driverRouter
  .route('/uploadphoto/:id')
  .patch(protect, uploadUserPhoto, resizeUserPhoto, updateDriver)

driverRouter.route('/accidentfree').get(protect, accidentFreeDrivers)

driverRouter.route('/clear/:id').delete(protect, clearAccident)

driverRouter.route('/').all(protect).get(getAllDrivers).post(createDriver)
driverRouter
  .route('/:id')
  .all(protect)
  .get(getDriver)
  .patch(updateDriver)
  .delete(deleteDriver)
  .put(backDriver)

export default driverRouter
