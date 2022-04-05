import { Router } from 'express';
import Passport from 'passport';

import * as controller from "./airplanes.controller";

const router = Router();
const BASE_ROUTE = `/airplanes`;

/**
 * Create airplane.
 * 
 * @openapi
 * 
 * paths:
 *   /airplanes:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airplanes
 *       summary: Create airplane (Admin only)
 *       description: Adds a new airplane.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - name
 *                 - capacity
 *               properties:
 *                 name:
 *                   type: string
 *                 capacity:
 *                   type: number
 *       responses:
 *         201:
 *           description: Airplane created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Airplane"
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
 *                     details: An airplane with the same name already exists
 *                   summary: Airplane exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}`).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postAirplane,
);

/**
 * Read airplanes.
 * 
 * @openapi
 * 
 * paths:
 *   /airplanes/all:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airplanes
 *       summary: Read airplanes
 *       description: Reads airplanes.
 *       responses:
 *         200:
 *           description: airplanes read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Airplane"
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
    controller.getAirplanes
  );

/**
 * Read airplane.
 * 
 * @openapi
 * 
 * paths:
 *   /airplanes/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airplanes
 *       summary: Read airplane
 *       description: Reads one airplane by Id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Airplane Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Airplane read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Airplane"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .get(Passport.authenticate("jwt", { session: false }), controller.getAirplane);

/**
 * Update airplane.
 * 
 * @openapi
 * 
 * paths:
 *   /airplanes/{id}:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airplanes
 *       summary: Update airplane (Admin only)
 *       description: Updates an existing airplane.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Airplane Id
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
 *                 capacity:
 *                   type: number
 *       responses:
 *         204:
 *           description: Airplane updated successfully.
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
 *                     details: An airplane with the same name already exists
 *                   summary: Airplane exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .patch(
    Passport.authenticate("jwt", { session: false }),
    controller.patchAirplane
  );

/**
 * Delete airplane.
 * 
 * @openapi
 * 
 * paths:
 *   /airplanes/{id}:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Airplanes
 *       summary: Delete airplane (Admin only)
 *       description: Deletes an existing airplane.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Airplane Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Airplane deleted successfully.
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
  controller.deleteAirplane,
);

export default router;
