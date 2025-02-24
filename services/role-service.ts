import { BaseService } from '~/services/base-service';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import type { FetchedResponse } from '~/types/fetch';
import type { Role, NewRole } from '~/types/role';
import apiFetch from '~/utils/api-fetch';

const ROLE_ENDPOINT = '/roles' as const;

export class RoleService extends BaseService<Role> {
  protected endpoint = ROLE_ENDPOINT;

  public async create(
    payload: NewRole
  ): Promise<FetchedResponse<Role, LaravelValidationErrorBag<NewRole>>> {
    return apiFetch<Role, LaravelValidationErrorBag<NewRole>>({
      endpoint: this.endpoint,
      options: {
        method: 'POST',
        body: payload
      }
    });
  }

  public async updateById(
    id: number,
    payload: NewRole
  ): Promise<FetchedResponse<Role, LaravelValidationErrorBag<NewRole>>> {
    return apiFetch<Role, LaravelValidationErrorBag<NewRole>>({
      endpoint: `${this.endpoint}/${id}`,
      options: {
        method: 'PATCH',
        body: payload
      }
    });
  }
}
