export default {
  port: process.env.PORT || 8000,
  appName: "flight-app",
  databaseUrl:
    "mongodb+srv://chucky:k26X_F6NRFve.Nj@cluster0.bqoys.mongodb.net/flightapp?retryWrites=true&w=majority",
  apiDocsUsername: "username",
  apiDocsPassword: "password",
  mailService: "sendgrid",
  mailServiceApiKey:
    "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",
  mailServiceSender: "yassine.chouk@softup.co",
  jwtSecretKey: "process.env.JWT_SECRET_KEY",
};
