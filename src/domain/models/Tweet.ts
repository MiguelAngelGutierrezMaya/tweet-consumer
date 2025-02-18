import { User } from './User'

export interface Tweet {
  user: User
  content: string
  createdAt: Date
  updatedAt: Date
}
