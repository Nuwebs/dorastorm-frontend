import { BaseService } from '~/services/base-service';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import type { FetchedResponse } from '~/types/fetch';
import type { Role } from '~/types/role';
import type {
  User,
  NewUserFromAdmin,
  UpdateUser,
  ChangeUserPassword
} from '~/types/user';
import apiFetch from '~/utils/api-fetch';

const USER_ENDPOINT = '/users' as const;

export class UserService extends BaseService<User> {
  protected endpoint = USER_ENDPOINT;

  public async create(
    payload: NewUserFromAdmin
  ): Promise<
    FetchedResponse<User, LaravelValidationErrorBag<NewUserFromAdmin>>
  > {
    return apiFetch<User, LaravelValidationErrorBag<NewUserFromAdmin>>({
      endpoint: this.endpoint,
      options: {
        method: 'POST',
        body: payload
      }
    });
  }

  public async updateById(
    id: number,
    payload: UpdateUser
  ): Promise<FetchedResponse<User, LaravelValidationErrorBag<UpdateUser>>> {
    return apiFetch<User, LaravelValidationErrorBag<UpdateUser>>({
      endpoint: `${this.endpoint}/${id}`,
      options: {
        method: 'PATCH',
        body: payload
      }
    });
  }

  public async changePasswordById(
    id: number,
    payload: ChangeUserPassword
  ): Promise<
    FetchedResponse<void, LaravelValidationErrorBag<ChangeUserPassword>>
  > {
    return apiFetch<void, LaravelValidationErrorBag<ChangeUserPassword>>({
      endpoint: `${this.endpoint}/${id}/password`,
      options: {
        method: 'PATCH',
        body: payload
      }
    });
  }

  public async getRolesBelow(): Promise<FetchedResponse<Role[], unknown>> {
    return apiFetch<Role[], unknown>({
      endpoint: `${this.endpoint}/roles-below`
    });
  }
}
