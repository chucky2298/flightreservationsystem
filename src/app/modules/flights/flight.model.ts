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
 *         flight:
 *           type: string
 *         user:
 *           type: string
 *         seat:
 *           type: string
 *         totalPrice:
 *           type: float
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
    seat: {
      type: Mongoose.Schema.Types.String,
      required: true
    },
		totalPrice: {
      type: Mongoose.Schema.Types.Number,
      required: true
    }
  },
  {
    timestamps: true,
    collection: dbTables.FLIGHTS,
  },
);

export default Mongoose.model(dbTables.FLIGHTS, schema);