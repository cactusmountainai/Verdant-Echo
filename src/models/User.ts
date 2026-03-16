export class User {
  id?: string | number;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    email: string, 
    name: string, 
    role: string = 'farmer'
  ) {
    this.email = email.trim().toLowerCase();
    this.name = name.trim();
    this.role = ['admin', 'manager', 'farmer', 'observer'].includes(role.toLowerCase()) 
      ? role.toLowerCase() : 'farmer';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Validation method
  validate(): boolean {
    if (!this.email || !this.isValidEmail(this.email)) return false;
    if (!this.name || this.name.trim().length === 0) return false;
    
    const validRoles = ['admin', 'manager', 'farmer', 'observer'];
    if (!validRoles.includes(this.role)) return false;

    return true;
  }

  // Helper method to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to JSON serializable object
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
