import User from '../auth/user.model';

export const findUser = async ({ query }) => {
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

  const result = await User.findOne(dbQuery);
  return result;
};

export const findUsers = async ({ query, projection }) => {
  const result = await User.find(query, projection);
  return result;
};

export const updateUser = async ({ query, content }) => {
  const options = { new: true };
  const result = await User.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};
