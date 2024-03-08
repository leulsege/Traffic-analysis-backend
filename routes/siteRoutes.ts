import express from 'express'
import {
  getAllSites,
  createSite,
  getSite,
  updateSite,
  deleteSite,
} from '../controllers/siteController'
import { protect, restrictTo } from '../middleware/authMiddleware'

const siteRouter = express.Router()

siteRouter.route('/').all(protect).post(createSite).get(getAllSites)
siteRouter
  .route('/:id')
  .all(protect)
  .get(getSite)
  .patch(updateSite)
  .delete(deleteSite)

export default siteRouter
