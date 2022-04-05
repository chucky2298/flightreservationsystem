import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validatePostAirplaneRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      capacity: Joi.number().required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePatchAirplaneRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      capacity: Joi.number().required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};