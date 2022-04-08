import * as service from "./bookings.service";

export const postBooking = async (req, res, next) => {
  try {
    const result = await service.createBooking({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const result = await service.readBookings({
      user: req.user,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const result = await service.readOneBooking({ bookingId: req.params.id });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await service.deleteBooking({
      BookingId: req.params.id,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
