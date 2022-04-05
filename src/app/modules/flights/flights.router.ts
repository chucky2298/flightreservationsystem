import { Router } from 'express';
import Passport from 'passport';

import * as controller from "./flights.controller";

const router = Router();
const BASE_ROUTE = `/flights`;

/**
 * Create Flight.
 * 
 * @openapi
 * 
 * paths:
 *   /flights:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Flights
 *       summary: Create flight (Admin only)
 *       description: Adds a new flight.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - departureAirport
 *                 - arrivalAirport
 *                 - departureDate
 *                 - arrivalDate
 *                 - airplane
 *                 - company
 *               properties:
 *                 departureAirport:
 *                   type: string
 *                 arrivalAirport:
 *                   type: string
 *                 departureDate:
 *                   type: string
 *                   format: datetime
 *                 arrivalDate:
 *                   type: string
 *                   format: datetime
 *                 airplane:
 *                   type: string
 *                 company:
 *                   type: string
 *       responses:
 *         201:
 *           description: Flight created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Flight"
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
  controller.postFlight,
);

/**
 * Read Flights.
 * 
 * @openapi
 * 
 * paths:
 *   /flights/all:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Flights
 *       summary: Read Flights
 *       description: Reads Flights.
 *       responses:
 *         200:
 *           description: Flights read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Flight"
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
    controller.getFlights
  );

/**
 * Read Flight.
 * 
 * @openapi
 * 
 * paths:
 *   /flights/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Flights
 *       summary: Read Flight
 *       description: Reads one Flight by Id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Flight Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Flight read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Flight"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .get(Passport.authenticate("jwt", { session: false }), controller.getFlight);

/**
 * Update Flight.
 * 
 * @openapi
 * 
 * paths:
 *   /flights/{id}:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Flights
 *       summary: Update Flight (Admin only)
 *       description: Updates an existing Flight.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Flight Id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 departureAirport:
 *                   type: string
 *                 arrivalAirport:
 *                   type: string
 *                 departureDate:
 *                   type: string
 *                   format: datetime
 *                 arrivalDate:
 *                   type: string
 *                   format: datetime
 *                 airplane:
 *                   type: string
 *                 company:
 *                   type: string
 *       responses:
 *         204:
 *           description: Flight updated successfully.
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
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .patch(
    Passport.authenticate("jwt", { session: false }),
    controller.patchFlight
  );

/**
 * Reserve seat.
 * 
 * @openapi
 * 
 * paths:
 *   /flights/seats/{id}:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Flights
 *       summary: Reserve seat
 *       description: Reserving a seat in the flight.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Flight Id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 seatNumber:
 *                   type: number
 *       responses:
 *         204:
 *           description: Seat reserved successfully.
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
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/seats/:id`)
  .patch(
    Passport.authenticate("jwt", { session: false }),
    controller.patchReservation
  );

/**
 * Delete Flight.
 * 
 * @openapi
 * 
 * paths:
 *   /flights/{id}:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Flights
 *       summary: Delete Flight (Admin only)
 *       description: Deletes an existing Flight.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Flight Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Flight deleted successfully.
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
  controller.deleteFlight,
);

export default router;
