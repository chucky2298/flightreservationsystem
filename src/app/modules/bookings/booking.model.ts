import Mongoose from 'mongoose';

import dbTables from '../../constants/db_tables';

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     Booking:
 *       properties:
 *         _id:
 *           type: string
 *         departureAirport:
 *           type: string
 *         departureDate:
 *           type: string
 *           format: datetime
 *         arrivalAirport:
 *           type: string
 *         arrivalDate:
 *           type: string
 *           format: datetime
 *         airplane:
 *           type: string
 *         company:
 *           type: string
 *         standardPrice:
 *           type: number
 *         seatsAvailable:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
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
    departureDate: {
      type: Mongoose.Schema.Types.Date,
      required: true,
    },
    arrivalDate: {
      type: Mongoose.Schema.Types.Date,
      required: true,
    },
    airplane: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: dbTables.AIRPLANES,
      required: true,
    },
    company: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    standardPrice: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    },
    seats: [
      {
        price: {
          type: Mongoose.Schema.Types.Number,
          required: true,
        },
        available: {
          type: Mongoose.Schema.Types.Boolean,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: dbTables.BOOKINGS,
  }
);

export default Mongoose.model(dbTables.BOOKINGS, schema);