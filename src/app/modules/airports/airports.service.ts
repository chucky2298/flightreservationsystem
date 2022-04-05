import * as validator from './airports.validator';
import * as authorization from './airports.authorization';
import * as dal from './airports.dal';
import { UnprocessableEntity, NotFound } from '../../utils/error';


export const createAirport = async ({ requestBody, user }) => {
	authorization.authorizeWriteRequest({ user });
  validator.validatePostAirportRequest({ input: requestBody });
  const existingAirport = await dal.findAirport({
    query: {
      equal: {
        name: requestBody.name,
      },
    },
  });

  if (existingAirport) {
    throw new UnprocessableEntity("Airport name exists");
  }

  const createdAirport = await dal.createAirport({ content: requestBody });
  return createdAirport;
};


export const readAirports = async ({ requestParams }) => {
  const query = {};
  const projection = requestParams?.fields
    ? requestParams.fields.split(",")
    : ["name", "adress"];

  const airport = await dal.findAirports({ query, projection });
  return airport;
};


export const readOneAirport = async ({ airportId }) => {
  const airport = await dal.findAirport({
    query: { equal: { _id: airportId } },
  });

  if (!airport) {
    throw new NotFound("Airport not found");
  }

  return airport;
};


export const updateAirport = async ({ airportId, requestBody, user }) => {
  validator.validatePatchAirportRequest({ input: requestBody });
  authorization.authorizeWriteRequest({ user });

  const airport = await dal.findAirport({
    query: { equal: { _id: airportId } },
  });

  if (!airport) {
    throw new NotFound();
  }

  if (requestBody.name) {
    const name = requestBody.name || airport.name;
    const existingAirport = await dal.findAirport({
      query: {
        equal: {
          name: name,
        },
        notEqual: {
          _id: airportId,
        },
      },
    });

    if (existingAirport) {
      throw new UnprocessableEntity("Airport name exists");
    }
  }

  await dal.updateAirport({
    query: { _id: airportId },
    content: requestBody,
  });
};


export const deleteAirport = async ({ user, airportId }) => {
	authorization.authorizeWriteRequest({ user });
  const deletedAirport = await dal.deleteOneAirport({
    query: { _id: airportId },
  });

  if (!deletedAirport) {
    throw new NotFound();
  }

	await dal.deleteFlights(airportId)
};