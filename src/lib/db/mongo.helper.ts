import {
  ensurePositiveNumber,
  notNull,
} from '@lib/validation/validation.helpers';
import { FilterQuery, Model, PipelineStage, QueryOptions } from 'mongoose';
import { v4 } from 'uuid';

export interface IterateFindByBatchOptions {
  projection?: any;
  queryOptions: QueryOptions;
}

/**
 *
 * @param dbModel - коллекция, по которой ведется поиск
 * @param aggregationPipeline - пайплайн агрегации монго - массив шагов
 * @param batchSize - количество элементов, которое будет возращаться в рамках одного запроса к БД
 * @param allowDiskUse  - опция использования диска для агрегации
 * @param logger - провайдер логирования
 * @param logType - метка для лога
 * @returns {AsyncGenerator<*, void, *>} - генератор, для асинхронного перебора поисковой выдачи
 */
export async function* iterateAggregationRequest<T>(
  dbModel: Model<T>,
  aggregationPipeline: PipelineStage[],
  batchSize,
  allowDiskUse = false,
  logger: any,
  logType = 'iterateAggregationRequestInfo',
) {
  let processedItemsCount = 0;
  const cursor = dbModel
    .aggregate(aggregationPipeline, {
      batchSize,
      allowDiskUse,
    })
    .cursor();

  let hasItemsToProcess = true;
  while (hasItemsToProcess) {
    const item = await cursor.next();
    const newBatchStarted =
      processedItemsCount === 0 ||
      (processedItemsCount >= batchSize &&
        processedItemsCount % batchSize === 0);

    if (newBatchStarted) {
      const currentBatchNumber =
        Math.floor(processedItemsCount / batchSize) + 1;
      // TODO: логгер в бд лупбека, переделать на локи
      logger.logData({
        type: logType,
        data: {
          date: new Date(),
          currentBatchNumber,
          requestedBatchSize: batchSize,
          aggregation: JSON.stringify(aggregationPipeline),
        },
      });
    }

    if (item) {
      processedItemsCount++;
      yield item;
    } else {
      hasItemsToProcess = false;
    }
  }
}

/**
 * Итератор по результатам запроса find, возвращающий весь массив,
 *  который получен при очередном запросе по пачке
 * @param {Object} dbCollection - коллекция mongo , по которой ведется поиск
 * @param {Object} queryObject  - объект с запросом для find
 * @param {Object} optionsObject  - объект с настройками для find
 * @param {Number} batchSize - максимальное количество элементов,
 *  которое будет возращаться при каждом вызове генератора (= при каждом запросе к БД)
 * @param {Function} logger - провайдер логирования
 * @param {String} logType - метка для лога
 * @returns {AsyncGenerator<*, void, *>} - генератор, для асинхронного перебора поисковой выдачи
 */
export async function* iterateFindByBatch<T>(
  dbModel: Model<T>,
  queryObject: FilterQuery<T>,
  options: IterateFindByBatchOptions,
  batchSize,
  logger,
  logType = 'iterateFindByBatch',
) {
  notNull({ dbModel });
  ensurePositiveNumber({ batchSize });
  notNull({ queryObject });
  notNull({ queryObject });

  const cursor = dbModel
    .find(queryObject, options?.projection, options?.queryOptions)
    .batchSize(batchSize)
    .cursor();
  const batchIterator = iterateMongoByBatch(
    cursor,
    queryObject,
    batchSize,
    logger,
    logType,
  );
  yield* batchIterator;
}

/**
 * Возвращает логгер с предустановленными значениями
 * @param {Number} batchSize - максимальное количество элементов,
 *  которое будет возращаться при каждом вызове генератора
 * @param {Function} logger - провайдер логирования
 * @param {String} logType - метка для лога
 * @param {Object} aggregationPipeline  - aggregation pipeline
 * @returns {Function} функция логирования хода итерирования
 */
function setLogger(batchSize, logger, logType, query, session) {
  return logger
    ? (processedItemsCount) => {
        const currentBatchNumber =
          Math.floor(processedItemsCount / batchSize) + 1;
        logger.logData({
          type: logType,
          data: {
            date: new Date(),
            session,
            currentBatchNumber,
            requestedBatchSize: batchSize,
            query: JSON.stringify(query),
          },
        });
      }
    : () => null;
}

/**
 * Универсальный метод возвращения батчами результаотв запросов в монго
 * @param {*} param0
 * @param {Object} param0.cursor  - cursor для получения данных из базы
 * @param {Object} param0.queryForLog  - pipeline или filter-объект с запросом для find (для логирования)
 * @param {Number} param0.batchSize - максимальное количество элементов,
 *  которое будет возращаться при каждом вызове генератора
 * @param {Function} param0.logger - провайдер логирования
 * @param {String} param0.logType - метка для лога
 * @returns {AsyncGenerator<*, void, *>} - генератор, для асинхронного перебора поисковой выдачи
 */
async function* iterateMongoByBatch(
  cursor,
  queryForLog,
  batchSize,
  logger,
  logType,
) {
  const logData = setLogger(
    batchSize,
    logger,
    logType.toString(),
    queryForLog,
    v4(),
  );

  let processedItemsCount = 0;
  logData(processedItemsCount);
  let hasItemsToProcess = true;
  let findResults: any[] = [];

  while (hasItemsToProcess) {
    const item = await cursor.next();
    if (item) {
      findResults.push(item);
      processedItemsCount++;
      if (findResults.length >= batchSize) {
        logData(processedItemsCount);
        yield findResults;
        findResults = [];
      }
    } else {
      if (findResults.length > 0) {
        yield findResults;
      }
      hasItemsToProcess = false;
    }
  }
}
/**
 * Итератор по результатам aggregation, возвращающий весь массив,
 *  который получен при очередном запросе по пачке
 * @param {Object} dbCollection - коллекция mongo, по которой ведется агрегирование
 * @param {Object} aggregationPipeline  - pipeline для aggrgation
 * @param {Number} batchSize - максимальное количество элементов,
 *  которое будет возращаться при каждом вызове генератора
 * @param {Boolean} allowDiskUse  - опция использования диска для агрегации
 * @param {Function} logger - провайдер логирования
 * @param {String} logType - метка для лога
 * @returns {AsyncGenerator<*, void, *>} - генератор, для асинхронного перебора поисковой выдачи
 */
export async function* iterateAggregationByBatch<T>(
  dbModel: Model<T>,
  aggregationPipeline: PipelineStage[],
  batchSize,
  allowDiskUse = false,
  logger,
  logType = 'iterateAggregationByBatch',
) {
  if (!dbModel) throw new Error('dbModel should be provided');
  if (!aggregationPipeline)
    throw new Error('aggregationPipeline should be provided');
  if (aggregationPipeline.length === 0)
    throw new Error('aggregationPipeline should not be empty');

  const aggregate = dbModel.aggregate(aggregationPipeline, {
    batchSize,
    allowDiskUse,
  });

  const batchIterator = iterateMongoByBatch(
    aggregate.cursor(),
    aggregationPipeline,
    batchSize,
    logger,
    logType,
  );

  yield* batchIterator;
}
