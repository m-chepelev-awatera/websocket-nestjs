import { Model, Types } from 'mongoose';
import { ConflictError } from '@lib/errors/conflict.error';
import { ISchemaFactory } from '@lib/db/ischema.factory';
import { getEnsureCustom } from '@lib/validation/validation.helpers';
import {
  InjectModel,
  MongooseModule,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeMongoConnection,
  DatabaseTestingModule,
} from '@app/database/database.testing.module';
import { NotFoundError } from '@lib/errors/not.found.error';
import { ArgumentError } from '@lib/errors/argument.error';

import {
  BaseObjectIdLoopbackDomainModel,
  IBaseObjectIdLoopbackDomainModel,
} from '@/lib/domain-models/base.objectId.loopback.domain.model';
import { BaseObjectIdLoopbackSchema } from '@/lib/db/schemas/base-object-id-loopback.schema';
import { BaseObjectIdLoopbackRepository } from '@/lib/db/repositories/loopback/base-object-id-loopback-repository';

class TestDomainModel extends BaseObjectIdLoopbackDomainModel {
  private constructor(data: IBaseObjectIdLoopbackDomainModel) {
    super({ ...data });
  }

  public static Create(id?: Types.ObjectId): TestDomainModel {
    const now = new Date(Date.now());

    return new TestDomainModel({
      id: id ?? new Types.ObjectId(),
      deleted: false,
      modifiedDate: now,
      modifiedBy: undefined,
    });
  }

  public static CreateFromDatabase(
    id: Types.ObjectId,
    deleted: boolean,
    modifiedDate: Date,
    modifiedBy: Types.ObjectId,
  ) {
    return new TestDomainModel({
      id,
      deleted,
      modifiedDate,
      modifiedBy,
    });
  }

  public toString(): string {
    return `TestDomainModel id: '${this.id}`;
  }
}

class TestDomainModel2 extends BaseObjectIdLoopbackDomainModel {
  private constructor(data: IBaseObjectIdLoopbackDomainModel) {
    super({ ...data });
  }

  public static Create(id?: Types.ObjectId): TestDomainModel {
    const now = new Date(Date.now());

    return new TestDomainModel2({
      id: id ?? new Types.ObjectId(),
      deleted: false,
      modifiedDate: now,
      modifiedBy: undefined,
    });
  }

  public static CreateFromDatabase(
    id: Types.ObjectId,
    deleted: boolean,
    modifiedDate: Date,
    modifiedBy: Types.ObjectId,
  ) {
    return new TestDomainModel2({
      id,
      deleted,
      modifiedDate,
      modifiedBy,
    });
  }

  public toString(): string {
    return `TestDomainModel2 id: '${this.id}`;
  }
}

@Schema({ versionKey: false, collection: 'baseLoopbackRepositoryTests' })
export class TestSchemaDefinition extends BaseObjectIdLoopbackSchema {}

export const TestSchema = SchemaFactory.createForClass(TestSchemaDefinition);

@Injectable()
export class TestSchemaFactory
  implements ISchemaFactory<TestDomainModel, TestSchemaDefinition>
{
  create(entity: TestDomainModel): TestSchemaDefinition {
    return {
      _id: entity.id,
      deleted: entity.deleted,
      modifiedDate: entity.modifiedDate,
      modifiedBy: entity.modifiedBy,
    } as TestSchemaDefinition;
  }

  createFromSchema(schema: TestSchemaDefinition): TestDomainModel {
    return TestDomainModel.CreateFromDatabase(
      schema._id,
      schema.deleted,
      schema.modifiedDate,
      schema.modifiedBy,
    );
  }
}

export const ensureTestEntity = getEnsureCustom(
  (dm: TestDomainModel) => dm instanceof TestDomainModel,
  `Not a valid ${TestDomainModel.name}`,
);

@Injectable()
export class TestRepository extends BaseObjectIdLoopbackRepository<
  TestDomainModel,
  TestSchemaDefinition
> {
  public constructor(
    @InjectModel(TestSchemaDefinition.name)
    requestModel: Model<TestSchemaDefinition>,
    schemaFactory: TestSchemaFactory,
  ) {
    super(requestModel, schemaFactory, ensureTestEntity);
  }
}

jest.setTimeout(30000);

