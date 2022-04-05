import Airplane from './airplanes.model';

export const findAirplane = async ({ query }) => {
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

  const result = await Airplane.findOne(dbQuery);
  return result;
};

export const findAirplanes = async ({ query, projection }) => {
  const result = await Airplane.find(query, projection);
  return result;
};

export const createAirplane = async ({ content }) => {
  const result = await Airplane.create(content);
  return result;
};

export const updateAirplane = async ({ query, content }) => {
  const options = { new: true };
  const result = await Airplane.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};

export const deleteOneAirplane = async ({ query }) => {
  const result = await Airplane.findOneAndDelete(query);
  return result;
};