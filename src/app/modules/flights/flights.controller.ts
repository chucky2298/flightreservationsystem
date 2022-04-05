import * as service from './flights.service';

export const postFlight = async (req, res, next) => {
  try {
    const result = await service.createFlight({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getFlights = async (req, res, next) => {
  try {
    const result = await service.readFlights();
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getFlight = async (req, res, next) => {
  try {
    const result = await service.readOneFlight({ FlightId: req.params.id });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const patchFlight = async (req, res, next) => {
  try {
    await service.updateFlight({
      FlightId: req.params.id,
      requestBody: req.body,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const patchReservation = async (req, res, next) => {
  try {
    await service.updateReservation({
      FlightId: req.params.id,
      requestBody: req.body,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteFlight = async (req, res, next) => {
  try {
    await service.deleteFlight({
      FlightId: req.params.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};