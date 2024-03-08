import { Document, Model, Query } from 'mongoose'

class APIFeatures<T extends Document> {
  public query: Query<T[], T, unknown>
  public queryString: Record<string, string>

  constructor(query: Query<T[], T, unknown>, queryString: any) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    queryStr = queryStr.replace(/-/g, ' ')
    const finalQuery = JSON.parse(queryStr)
    if (finalQuery.fullName) {
      const nameRegex = new RegExp(`^${finalQuery.fullName}`, 'i')
      finalQuery.fullName = nameRegex
    }
    if (finalQuery.plateNumber) {
      const nameRegex = new RegExp(`^${finalQuery.plateNumber}`, 'i')
      finalQuery.plateNumber = nameRegex
    }
    this.query = this.query.find(finalQuery)

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('fullName plateNumber -createdAt')
    }

    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  paginate() {
    const page = (this.queryString.page as unknown as number) || 1
    const limit = (this.queryString.limit as unknown as number) || 50
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

export default APIFeatures
