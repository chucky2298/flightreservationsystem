import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validatePostAirportRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      adress: Joi.object().required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePatchAirportRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      adress: Joi.object().required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};