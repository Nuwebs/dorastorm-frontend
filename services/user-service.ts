import { QueryBuilder } from '@vortechron/query-builder-ts';
import type { FetchedResponse } from '~/types/fetch';
import type { GenericServiceQuery, ModelService } from '~/types/service';
import type { User } from '~/types/user';
import apiFetch from '~/utils/api-fetch';

const USER_ENDPOINT = '/users' as const;
type UserEndpoint = typeof USER_ENDPOINT;
type UserServiceQuery = GenericServiceQuery<UserEndpoint>;

export class UserService implements ModelService<UserEndpoint, User> {
  private endpoint: string;

  constructor() {
    this.endpoint = USER_ENDPOINT;
  }

  public query() {
    return new QueryBuilder(this.endpoint) as UserServiceQuery;
  }

  public async index(customQuery?: UserServiceQuery) {
    const queryObj: UserServiceQuery = customQuery || this.query();

    return apiFetch<User>({
      endpoint: queryObj.build()
    });
  }

  public findById(modelId: number): Promise<FetchedResponse<User, unknown>> {
    return apiFetch<User, unknown>({
      endpoint: this.endpoint + `/${modelId}`
    });
  }

  public deleteById(modelId: number): Promise<FetchedResponse<void, null>> {
    return apiFetch<void, null>({
      endpoint: this.endpoint + `/${modelId}`,
      options: {
        method: 'DELETE'
      }
    });
  }
}
