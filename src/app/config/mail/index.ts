import config from '../var/development';

import * as sendgridDriver from './sendgrid';

let mailService = null;

switch (config.mailService) {
  case 'sendgrid':
    mailService = sendgridDriver;
    break;
  default:
    mailService = sendgridDriver;
    break;
}

export default mailService;