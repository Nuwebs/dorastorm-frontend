import { QueryBuilder } from '@vortechron/query-builder-ts';
import type { FetchedResponse } from '~/types/fetch';
import type { GenericServiceQuery } from '~/types/service';
import apiFetch from '~/utils/api-fetch';

export abstract class BaseService<T> {
  protected abstract endpoint: string;

  public query(): GenericServiceQuery<typeof this.endpoint> {
    return new QueryBuilder(this.endpoint) as GenericServiceQuery<
      typeof this.endpoint
    >;
  }

  public async index(
    customQuery?: GenericServiceQuery<typeof this.endpoint>
  ): Promise<FetchedResponse<T[], unknown>> {
    const queryObj = customQuery || this.query();
    return apiFetch<T[]>({
      endpoint: queryObj.build()
    });
  }

  public async findById(id: number): Promise<FetchedResponse<T, unknown>> {
    return apiFetch<T>({
      endpoint: `${this.endpoint}/${id}`
    });
  }

  public async deleteById(id: number): Promise<FetchedResponse<void, null>> {
    return apiFetch<void, null>({
      endpoint: `${this.endpoint}/${id}`,
      options: { method: 'DELETE' }
    });
  }
}
