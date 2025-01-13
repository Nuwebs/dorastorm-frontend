import type { QueryBuilder } from '@vortechron/query-builder-ts';
import type { FetchedResponse } from './fetch';

export type GenericServiceQuery<ServiceEndpoint = unknown> = Omit<
  QueryBuilder,
  '_path'
> & {
  _path: ServiceEndpoint;
};

export interface ModelService<ServiceEndpoint = unknown, Model = unknown> {
  query(): GenericServiceQuery<ServiceEndpoint>;

  findById?<ErrorT = unknown>(
    modelId: number
  ): Promise<FetchedResponse<Model, ErrorT>>;

  deleteById?<ReturnT = unknown, ErrorT = unknown>(
    modelId: number
  ): Promise<FetchedResponse<ReturnT, ErrorT>>;
}
