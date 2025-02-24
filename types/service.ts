import type { QueryBuilder } from '@vortechron/query-builder-ts';

export type GenericServiceQuery<ServiceEndpoint = unknown> = Omit<
  QueryBuilder,
  '_path'
> & {
  _path: ServiceEndpoint;
};
