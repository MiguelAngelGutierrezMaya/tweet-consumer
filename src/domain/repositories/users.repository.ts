import { User } from '@domain/models/User';

export interface UsersRepository {
	findByUsername(username: string): Promise<User>;
}
