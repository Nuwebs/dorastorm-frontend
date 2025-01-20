import { QueryBuilder } from '@vortechron/query-builder-ts';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import type { NewRole, Role } from '~/types/role';
import type { GenericServiceQuery, ModelService } from '~/types/service';
import apiFetch from '~/utils/api-fetch';

const ROLE_ENDPOINT = '/roles' as const;
type RoleEndpoint = typeof ROLE_ENDPOINT;
type RoleServiceQuery = GenericServiceQuery<RoleEndpoint>;

export class RoleService implements ModelService<RoleEndpoint, Role> {
  public query() {
    return new QueryBuilder(ROLE_ENDPOINT) as RoleServiceQuery;
  }

  public create(payload: NewRole) {
    return apiFetch<Role, LaravelValidationErrorBag<NewRole>>({
      endpoint: ROLE_ENDPOINT,
      options: {
        method: 'POST',
        body: payload
      }
    });
  }

  public findById(modelId: number) {
    return apiFetch<Role, unknown>({
      endpoint: ROLE_ENDPOINT + `/${modelId}`
    });
  }

  public updateById(modelId: number, payload: NewRole) {
    return apiFetch<Role, LaravelValidationErrorBag<NewRole>>({
      endpoint: ROLE_ENDPOINT + `/${modelId}`,
      options: {
        method: 'PATCH',
        body: payload
      }
    });
  }

  public deleteById(modelId: number) {
    return apiFetch<void, null>({
      endpoint: ROLE_ENDPOINT + `/${modelId}`,
      options: {
        method: 'DELETE'
      }
    });
  }
}
