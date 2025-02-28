import { BaseService } from '~/services/base-service';
import type { Role } from '~/types/role';
import type {
  User,
  NewUserFromAdmin,
  UpdateUser,
  ChangeUserPassword
} from '~/types/user';

const USER_ENDPOINT = '/users' as const;

export class UserService extends BaseService<User> {
  protected endpoint = USER_ENDPOINT;

  public async store(payload: NewUserFromAdmin): Promise<User> {
    return this.api<User>(this.endpoint, {
      method: 'POST',
      body: payload
    });
  }

  public async updateById(id: number, payload: UpdateUser): Promise<User> {
    return this.api<User>(`${this.endpoint}/${id}`, {
      method: 'PATCH',
      body: payload
    });
  }

  public async changePasswordById(
    id: number,
    payload: ChangeUserPassword
  ): Promise<void> {
    return this.api<void>(`${this.endpoint}/${id}/password`, {
      method: 'PATCH',
      body: payload
    });
  }

  public async getRolesBelow(): Promise<Role[]> {
    return this.api<Role[]>(`${this.endpoint}/roles-below`);
  }
}
