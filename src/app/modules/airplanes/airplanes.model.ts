import Mongoose from 'mongoose';

import dbTables from '../../constants/db_tables';

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     Airplane:
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         capacity:
 *           type: number
 * 
 */

const schema = new Mongoose.Schema(
  {
    name: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    capacity: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    }
  },
  {
    timestamps: true,
    collection: dbTables.AIRPLANES,
  },
);

export default Mongoose.model(dbTables.AIRPLANES, schema);