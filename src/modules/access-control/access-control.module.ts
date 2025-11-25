import { Module } from '@nestjs/common';
import { UserRoleModule } from '@user-roles/user-role.module';
import { AccessControlService } from './services/access-control.service';

@Module({
  imports: [UserRoleModule],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
