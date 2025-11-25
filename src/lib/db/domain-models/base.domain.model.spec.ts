import { Types } from 'mongoose';
import { ArgumentError } from '@lib/errors/argument.error';
import {
  BaseDomainModel,
  IBaseDomainModel,
} from '@/lib/db/domain-models/base.domain.model';
import {
  EnsureCheck,
  getEnsureCustom,
} from '@lib/validation/validation.helpers';
import { v4 } from 'uuid';

const validChecker = {
  ensureId: getEnsureCustom((value) => value != null, 'invalid id!'),
};
const invalidChecker = {
  ensureId: getEnsureCustom(() => false, 'invalid id!'),
};

class TestDerivedDomainModel extends BaseDomainModel<any> {
  public toString(): string {
    return this.id.toString();
  }

  constructor(data: IBaseDomainModel<any>, check: EnsureCheck<any>) {
    super({ ...data }, check);
  }
}

function createModel({
  id,
  createdAt,
  updatedAt,
  changeStamp,
  check,
}: any = {}) {
  return new TestDerivedDomainModel(
    {
      id: id ?? new Types.ObjectId(),
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date(),
      changeStamp: changeStamp ?? 'a1d4eac8-7bf6-4a14-9f77-c7cba7c0e0ec',
    },
    check ?? validChecker.ensureId,
  );
}

describe('Test class derived from BaseDomainModel', () => {
  describe('Create class via constructor', () => {
    it('should not create from invalid createdAt', () => {
      expect(() => createModel({ createdAt: 'invalid date' })).toThrow(
        ArgumentError,
      );
    });

    it('should not create from invalid updatedAt', () => {
      expect(() => createModel({ updatedAt: 'invalid date' })).toThrow(
        ArgumentError,
      );
    });

    it('should not create from invalid changeStamp', () => {
      expect(() => createModel({ changeStamp: 9 })).toThrow(ArgumentError);
    });

    it('should call id validator', () => {
      const checkSpy = jest.spyOn(validChecker, 'ensureId');
      expect(() => createModel()).not.toThrow();
      expect(checkSpy).toBeCalledTimes(1);
    });

    it('should throw on id validation fail', () => {
      const checkSpy = jest.spyOn(invalidChecker, 'ensureId');
      expect(() =>
        createModel({
          check: invalidChecker.ensureId,
        }),
      ).toThrow();
      expect(checkSpy).toBeCalledTimes(1);
    });

    it('should create with correct params', () => {
      const testId = v4();
      const now = new Date(Date.now());
      const changeStamp = v4();
      let model;

      expect(() => {
        model = createModel({
          id: testId,
          createdAt: now,
          updatedAt: now,
          changeStamp: changeStamp,
        });
      }).not.toThrow();

      expect(model.id).toBe(testId);
      expect(model.createdAt).toBe(now);
      expect(model.updatedAt).toBe(now);
      expect(model.changeStamp).toBe(changeStamp);
    });
  });

  it('should update changeStamp and updatedAt', () => {
    const model = createModel();
    const oldChangStamp = model.changeStamp;
    const oldUpdatedAt = model.updatedAt;
    model.updateChangeStamp();
    expect(model.changeStamp).not.toBe(oldChangStamp);
    expect(model.updatedAt).not.toBe(oldUpdatedAt);
  });

  it('should create instance of derived class', () => {
    const model = createModel();
    expect(model).toBeInstanceOf(TestDerivedDomainModel);
  });
});
