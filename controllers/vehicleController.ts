import { Request, Response, NextFunction } from 'express'
import asyncError from '../utils/asyncError'
import VehicleModel from '../models/vehicleModel'
import APIFeatures from '../utils/apiFeatures'

export const createVehicle = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newVehicle = await VehicleModel.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        vehicle: newVehicle,
      },
    })
  },
)

export const getAllVehicles = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const features = new APIFeatures(VehicleModel.find(), req.query)
      .filter()
      .limitFields()
      .paginate()
      .sort()

    const vehicles = await features.query

    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      data: {
        vehicles,
      },
    })
  },
)

export const getVehicle = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const vehicle = await VehicleModel.findById(req.params.id)
      .populate({
        path: 'driver',
        select: '-vehicle -__v',
      })
      .populate({
        path: 'crashedBy',
        select: '-vehicle -__v',
      })

    const uniqueDrivers = new Map()
    const uniqueCrashedBy = vehicle.crashedBy?.map((crash) => {
      if (crash.accidentDate !== null) {
        const driverId = crash.driver.id

        if (!uniqueDrivers.has(driverId)) {
          uniqueDrivers.set(driverId, crash.driver)
        }

        return { ...crash.toObject(), driver: driverId }
      }
    })

    const uniqueDriverArray = Array.from(uniqueDrivers.values())
    vehicle.crashedBy = uniqueDriverArray
    res.status(200).json({
      status: 'success',
      data: {
        vehicle,
      },
    })
  },
)

export const updateVehicle = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate({
        path: 'driver',
        select: '-vehicle -__v',
      })
      .populate({
        path: 'crashedBy',
        select: '-vehicle -__v',
      })

    const uniqueDrivers = new Map()
    const uniqueCrashedBy = updatedVehicle.crashedBy?.map((crash) => {
      const driverId = crash.driver.id

      if (!uniqueDrivers.has(driverId)) {
        uniqueDrivers.set(driverId, crash.driver)
      }

      return { ...crash.toObject(), driver: driverId }
    })

    const uniqueDriverArray = Array.from(uniqueDrivers.values())

    updatedVehicle.crashedBy = uniqueDriverArray

    res.status(200).json({
      status: 'success',
      data: {
        vehicle: updatedVehicle,
      },
    })
  },
)

export const deleteVehicle = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteVehicle = await VehicleModel.findByIdAndUpdate({
      active: false,
    })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)
