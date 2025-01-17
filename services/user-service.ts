import { QueryBuilder } from '@vortechron/query-builder-ts';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import type { FetchedResponse } from '~/types/fetch';
import type { Role } from '~/types/role';
import type { GenericServiceQuery, ModelService } from '~/types/service';
import type {
  ChangeUserPassword,
  NewUserFromAdmin,
  UpdateUser,
  User
} from '~/types/user';
import apiFetch from '~/utils/api-fetch';

const USER_ENDPOINT = '/users' as const;
type UserEndpoint = typeof USER_ENDPOINT;
type UserServiceQuery = GenericServiceQuery<UserEndpoint>;

export class UserService implements ModelService<UserEndpoint, User> {
  public query() {
    return new QueryBuilder(USER_ENDPOINT) as UserServiceQuery;
  }

  public async index(customQuery?: UserServiceQuery) {
    const queryObj: UserServiceQuery = customQuery || this.query();

    return apiFetch<User>({
      endpoint: queryObj.build()
    });
  }

  public findById(modelId: number): Promise<FetchedResponse<User, unknown>> {
    return apiFetch<User, unknown>({
      endpoint: USER_ENDPOINT + `/${modelId}`
    });
  }

  public deleteById(modelId: number): Promise<FetchedResponse<void, null>> {
    return apiFetch<void, null>({
      endpoint: USER_ENDPOINT + `/${modelId}`,
      options: {
        method: 'DELETE'
      }
    });
  }

  public getRolesBelow(): Promise<FetchedResponse<Role[], unknown>> {
    return apiFetch<Role[], unknown>({
      endpoint: USER_ENDPOINT + '/roles-below'
    });
  }

  public create(
    payload: NewUserFromAdmin
  ): Promise<
    FetchedResponse<User, LaravelValidationErrorBag<NewUserFromAdmin>>
  > {
    return apiFetch<User, LaravelValidationErrorBag<NewUserFromAdmin>>({
      endpoint: USER_ENDPOINT,
      options: {
        method: 'POST',
        body: payload
      }
    });
  }

  public updateById(
    modelId: number,
    payload: UpdateUser
  ): Promise<FetchedResponse<User, LaravelValidationErrorBag<UpdateUser>>> {
    return apiFetch<User, LaravelValidationErrorBag<NewUserFromAdmin>>({
      endpoint: USER_ENDPOINT + `/${modelId}`,
      options: {
        method: 'PATCH',
        body: payload
      }
    });
  }

  public changePasswordById(modelId: number, payload: ChangeUserPassword) {
    return apiFetch<void, LaravelValidationErrorBag<ChangeUserPassword>>({
      endpoint: USER_ENDPOINT + `/${modelId}/password`,
      options: {
        method: 'PATCH',
        body: payload
      }
    });
  }
}
