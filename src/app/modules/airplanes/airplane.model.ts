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
 *         model:
 *           type: string
 */

const schema = new Mongoose.Schema(
  {
    model: {
      type: Mongoose.Schema.Types.String,
      required: true,
    }
  },
  {
    timestamps: true,
    collection: dbTables.AIRPLANES,
  },
);

export default Mongoose.model(dbTables.AIRPLANES, schema);