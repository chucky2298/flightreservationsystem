import * as validator from './flights.validator';
import * as authorization from './flights.authorization';
import * as dal from './flights.dal';
import * as airplaneDal from '../airplanes/airplanes.dal';
import { NotFound, UnprocessableEntity } from '../../utils/error';


export const createFlight = async ({ requestBody, user }) => {
	authorization.authorizeWriteRequest({ user });
  validator.validatePostFlightRequest({ input: requestBody });

  const createdFlight = await dal.createFlight({ content: requestBody });
  return createdFlight;
};


export const readFlights = async () => {
  const query = {};
  const Flight = await dal.findFlights({ query });
  return Flight;
};


export const readOneFlight = async ({ FlightId }) => {
  const Flight = await dal.findFlight({
    query: { equal: { _id: FlightId } },
  });

  if (!Flight) {
    throw new NotFound("Flight not found");
  }

  return Flight;
};


export const updateFlight = async ({ FlightId, requestBody, user }) => {
  validator.validatePatchFlightRequest({ input: requestBody });
  authorization.authorizeWriteRequest({ user });

  const Flight = await dal.findFlight({
    query: { equal: { _id: FlightId } },
  });

  if (!Flight) {
    throw new NotFound();
  }

  await dal.updateFlight({
    query: { _id: FlightId },
    content: requestBody,
  });
};

export const updateReservation = async ({ FlightId, requestBody }) => {
  validator.validatePatchReservationRequest({ input: requestBody });

  const Flight = await dal.findFlight({
    query: { equal: { _id: FlightId } },
  });

  if (!Flight) {
    throw new NotFound();
  }

  const Airplane = await airplaneDal.findAirplane({
    query: { equal: { _id: Flight.airplane } },
  });

	if (requestBody.seatNumber > Airplane.capacity) {
    throw new UnprocessableEntity("Seat number is over airplane capacity");
  }

	const seatsReserved = Flight.seatsReserved;

	if (seatsReserved.includes(requestBody.seatNumber)) {
    throw new UnprocessableEntity("Seat is already reserved");
  }

	seatsReserved.push(requestBody.seatNumber)
	const content = {
		seatsReserved: seatsReserved,
	}

  await dal.updateFlight({
    query: { _id: FlightId },
    content: content,
  });
};

export const cancelReservation = async ({ FlightId, requestBody }) => {
  validator.validatePatchReservationRequest({ input: requestBody });

  const Flight = await dal.findFlight({
    query: { equal: { _id: FlightId } },
  });

  if (!Flight) {
    throw new NotFound();
  }

  const Airplane = await airplaneDal.findAirplane({
    query: { equal: { _id: Flight.airplane } },
  });

	if (requestBody.seatNumber > Airplane.capacity) {
    throw new UnprocessableEntity("Seat number is over airplane capacity");
  }

	const seatsReserved = Flight.seatsReserved;

	if (!seatsReserved.includes(requestBody.seatNumber)) {
    throw new UnprocessableEntity("Seat isn't reserved");
  }

	seatsReserved.forEach((element, index) => {
    if (element == requestBody.seatNumber) delete seatsReserved[index];
  });
	const content = {
		seatsReserved: seatsReserved,
	}

  await dal.updateFlight({
    query: { _id: FlightId },
    content: content,
  });
};

export const deleteFlight = async ({ user, FlightId }) => {
	authorization.authorizeWriteRequest({ user });
  const deletedFlight = await dal.deleteOneFlight({
    query: { _id: FlightId },
  });

  if (!deletedFlight) {
    throw new NotFound();
  }

	dal.deleteBookings(FlightId);
};