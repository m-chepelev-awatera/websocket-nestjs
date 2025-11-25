import * as dotenv from 'dotenv';
import { ApplicationConfigDomainModel } from '@config/domain.models/application-config-domain-model';

const getEnvPath = () => {
  return '.env';
};

dotenv.config({
  path: getEnvPath(),
});

export default new ApplicationConfigDomainModel(process.env);
