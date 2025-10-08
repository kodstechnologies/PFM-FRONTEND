import { getConfig } from '../config/environment';

export class ConnectionTest {
  private config = getConfig();

  /**
   * Test backend connection
   */
  async testBackendConnection(): Promise<{ success: boolean; message: string; response?: any }> {
    try {
      const response = await fetch(`${this.config.API_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Backend connection successful',
          response: await response.text()
        };
      } else {
        return {
          success: false,
          message: `Backend connection failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Backend connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Test socket connection
   */
  async testSocketConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.config.SOCKET_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Socket connection successful'
        };
      } else {
        return {
          success: false,
          message: `Socket connection failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Socket connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Test all connections
   */
  async testAllConnections(): Promise<void> {
    console.log('🔗 Testing frontend-backend connections...');

    // Test backend
    const backendResult = await this.testBackendConnection();
    console.log('📡 Backend API:', backendResult.success ? '✅ Connected' : '❌ Failed');

    // Test socket
    const socketResult = await this.testSocketConnection();
    console.log('🔌 Socket Server:', socketResult.success ? '✅ Connected' : '❌ Failed');

    if (backendResult.success && socketResult.success) {
      console.log('🎉 All systems connected! Frontend and backend are working properly.');
    } else {
      console.log('⚠️  Connection issues detected. Check browser console for details.');
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { backend: string; socket: string; overall: string } {
    const backend = this.config.API_BASE_URL;
    const socket = this.config.SOCKET_URL;

    return {
      backend,
      socket,
      overall: backend && socket ? 'Configured' : 'Not Configured'
    };
  }
}

export default ConnectionTest;
