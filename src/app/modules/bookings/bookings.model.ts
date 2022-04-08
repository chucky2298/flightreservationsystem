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
 *         flight:
 *           type: string
 *         user:
 *           type: string
 *         class:
 *           type: string
 *         seat:
 *           type: number
 *         totalPrice:
 *           type: number
 * 
 */

const schema = new Mongoose.Schema(
  {
    flight: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: dbTables.FLIGHTS,
      required: true,
    },
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: dbTables.USER,
      required: true,
    },
    class: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    seat: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    },
    totalPrice: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: dbTables.BOOKINGS,
  }
);

export default Mongoose.model(dbTables.BOOKINGS, schema);