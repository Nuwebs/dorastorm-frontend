import { QueryBuilder } from '@vortechron/query-builder-ts';
import type { User } from '~/types/user';
import apiFetch from '~/utils/api-fetch';

const USER_ENDPOINT: string = '/users';

type UserServiceQuery = Omit<QueryBuilder, '_path'> & { _path: '/users' }; // Todo: try to set it as USER_ENDPONT

export class UserService {
  private endpoint: string;

  constructor() {
    this.endpoint = USER_ENDPOINT;
  }

  public query(): UserServiceQuery {
    return new QueryBuilder(this.endpoint) as UserServiceQuery;
  }

  public async index(customQuery?: UserServiceQuery) {
    return apiFetch<User>({
      endpoint: (customQuery || this.query()).build()
    });
  }
}

// Prove that this works
// (new UserService()).index(new UserService().query());
