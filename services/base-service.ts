import { QueryBuilder } from '@vortechron/query-builder-ts';
import { useNuxtApp } from '#app';
import type { GenericServiceQuery } from '~/types/service';

export abstract class BaseService<T> {
  protected abstract endpoint: string;
  protected api: typeof $fetch;

  constructor() {
    this.api = useNuxtApp().$api;
  }

  public query(): GenericServiceQuery<typeof this.endpoint> {
    return new QueryBuilder(this.endpoint) as GenericServiceQuery<
      typeof this.endpoint
    >;
  }

  public async index(
    customQuery?: GenericServiceQuery<typeof this.endpoint>
  ): Promise<T[]> {
    const queryObj = customQuery || this.query();

    return this.api<T[]>(queryObj.build());
  }

  public async findById(id: number): Promise<T> {
    return this.api<T>(`${this.endpoint}/${id}`);
  }

  public async deleteById(id: number): Promise<void> {
    return this.api<void>(`${this.endpoint}/${id}`, { method: 'DELETE' });
  }
}
