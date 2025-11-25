import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { AccessTokenDomainModel } from '@users/domain-models/access-token-domain-model';
import { UserSchemaDefinition } from '@users/db/schemas/user-schema';
import { AccessTokenSchemaDefinition } from '@users/db/schemas/access-token-schema';
import { omit } from 'lodash';
import { RoleSchemaDefinition } from '@user-roles/db/schemas/role-schema';

const ObjectId = Types.ObjectId;
const ONE_HOUR = 60 * 1000 * 1000;

@Injectable()
export class DatabaseTestingService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getDbHandle(): Connection {
    return this.connection;
  }

  async dropDatabase(): Promise<void> {
    const db = this.connection.db;

    await db.dropDatabase();
  }

  async createUser(): Promise<AccessTokenDomainModel> {
    const userStub = {
      _id: new Types.ObjectId(),
      email: process.env.API_USER,
      username: process.env.API_USER,
      password: '',
      deleted: false,
    } as UserSchemaDefinition;

    const { insertedId } = await this.connection
      .collection('UserModel')
      .insertOne(userStub);

    const accessTokenStub = {
      _id: 'testAccessTokenId',
      ttl: ONE_HOUR,
      created: new Date(),
      userId: new ObjectId(insertedId),
    } as AccessTokenSchemaDefinition;

    const roleStub = {
      _id: new Types.ObjectId(),
      name: 'basicEmployee',
      created: new Date(),
      modified: new Date(),
      deleted: false,
    } as RoleSchemaDefinition;

    let employeeRole = await this.connection
      .collection('Role')
      .findOne({ name: 'basicEmployee' });
    if (!employeeRole) {
      await this.connection.collection('Role').insertOne(roleStub);
    }
    employeeRole = await this.connection
      .collection('Role')
      .findOne({ name: 'basicEmployee' });

    await this.connection.collection('RoleMapping').insertOne({
      principalType: 'USER',
      principalId: insertedId,
      roleId: employeeRole?._id,
    });
    //eslint-disable-next-line
    //@ts-ignore
    await this.connection.collection('AccessToken').insertOne(accessTokenStub);

    return AccessTokenDomainModel.CreateFromDatabase({
      id: accessTokenStub._id,
      ...omit(accessTokenStub, '_id'),
    });
  }
}
