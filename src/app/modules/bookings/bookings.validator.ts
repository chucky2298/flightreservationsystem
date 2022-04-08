import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validatePostBookingRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      flight: Joi.string().required(),
      seat: Joi.number().integer().required(),
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
      seat: Joi.number().integer().min(1).required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};