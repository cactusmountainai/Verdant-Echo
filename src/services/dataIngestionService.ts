import { Project } from '../models/Project';
import { User } from '../models/User';

interface IngestionResult {
  success: boolean;
  data?: any[];
  errors: string[];
  metadata?: Record<string, any>;
}

export class DataIngestionService {
  private readonly allowedFileTypes = ['csv', 'json'];
  
  async ingestFile(file: File): Promise<IngestionResult> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !this.allowedFileTypes.includes(extension)) {
      return {
        success: false,
        errors: [`Unsupported file type: ${extension}. Only CSV and JSON files are allowed.`],
      };
    }
    
    try {
      const content = await this.readFileContent(file);
      
      let parsedData: any[];
      if (extension === 'csv') {
        parsedData = await this.parseCSV(content);
      } else {
        parsedData = await this.parseJSON(content);
      }
      
      // Validate the data structure
      const validationErrors = this.validateDataStructure(parsedData);
      
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors,
        };
      }
      
      return {
        success: true,
        data: parsedData,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: extension,
          recordCount: parsedData.length
        },
        errors: [],
      };
    } catch (error) {
      console.error('Ingestion error:', error);
      return {
        success: false,
        errors: [`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      };
    }
  }
  
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
  
  private async parseCSV(content: string): Promise<any[]> {
    // Split by lines and remove empty ones
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      return [];
    }
    
    // Parse headers
    const headers = this.parseCSVLine(lines[0]);
    const data: any[] = [];
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      
      if (values.length === 0) continue;
      
      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        // Handle case where there are more values than headers
        if (index < values.length) {
          row[header] = this.parseCSVValue(values[index]);
        }
      });
      
      data.push(row);
    }
    
    return data;
  }
  
  private parseCSVLine(line: string): string[] {
    // Handle CSV with quoted fields containing commas
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(value => value.trim().replace(/^"|"$/g, ''));
  }
  
  private parseCSVValue(value: string): any {
    if (value === '' || value.toLowerCase() === 'null') return null;
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Try to parse as number
    const num = Number(value);
    if (!isNaN(num)) {
      return num;
    }
    
    return value;
  }
  
  private async parseJSON(content: string): Promise<any[]> {
    try {
      const parsed = JSON.parse(content);
      
      // Handle both array and single object cases
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed && typeof parsed === 'object') {
        // If it's a single object, wrap in an array
        return [parsed];
      } else {
        throw new Error('JSON content must be an array or object');
      }
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private validateDataStructure(data: any[]): string[] {
    const errors: string[] = [];
    
    if (!Array.isArray(data)) {
      return ['Data must be an array'];
    }
    
    if (data.length === 0) {
      return ['No data records found'];
    }
    
    // Validate each record has required fields
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      
      if (!record || typeof record !== 'object') {
        errors.push(`Record at index ${i} is not a valid object`);
        continue;
      }
      
      // Check for required fields based on common project models
      // This will be refined in DataImportService based on actual model requirements
    }
    
    return errors;
  }
}
