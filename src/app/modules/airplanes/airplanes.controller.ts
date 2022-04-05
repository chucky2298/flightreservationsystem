import * as service from './airplanes.service';

export const postAirplane = async (req, res, next) => {
  try {
    const result = await service.createAirplane({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAirplanes = async (req, res, next) => {
  try {
    const result = await service.readAirplanes({ requestParams: req.query });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAirplane = async (req, res, next) => {
  try {
    const result = await service.readOneAirplane({ airplaneId: req.params.id });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const patchAirplane = async (req, res, next) => {
  try {
    await service.updateAirplane({
      airplaneId: req.params.id,
      requestBody: req.body,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteAirplane = async (req, res, next) => {
  try {
    await service.deleteAirplane({
      airplaneId: req.params.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};