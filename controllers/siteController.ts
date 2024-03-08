import asyncError from '../utils/asyncError'
import SiteModel from '../models/siteModel'

import { Request, Response, NextFunction } from 'express'

export const createSite = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newSite = await SiteModel.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        site: newSite,
      },
    })
  },
)

export const getAllSites = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const sites = await SiteModel.find()

    res.status(200).json({
      status: 'success',
      results: sites.length,
      data: {
        sites,
      },
    })
  },
)

export const getSite = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const site = await SiteModel.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        site,
      },
    })
  },
)

export const updateSite = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const updateSite = await SiteModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      status: 'success',
      data: {
        site: updateSite,
      },
    })
  },
)
export const deleteSite = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteSite = await SiteModel.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)
