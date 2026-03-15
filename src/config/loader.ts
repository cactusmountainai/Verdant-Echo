import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'dotenv';

// Define configuration interface
export interface Config {
  [key: string]: any;
}

class ConfigLoader {
  private config: Config = {};

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    // Try .env file first
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = parse(envContent);
        this.config = { ...this.config, ...envVars };
      } catch (error) {
        console.warn('Failed to parse .env file:', error);
      }
    }

    // Try config.yaml file
    const yamlPath = path.resolve(process.cwd(), 'config.yaml');
    if (fs.existsSync(yamlPath)) {
      try {
        const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const yamlLines = yamlContent.split('\n');
        const yamlConfig: Config = {};
        
        yamlLines.forEach(line => {
          line = line.trim();
          if (!line || line.startsWith('#')) return;
          
          // Handle key:value pairs
          if (line.includes(':') && !line.endsWith(':')) {
            const [keyPart, valuePart] = line.split(':', 1);
            const trimmedKey = keyPart.trim();
            let trimmedValue = valuePart ? valuePart.trim() : '';
            
            // Handle string values with quotes
            if ((trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) || 
                (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))) {
              trimmedValue = trimmedValue.slice(1, -1);
            }
            
            // Convert types
            if (trimmedValue === 'true') {
              yamlConfig[trimmedKey] = true;
            } else if (trimmedValue === 'false') {
              yamlConfig[trimmedKey] = false;
            } else if (!isNaN(Number(trimmedValue)) && trimmedValue.indexOf('.') === -1) {
              yamlConfig[trimmedKey] = Number(trimmedValue);
            } else if (!isNaN(Number(trimmedValue))) {
              yamlConfig[trimmedKey] = parseFloat(trimmedValue);
            } else {
              yamlConfig[trimmedKey] = trimmedValue;
            }
          }
        });
        
        this.config = { ...this.config, ...yamlConfig };
      } catch (error) {
        console.warn('Failed to parse config.yaml:', error);
      }
    }

    // Fall back to environment variables for all vars
    Object.keys(process.env).forEach(key => {
      if (!(key in this.config)) {
        this.config[key] = process.env[key];
      }
    });
  }

  get(key: string): any {
    return this.config[key];
  }

  getAll(): Config {
    return { ...this.config };
  }

  has(key: string): boolean {
    return key in this.config;
  }
}

// Create singleton instance
const configLoader = new ConfigLoader();
export default configLoader;
