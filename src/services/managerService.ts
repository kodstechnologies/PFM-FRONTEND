import { API_CONFIG } from '../config/api.config';

export interface ManagerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  storeName: string;
  storeLocation: string;
  lat: number;
  long: number;
  store: {
    _id: string;
    name: string;
    location: string;
    phone: string;
  };
  isActive: boolean;
  lastLogin: string;
  pincode?: string;
  img?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

class ManagerService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    // Get token from the correct location - it's stored separately, not in managerUser object
    const accessToken = localStorage.getItem('accessToken');
    
    console.log('🔍 ManagerService: Getting auth headers');
    console.log('🔍 ManagerService: Access token found:', !!accessToken);
    
    if (!accessToken) {
      throw new Error('No access token found. Please log in again.');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
    
    console.log('🔍 ManagerService: Headers prepared:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': headers['Authorization'] ? `Bearer ${headers['Authorization'].substring(7, 20)}...` : 'Missing'
    });
    
    return headers;
  }

  async getManagerProfile(): Promise<ManagerProfile> {
    try {
      const headers = this.getAuthHeaders();
      console.log('🔍 ManagerService: Making request to:', `${this.baseURL}/manager/profile`);
      console.log('🔍 ManagerService: Headers:', headers);
      
      const response = await fetch(`${this.baseURL}/manager/profile`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 ManagerService: Response status:', response.status);
      console.log('🔍 ManagerService: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 ManagerService: Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ManagerProfile> = await response.json();
      console.log('🔍 ManagerService: Response data:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch manager profile');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching manager profile:', error);
      throw error;
    }
  }

  async updateManagerProfile(updateData: Partial<ManagerProfile>): Promise<ManagerProfile> {
    try {
      const response = await fetch(`${this.baseURL}/manager/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ManagerProfile> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update manager profile');
      }

      return result.data;
    } catch (error) {
      console.error('Error updating manager profile:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/manager/change-password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

export const managerService = new ManagerService();
export default managerService;
