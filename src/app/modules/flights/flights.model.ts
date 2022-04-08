import Mongoose from 'mongoose';

import dbTables from '../../constants/db_tables';

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     Flight:
 *       properties:
 *         _id:
 *           type: string
 *         departureAirport:
 *           type: string
 *         arrivalAirport:
 *           type: string
 *         departureDate:
 *           type: string
 *           format: datetime
 *         arrivalDate:
 *           type: string
 *           format: datetime
 *         airplane:
 *           type: string
 *         company:
 *           type: string
 *         price:
 *           type: string
 *         firstClassPrice:
 *           type: number
 *         seatsReserved:
 *           type: array
 *           items:
 *             type: number
 * 
 */

const schema = new Mongoose.Schema(
  {
    departureAirport: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: dbTables.AIRPORTS,
      required: true,
    },
    arrivalAirport: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: dbTables.AIRPORTS,
      required: true,
    },
    airplane: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: dbTables.AIRPLANES,
      required: true,
    },
    departureDate: {
      type: Mongoose.Schema.Types.Date,
      required: true,
    },
    arrivalDate: {
      type: Mongoose.Schema.Types.Date,
      required: true,
    },
    company: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    price: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    },
    firstClassPrice: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    },
    seatsReserved: [
      {
        type: Mongoose.Schema.Types.Number,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: dbTables.FLIGHTS,
  }
);

export default Mongoose.model(dbTables.FLIGHTS, schema);