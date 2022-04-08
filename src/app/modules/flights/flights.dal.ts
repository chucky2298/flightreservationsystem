import bookingsModel from '../bookings/bookings.model';
import Flight from './flights.model';

export const findFlight = async ({ query }) => {
  const dbQuery = {};

  if (query.equal) {
    Object.keys(query.equal).forEach((key) => {
      dbQuery[key] = {
        $eq: query.equal[key],
      };
    });
  }
  if (query.notEqual) {
    Object.keys(query.notEqual).forEach((key) => {
      dbQuery[key] = {
        $ne: query.notEqual[key],
      };
    });
  }

  const result = await Flight.findOne(dbQuery);
  return result;
};

export const findFlights = async ({ query }) => {
  const result = await Flight.find(query);
  return result;
};

export const createFlight = async ({ content }) => {
  const result = await Flight.create(content);
  return result;
};

export const updateFlight = async ({ query, content }) => {
  const options = { new: true };
  const result = await Flight.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};

export const deleteOneFlight = async ({ query }) => {
  const result = await Flight.findOneAndDelete(query);
  return result;
};

export const deleteBookings = async (flight) => {
  await bookingsModel.deleteMany({ flight: flight });
};