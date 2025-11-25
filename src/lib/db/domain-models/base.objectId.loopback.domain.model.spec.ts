import { ArgumentError } from '@lib/errors/argument.error';
import { z, ZodError } from 'zod';
import {
  BaseObjectIdLoopbackModel,
  getZodBaseObjectIdDomainModel,
} from './base.objectId.loopback.domain.model';
import { Types } from 'mongoose';

const TestSchema = BaseObjectIdLoopbackModel.extend({
  someId: z.instanceof(Types.ObjectId),
  someString: z.string(),
  someNumber: z.number(),
  someBoolean: z.boolean(),
  optionalProp: z.string().nullish(),
});
type TestSchema = z.infer<typeof TestSchema>;

class TestDomainModel extends getZodBaseObjectIdDomainModel(TestSchema) {
  constructor({ ...data }: TestSchema) {
    super(data);
    this.privateProp = 'private';
  }

  getPrivateProp() {
    return this.privateProp;
  }

  private privateProp: string;
}

const testData = {
  id: new Types.ObjectId(),
  someId: new Types.ObjectId(),
  someString: 'test',
  someNumber: 154,
  someBoolean: true,
  deleted: false,
};

describe('Test base domain model with ObjectId id', () => {
  describe('Create instance via constructor', () => {
    it('should not create from invalid id', () => {
      expect(() => {
        new TestDomainModel({ ...testData, id: 'incorrect' } as any);
      }).toThrow(ArgumentError);
    });

    it('should not create with invalid modifiedDate', () => {
      expect(() => {
        new TestDomainModel({
          ...testData,
          modifiedDate: 'invalid date',
        } as any);
      }).toThrow(ArgumentError);
    });

    it('should not create with invalid model prop', () => {
      expect(() => {
        new TestDomainModel({
          ...testData,
          someNumber: 'invalid number',
        } as any);
      }).toThrow(ZodError);
    });

    it('should not create with not defined model prop', () => {
      expect(() => {
        new TestDomainModel({ ...testData, extra: 'invalid' } as any);
      }).toThrow(ZodError);
    });

    it('should not create with undefined required model prop', () => {
      expect(() => {
        new TestDomainModel({ ...testData, someNumber: undefined } as any);
      }).toThrow(ZodError);
    });

    it('should add modifiedDate if it not defined', () => {
      const model = new TestDomainModel(testData);
      expect(model.modifiedDate).not.toBeUndefined();
    });

    it('should create instance of class', () => {
      const model = new TestDomainModel(testData);
      expect(model).toBeInstanceOf(TestDomainModel);

      expect(model.id).toBe(testData.id);
      expect(model.deleted).toBe(testData.deleted);
      expect(model.someId).toBe(testData.someId);
      expect(model.someString).toBe(testData.someString);
      expect(model.someNumber).toBe(testData.someNumber);
      expect(model.someBoolean).toBe(testData.someBoolean);
    });
  });

  describe('use custom method', () => {
    it('getPrivateProp should work', () => {
      const model = new TestDomainModel(testData);
      const raw = model.getPrivateProp();
      expect(raw).toEqual('private');
    });
  });

  describe('get raw data', () => {
    it('should get data', () => {
      const modifiedDate = new Date();
      const model = new TestDomainModel({
        ...testData,
        modifiedDate,
      });
      const raw = model.getRawData();
      expect(raw).toEqual({
        ...testData,
        modifiedDate,
      });
    });
  });
});
