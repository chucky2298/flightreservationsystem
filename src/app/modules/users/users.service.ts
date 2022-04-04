import * as validator from './users.validator';
import * as authorization from './users.authorization';
import * as dal from './users.dal';



export const readUsers = async ({ requestParams, user }) => {
  authorization.authorizeWriteRequest({ user });
  const query = {};
  const projection = requestParams?.fields
    ? requestParams.fields.split(",")
    : [
        "firstName",
        "lastName",
        "email",
        "createdAt",
        "updatedAt",
        "confirmationLevel",
      ];

  const users = await dal.findUsers({ query, projection });
  return users;
};


export const readOneUser = async ({ user }) => {
	const profile = await dal.findUser({
    query: { equal: { _id: user._id } },
  });
  return profile;
};


export const updateUser = async ({ user, requestBody }) => {
  validator.validatePatchAuthorRequest({ input: requestBody });

  await dal.updateUser({
    query: { _id: user._id },
    content: requestBody,
  });
};
