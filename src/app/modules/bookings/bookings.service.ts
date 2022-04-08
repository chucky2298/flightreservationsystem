/* eslint-disable @typescript-eslint/no-var-requires */
import * as validator from "./bookings.validator";
import * as authorization from "./bookings.authorization";
import * as dal from "./bookings.dal";
import * as flightdal from "../flights/flights.dal";
import * as airplaneDal from "../airplanes/airplanes.dal";
import * as airportDal from "../airports/airports.dal";
import * as userDal from "../users/users.dal";
import { NotFound, UnprocessableEntity } from "../../utils/error";

export const createBooking = async ({ requestBody, user }) => {
  validator.validatePostBookingRequest({ input: requestBody });
  const Flight = await flightdal.findFlight({
    query: { equal: { _id: requestBody.flight } },
  });
  const firstClassSeats = await updateReservation(requestBody);
  let totalPrice = Flight.price;
  let additionalPrice = 0;
  let travelClass = "Business class";

  if (requestBody.seat <= firstClassSeats) {
    additionalPrice = Flight.firstClassPrice;
    totalPrice = Flight.price + Flight.firstClassPrice;
    travelClass = "First class";
  }
  const newrequestBody = {
    flight: requestBody.flight,
    seat: requestBody.seat,
    user: user._id,
    totalPrice: totalPrice,
    class: travelClass,
  };
  const createdBooking = await dal.createBooking({ content: newrequestBody });
  generatePdf(createdBooking, additionalPrice, user);
  return createdBooking;
};

export const readBookings = async ({ user }) => {
  authorization.authorizeWriteRequest({ user });
  const query = {};
  const Booking = await dal.findBookings({ query });
  return Booking;
};

export const readOneBooking = async ({ bookingId }) => {
  const booking = await dal.findBooking({
    query: { equal: { _id: bookingId } },
  });

  if (!booking) {
    throw new NotFound("Booking not found");
  }

  return booking;
};

export const deleteBooking = async ({ BookingId }) => {
  const Booking = await readOneBooking({ bookingId: BookingId });
  await cancelReservation(Booking);
  const deletedBooking = await dal.deleteOneBooking({
    query: { _id: BookingId },
  });

  if (!deletedBooking) {
    throw new NotFound();
  }
};

export const updateReservation = async (Booking) => {
  const Flight = await flightdal.findFlight({
    query: { equal: { _id: Booking.flight } },
  });

  if (!Flight) {
    throw new NotFound();
  }

  const Airplane = await airplaneDal.findAirplane({
    query: { equal: { _id: Flight.airplane } },
  });

  if (Booking.seat > Airplane.capacity) {
    throw new UnprocessableEntity("Seat number is over airplane capacity");
  }

  const seatsReserved = Flight.seatsReserved;

  if (seatsReserved.includes(Booking.seat)) {
    throw new UnprocessableEntity("Seat is already reserved");
  }

  seatsReserved.push(Booking.seat);
  const content = {
    seatsReserved: seatsReserved,
  };

  await flightdal.updateFlight({
    query: { _id: Booking.flight },
    content: content,
  });
  return Airplane.firstClassSeats;
};

export const cancelReservation = async (Booking) => {
  console.log(Booking);
  console.log(Booking.flight);
  const Flight = await flightdal.findFlight({
    query: { equal: { _id: Booking.flight.toString() } },
  });

  if (!Flight) {
    throw new NotFound();
  }

  const Airplane = await airplaneDal.findAirplane({
    query: { equal: { _id: Flight.airplane } },
  });

  if (Booking.seat > Airplane.capacity) {
    throw new UnprocessableEntity("Seat number is over airplane capacity");
  }

  const seatsReserved = Flight.seatsReserved;

  if (!seatsReserved.includes(Booking.seat)) {
    throw new UnprocessableEntity("Seat isn't reserved");
  }

  seatsReserved.forEach((element, index) => {
    if (element == Booking.seat) delete seatsReserved[index];
  });
  const content = {
    seatsReserved: seatsReserved,
  };

  await flightdal.updateFlight({
    query: { _id: Booking.flight },
    content: content,
  });
};

