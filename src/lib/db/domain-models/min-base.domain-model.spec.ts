import { ArgumentError } from '@lib/errors/argument.error';
import { z, ZodError } from 'zod';
import { Types } from 'mongoose';
import { getZodMinBaseDomainModel, MinModel } from './min-base.domain-model';

const TestSchema = MinModel.extend({
  someId: z.instanceof(Types.ObjectId),
  someString: z.string(),
  someNumber: z.number(),
  someBoolean: z.boolean(),
  optionalProp: z.string().nullish(),
});
type TestSchema = z.infer<typeof TestSchema>;

class TestDomainModel extends getZodMinBaseDomainModel(TestSchema) {
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
};

describe('Test base min domain model', () => {
  describe('Create instance via constructor', () => {
    it('should not create from invalid id', () => {
      expect(() => {
        new TestDomainModel({ ...testData, id: 'incorrect-id' } as any);
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

    it('should create instance of class', () => {
      const model = new TestDomainModel(testData);
      expect(model).toBeInstanceOf(TestDomainModel);

      expect(model.id).toBe(testData.id);
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
      const model = new TestDomainModel(testData);
      const raw = model.getRawData();
      expect(raw).toEqual(testData);
    });
  });
});
