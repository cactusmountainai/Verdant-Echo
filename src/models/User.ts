export interface User {
  id: string; // UUID or unique identifier
  username: string;
  email: string;
  avatar?: string; // URL to avatar image
  createdAt: Date;
  updatedAt: Date;
}

// Optional: Class with methods if needed (e.g., validation)
export class UserEntity implements User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<User, 'createdAt' | 'updatedAt'>) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.avatar = data.avatar;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  update(data: Partial<User>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }
}
