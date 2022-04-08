import Booking from './bookings.model';

export const findBooking = async ({ query }) => {
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

  const result = await Booking.findOne(dbQuery);
  return result;
};

export const findBookings = async ({ query }) => {
  const result = await Booking.find(query);
  return result;
};

export const createBooking = async ({ content }) => {
  const result = await Booking.create(content);
  return result;
};

export const updateBooking = async ({ query, content }) => {
  const options = { new: true };
  const result = await Booking.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};

export const deleteOneBooking = async ({ query }) => {
  const result = await Booking.findOneAndDelete(query);
  return result;
};