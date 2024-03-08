import express from 'express'
import {
  createFaultRecord,
  getAllFaultRecords,
  getFaultRecord,
  updateFaultRecord,
  deleteFaultRecord,
} from '../controllers/faultRecordController'
import { protect, restrictTo } from '../middleware/authMiddleware'

const faultRecordRouter = express.Router()

faultRecordRouter
  .route('/')
  .all(protect)
  .post(createFaultRecord)
  .get(getAllFaultRecords)
faultRecordRouter
  .route('/:id')
  .all(protect)
  .get(getFaultRecord)
  .patch(updateFaultRecord)
  .delete(deleteFaultRecord)

export default faultRecordRouter
