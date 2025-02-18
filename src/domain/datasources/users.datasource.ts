import { User } from '@domain/models/User';

export interface UsersDatasource {
	findByUsername(username: string): Promise<User>;
}
