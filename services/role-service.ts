import { BaseService } from '~/services/base-service';
import type { Role, NewRole } from '~/types/role';

const ROLE_ENDPOINT = '/roles' as const;

export class RoleService extends BaseService<Role> {
  protected endpoint = ROLE_ENDPOINT;

  public async store(payload: NewRole): Promise<Role> {
    return this.api<Role>(this.endpoint, {
      method: 'POST',
      body: payload
    });
  }

  public async updateById(id: number, payload: NewRole): Promise<Role> {
    return this.api<Role>(`${this.endpoint}/${id}`, {
      method: 'PATCH',
      body: payload
    });
  }
}
