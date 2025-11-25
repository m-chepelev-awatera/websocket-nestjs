export interface ISchemaFactory<TDomainModel, TSchemaDefinition> {
  create(domainModel: TDomainModel): TSchemaDefinition;
  createFromSchema(schema: TSchemaDefinition): TDomainModel;
}
