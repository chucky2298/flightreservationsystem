import flightsModel from '../flights/flights.model';
import Airport from './airport.model';

export const findAirport = async ({ query }) => {
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

  const result = await Airport.findOne(dbQuery);
  return result;
};

export const findAirports = async ({ query, projection }) => {
  const result = await Airport.find(query, projection);
  return result;
};

export const createAirport = async ({ content }) => {
  const result = await Airport.create(content);
  return result;
};

export const updateAirport = async ({ query, content }) => {
  const options = { new: true };
  const result = await Airport.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};

export const deleteOneAirport = async ({ query }) => {
  const result = await Airport.findOneAndDelete(query);
  return result;
};

export const deleteFlights = async (airport) => {
  await flightsModel.deleteMany({ departureAirport: airport });
  await flightsModel.deleteMany({ arrivalAirport: airport });
};