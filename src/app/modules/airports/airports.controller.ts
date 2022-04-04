import * as service from './airports.service';

export const postAirport = async (req, res, next) => {
  try {
    const result = await service.createAirport({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAirports = async (req, res, next) => {
  try {
    const result = await service.readAirports({ requestParams: req.query });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAirport = async (req, res, next) => {
  try {
    const result = await service.readOneAirport({ airportId: req.params.id });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const patchAirport = async (req, res, next) => {
  try {
    await service.updateAirport({
      airportId: req.params.id,
      requestBody: req.body,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteAirport = async (req, res, next) => {
  try {
    await service.deleteAirport({
      airportId: req.params.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};