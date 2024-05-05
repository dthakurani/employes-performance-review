import { Role } from './users.enum';

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  designationId: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
