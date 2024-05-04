import { UUID } from 'crypto';

export interface IJwtPayload {
  id: UUID;
  device_name: UUID;
}
