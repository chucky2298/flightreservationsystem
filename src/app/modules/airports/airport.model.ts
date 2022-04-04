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
 *         adress:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             zipcode:
 *               type: number
 *             city:
 *               type: string
 *             country:
 *               type: string
 */

const adress = new Mongoose.Schema(
  {
    street: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    zipcode: {
      type: Mongoose.Schema.Types.Number,
      required: true
    },
    city: {
      type: Mongoose.Schema.Types.String,
      required: true
    },
    country: {
      type: Mongoose.Schema.Types.String,
      required: true
    }
  }
);
const schema = new Mongoose.Schema(
  {
    name: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    adress: {
      type: adress,
      required: true
    }
  },
  {
    timestamps: true,
    collection: dbTables.AIRPORTS,
  },
);

export default Mongoose.model(dbTables.AIRPORTS, schema);