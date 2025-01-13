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

  public findById<ErrorT = unknown>(
    modelId: number
  ): Promise<FetchedResponse<User, ErrorT>> {
    return apiFetch<User, ErrorT>({
      endpoint: this.endpoint + `/${modelId}`
    });
  }
}
