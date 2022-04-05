import * as validator from './airplanes.validator';
import * as authorization from './airplanes.authorization';
import * as dal from './airplanes.dal';
import { UnprocessableEntity, NotFound } from '../../utils/error';


export const createAirplane = async ({ requestBody, user }) => {
	authorization.authorizeWriteRequest({ user });
  validator.validatePostAirplaneRequest({ input: requestBody });
  const existingAirplane = await dal.findAirplane({
    query: {
      equal: {
        name: requestBody.name,
      },
    },
  });

  if (existingAirplane) {
    throw new UnprocessableEntity("Airplane name exists");
  }

  const createdAirplane = await dal.createAirplane({ content: requestBody });
  return createdAirplane;
};


export const readAirplanes = async ({ requestParams }) => {
  const query = {};
  const projection = requestParams?.fields
    ? requestParams.fields.split(",")
    : ["name", "capacity"];

  const airplane = await dal.findAirplanes({ query, projection });
  return airplane;
};


export const readOneAirplane = async ({ airplaneId }) => {
  const airplane = await dal.findAirplane({
    query: { equal: { _id: airplaneId } },
  });

  if (!airplane) {
    throw new NotFound("Airplane not found");
  }

  return airplane;
};


export const updateAirplane = async ({ airplaneId, requestBody, user }) => {
  validator.validatePatchAirplaneRequest({ input: requestBody });
  authorization.authorizeWriteRequest({ user });

  const airplane = await dal.findAirplane({
    query: { equal: { _id: airplaneId } },
  });

  if (!airplane) {
    throw new NotFound();
  }

  if (requestBody.name) {
    const name = requestBody.name || airplane.name;
    const existingAirplane = await dal.findAirplane({
      query: {
        equal: {
          name: name,
        },
        notEqual: {
          _id: airplaneId,
        },
      },
    });

    if (existingAirplane) {
      throw new UnprocessableEntity("Airplane name exists");
    }
  }

  await dal.updateAirplane({
    query: { _id: airplaneId },
    content: requestBody,
  });
};


export const deleteAirplane = async ({ user, airplaneId }) => {
	authorization.authorizeWriteRequest({ user });
  const deletedAirplane = await dal.deleteOneAirplane({
    query: { _id: airplaneId },
  });

  if (!deletedAirplane) {
    throw new NotFound();
  }

	await dal.deleteFlights(airplaneId);
};