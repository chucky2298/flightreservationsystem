import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validatePostFlightRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      departureAirport: Joi.string().required(),
      arrivalAirport: Joi.string().required(),
      airplane: Joi.string().required(),
      company: Joi.string().required(),
      departureDate: Joi.date().required(),
      arrivalDate: Joi.date().required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePatchFlightRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      departureAirport: Joi.string().required(),
      arrivalAirport: Joi.string().required(),
      airplane: Joi.string().required(),
      company: Joi.string().required(),
      departureDate: Joi.date().required(),
      arrivalDate: Joi.date().required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePatchReservationRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      seatNumber: Joi.number().integer().min(1).required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};