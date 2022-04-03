import Mongoose from 'mongoose';

import dbTables from '../../constants/db_tables';

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     Airport:
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         city:
 *           type: string
 */

const schema = new Mongoose.Schema(
  {
    name: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    city: {
      type: Mongoose.Schema.Types.String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: dbTables.AIRPORTS,
  },
);

export default Mongoose.model(dbTables.AIRPORTS, schema);