import { Injectable } from '@nestjs/common';
import { ApplicationConfigDomainModel } from '@config/domain.models/application-config-domain-model';

@Injectable()
export class ConfigService {
  constructor(private readonly config: ApplicationConfigDomainModel) {}

  getConfig() {
    return this.config;
  }
}
