import { Router } from 'express';
import Passport from 'passport';

import * as controller from "./bookings.controller";

const router = Router();
const BASE_ROUTE = `/bookings`;

/**
 * Book flight.
 * 
 * @openapi
 * 
 * paths:
 *   /bookings:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Bookings
 *       summary: Create Booking
 *       description: Adds a new Booking.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - flight
 *                 - seat
 *               properties:
 *                 flight:
 *                   type: string
 *                 seat:
 *                   type: number
 *       responses:
 *         201:
 *           description: Booking created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Booking"
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
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}`).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postBooking,
);

/**
 * Read Bookings.
 * 
 * @openapi
 * 
 * paths:
 *   /bookings:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Bookings
 *       summary: Read Bookings (Admin only)
 *       description: Reads Bookings.
 *       responses:
 *         200:
 *           description: Bookings read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Booking"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}`)
  .get(
    Passport.authenticate("jwt", { session: false }),
    controller.getBookings
  );

/**
 * Delete booking.
 * 
 * @openapi
 * 
 * paths:
 *   /bookings/delete/{id}:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Bookings
 *       summary: Delete booking
 *       description: Deletes an existing booking.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Booking Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Booking deleted successfully.
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/delete/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteBooking,
);


/**
 * Read airport.
 * 
 * @openapi
 * 
 * paths:
 *   /bookings/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Bookings
 *       summary: Read booking
 *       description: Reads one booking by Id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Booking Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Booking read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Booking"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .get(Passport.authenticate("jwt", { session: false }), controller.getBooking);
export default router;