function expectMatch(
  actualModel: TestDomainModel | null,
  expectedModel: TestDomainModel,
) {
  expect(actualModel?.id).toStrictEqual(expectedModel.id);
  expect(actualModel?.deleted).toStrictEqual(expectedModel.deleted);
  expect(actualModel?.modifiedDate).toStrictEqual(expectedModel.modifiedDate);
  expect(actualModel?.modifiedBy).toStrictEqual(expectedModel.modifiedBy);
}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseTestingModule.register(),
        MongooseModule.forFeature([
          {
            name: TestSchemaDefinition.name,
            schema: TestSchema,
          },
        ]),
      ],
      providers: [TestSchemaFactory, TestRepository],
    }).compile();

    repository = moduleRef.get<TestRepository>(TestRepository);
  }, 30000);

  afterAll(async () => {
    await closeMongoConnection();
  });
  describe('insert', () => {
    it('should insert model with correct value of unique field', async () => {
      const expectedTestEntity1 = TestDomainModel.Create();
      const expectedTestEntity2 = TestDomainModel.Create();
      await repository.insert(expectedTestEntity1);
      await repository.insert(expectedTestEntity2);

      const actualTestEntity1 = await repository.getById(
        expectedTestEntity1.id,
      );
      const actualTestEntity2 = await repository.getById(
        expectedTestEntity2.id,
      );

      expectMatch(actualTestEntity1, expectedTestEntity1);
      expectMatch(actualTestEntity2, expectedTestEntity2);
    });
    it('should not insert model with wrong value of unique field', async () => {
      const expectedTestEntity1 = TestDomainModel.Create();
      await repository.insert(expectedTestEntity1);

      const expectedTestEntity2 = TestDomainModel.Create(
        expectedTestEntity1.id,
      );

      await expect(repository.insert(expectedTestEntity2)).rejects.toThrowError(
        ConflictError,
      );
    });
    it('should throw error if type of model is wrong', async () => {
      const entityWithWrongType = TestDomainModel2.Create();
      await expect(repository.insert(entityWithWrongType)).rejects.toThrowError(
        ArgumentError,
      );
    });
  });
  describe('update', () => {
    it('should update model correctly', async () => {
      const testEntity = TestDomainModel.Create();
      await repository.insert(testEntity);

      const expectedEntity = await repository.getById(testEntity.id);
      await repository.update(expectedEntity);
      const actualEntity = await repository.getById(testEntity.id);

      expectMatch(expectedEntity, actualEntity);
    });
    it('should throw error if type of model is wrong', async () => {
      const entityWithWrongType = TestDomainModel2.Create();
      await expect(repository.update(entityWithWrongType)).rejects.toThrowError(
        ArgumentError,
      );
    });
  });
  describe('getById', () => {
    it('should get model by id', async () => {
      const expectedTestEntity = TestDomainModel.Create();
      await repository.insert(expectedTestEntity);
      const actualTestEntity = await repository.getById(expectedTestEntity.id);

      expectMatch(actualTestEntity, expectedTestEntity);
    });
    it('should throw error if record not found by id', async () => {
      await expect(
        repository.getById(new Types.ObjectId()),
      ).rejects.toThrowError(NotFoundError);
    });
    it('should throw error if type of id is wrong', async () => {
      const idWithWrongType: any = 'wrong id';
      await expect(repository.getById(idWithWrongType)).rejects.toThrowError(
        ArgumentError,
      );
    });
  });
  describe('getByIds', () => {
    it('should get models by ids', async () => {
      const expectedTestEntity1 = TestDomainModel.Create();
      const expectedTestEntity2 = TestDomainModel.Create();
      await repository.insert(expectedTestEntity1);
      await repository.insert(expectedTestEntity2);
      const actualTestEntities = await repository.getByIds([
        expectedTestEntity1.id,
        expectedTestEntity2.id,
      ]);
      const actualEntity1 =
        actualTestEntities.find((e) => e.id.equals(expectedTestEntity1.id)) ||
        null;
      const actualEntity2 =
        actualTestEntities.find((e) => e.id.equals(expectedTestEntity2.id)) ||
        null;

      expect(actualTestEntities.length).toStrictEqual(2);
      expect(actualEntity1).not.toBeNull();
      expectMatch(actualEntity1, expectedTestEntity1);
      expect(actualEntity2).not.toBeNull();
      expectMatch(actualEntity2, expectedTestEntity2);
    });
    it('should not get model if record not found by id', async () => {
      const actualTestEntities = await repository.getByIds([
        new Types.ObjectId(),
        new Types.ObjectId(),
      ]);
      expect(actualTestEntities.length).toStrictEqual(0);
    });
    it('should throw error if type of id is wrong', async () => {
      const idWithWrongType: any = 'wrong id';
      await expect(repository.getByIds([idWithWrongType])).rejects.toThrowError(
        ArgumentError,
      );
    });
  });
  describe('tryGetById', () => {
    it('should get model by id', async () => {
      const expectedTestEntity = TestDomainModel.Create();
      await repository.insert(expectedTestEntity);
      const actualTestEntity = await repository.tryGetById(
        expectedTestEntity.id,
      );

      expectMatch(actualTestEntity, expectedTestEntity);
    });
    it('should return null if record not found by id', async () => {
      const actualEntity = await repository.tryGetById(new Types.ObjectId());
      await expect(actualEntity).toBeNull();
    });
    it('should throw error if type of id is wrong', async () => {
      const idWithWrongType: any = 'wrong id';
      await expect(repository.tryGetById(idWithWrongType)).rejects.toThrowError(
        ArgumentError,
      );
    });
  });
  describe('deleteById', () => {
    it('should delete model by id', async () => {
      const expectedTestEntity = TestDomainModel.Create();
      await repository.insert(expectedTestEntity);
      await repository.deleteById(expectedTestEntity.id);

      await expect(
        repository.getById(expectedTestEntity.id),
      ).rejects.toThrowError(NotFoundError);
    });
    it('should throw error if record not found by id', async () => {
      await expect(
        repository.deleteById(new Types.ObjectId()),
      ).rejects.toThrowError(NotFoundError);
    });
    test.each(['', 'invalid-id', 123, null])(
      'should throw error on invalid id:%s',
      async (value: any) => {
        await expect(repository.deleteById(value)).rejects.toThrowError(
          ArgumentError,
        );
      },
    );
  });
});