export const generatePdf = async (createdBooking, additionalPrice, user) => {
  const Flight = await flightdal.findFlight({
    query: { equal: { _id: createdBooking.flight.toString() } },
  });

  const Airplane = await airplaneDal.findAirplane({
    query: { equal: { _id: Flight.airplane } },
  });

  const departureAirport = await airportDal.findAirport({
    query: { equal: { _id: Flight.departureAirport } },
  });

  const arrivalAirport = await airportDal.findAirport({
    query: { equal: { _id: Flight.arrivalAirport } },
  });

  const ourUser = await userDal.findUser({
    query: { equal: { _id: user._id } },
  });

  console.log("Booking", createdBooking);
  console.log("Flight", Flight);
  console.log("Airplane", Airplane);
  console.log("Departure airport", departureAirport);
  console.log("Arrival airport", arrivalAirport);
  console.log("User", ourUser);
	const depDate = Flight.departureDate.toString().substring(0, [21]);
	const arrDate = Flight.arrivalDate.toString().substring(0, [21]);
	const newDepDate = new Date(depDate);
	const newArrDate = new Date(arrDate);
	const flightDuration = newArrDate.getTime() - newDepDate.getTime();
	console.log(flightDuration)
	function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  }
	const flightDur = convertMsToTime(flightDuration);
  const fonts = {
    Roboto: {
      normal: __dirname + "/public/fonts/Roboto-Regular.ttf",
      bold: __dirname + "/public/fonts/Roboto-Medium.ttf",
      italics: __dirname + "/public/fonts/Roboto-Italic.ttf",
      bolditalics: __dirname + "/public/fonts/Roboto-MediumItalic.ttf",
    },
  };

  const PdfPrinter = require("pdfmake");
  const printer = new PdfPrinter(fonts);
  const fs = require("fs");

  const docDefinition = {
    content: [
      { text: `Dear ${ourUser.firstName} ${ourUser.lastName}`, style: "header" },
      "You can find below informations needed for your flight.",
      {
        text: `${departureAirport.adress.city},${departureAirport.adress.country} -> ${arrivalAirport.adress.city},${arrivalAirport.adress.country}`,
        style: "subheader",
        margin: [0, 50, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Departure date",
          },
          {
            width: 150,
            text: `${depDate}`,
          },
          {
            width: 100,
            text: "Seat number:",
          },
          {
            width: 150,
            text: `${createdBooking.seat}`,
          },
        ],
        margin: [0, 20, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Arrival date",
          },
          {
            width: 150,
            text: `${arrDate}`,
          },
          {
            width: 100,
            text: "Class:",
          },
          {
            width: 150,
            text: `${createdBooking.class}`,
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Flight duration",
          },
          {
            width: 150,
            text: `${flightDur}`,
          },
          {
            width: 100,
            text: "Airplane:",
          },
          {
            width: 150,
            text: `${Airplane.name}`,
          },
        ],
        margin: [0, 10, 0, 0],
      },
      { text: "Pricing", style: "subheader", margin: [0, 30, 0, 20] },
      {
        style: "tableExample",
        table: {
          widths: [200, 100],
          body: [
            ["Details", "Price"],
            ["Fair price", { text: `${Flight.price} $`, italics: true }],
            [
              `${createdBooking.class}`,
              { text: `${additionalPrice} $`, italics: true },
            ],
            [
              { text: "Total price", bold: true },
              {
                text: `${createdBooking.totalPrice} $`,
                italics: true,
                bold: true,
              },
            ],
          ],
        },
      },
      {
        text: "Thank you for flying with us.",
        style: "subheader",
        margin: [0, 100, 0, 0],
      },
      {
        text: `${Flight.company}`,
        style: "header",
        margin: [0, 10, 0, 30],
      },
      {
        image: __dirname + "/public/airplane.png",
        width: 300,
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
  };

  const options = {
    // ...
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.pipe(fs.createWriteStream("document.pdf"));
  pdfDoc.end();
};
