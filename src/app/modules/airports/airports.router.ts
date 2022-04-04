import { Router } from 'express';
import Passport from 'passport';

import * as controller from "./airports.controller";

const router = Router();
const BASE_ROUTE = `/airports`;

/**
 * Create airport.
 * 
 * @openapi
 * 
 * paths:
 *   /airports:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airports
 *       summary: Create airport (Admin only)
 *       description: Adds a new airport.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - name
 *                 - adress
 *               properties:
 *                 name:
 *                   type: string
 *                 adress:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     zipcode:
 *                       type: number
 *                     city:
 *                       type: string
 *                     country:
 *                       type: string
 *       responses:
 *         201:
 *           description: Airport created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Airport"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 authorExists:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Unprocessable Entity
 *                     message: Your request was understood but could not be completed due to semantic errors
 *                     details: An airport with the same name already exists
 *                   summary: Airport exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}`).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postAirport,
);

/**
 * Read airports.
 * 
 * @openapi
 * 
 * paths:
 *   /airports/all:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airports
 *       summary: Read airports
 *       description: Reads airports.
 *       responses:
 *         200:
 *           description: Airports read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Airport"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/all`)
  .get(
    Passport.authenticate("jwt", { session: false }),
    controller.getAirports
  );

/**
 * Read airport.
 * 
 * @openapi
 * 
 * paths:
 *   /airports/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airports
 *       summary: Read airport
 *       description: Reads one airport by Id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Airport Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Airport read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Airport"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .get(Passport.authenticate("jwt", { session: false }), controller.getAirport);

/**
 * Update airport.
 * 
 * @openapi
 * 
 * paths:
 *   /airports/{id}:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airports
 *       summary: Update airport (Admin only)
 *       description: Updates an existing airport.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Airport Id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 name:
 *                   type: string
 *                 adress:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     zipcode:
 *                       type: number
 *                     city:
 *                       type: string
 *                     country:
 *                       type: string
 *       responses:
 *         204:
 *           description: Airport updated successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 authorExists:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Unprocessable Entity
 *                     message: Your request was understood but could not be completed due to semantic errors
 *                     details: An airport with the same name already exists
 *                   summary: Airport exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .patch(
    Passport.authenticate("jwt", { session: false }),
    controller.patchAirport
  );

/**
 * Delete airport.
 * 
 * @openapi
 * 
 * paths:
 *   /airports/{id}:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airports
 *       summary: Delete airport (Admin only)
 *       description: Deletes an existing airport.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Airport Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Airport deleted successfully.
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteAirport,
);

export default router;
