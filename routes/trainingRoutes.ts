import express from 'express'
import {
  getAllTrainings,
  getTraining,
  updateTraining,
  deleteTraining,
  createTraining,
  backTraining,
} from '../controllers/trainingController'
import { protect, restrictTo } from '../middleware/authMiddleware'

const trainingRouter = express.Router()

trainingRouter.route('/').all(protect).post(createTraining).get(getAllTrainings)
trainingRouter
  .route('/:id')
  .all(protect)
  .get(getTraining)
  .patch(updateTraining)
  .delete(deleteTraining)
  .put(backTraining)

export default trainingRouter
