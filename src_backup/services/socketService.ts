import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userRole: string, userId?: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.connectionStatus = 'connecting';
    console.log('🔌 Attempting to connect to socket server...');

    // Determine socket server URL (must be configured in production)
    const socketUrl = (import.meta as any)?.env?.VITE_SOCKET_URL as string | undefined;

    if (!socketUrl) {
      this.connectionStatus = 'disconnected';
      console.warn('⚠️ VITE_SOCKET_URL is not set. Skipping socket connection.');
      return null;
    }

    // Connect to the configured socket server
    this.socket = io(socketUrl, {
      // If your server is behind a proxy or on HTTPS, websocket transport is more reliable
      transports: ['websocket', 'polling'],
      path: '/socket.io',
      query: {
        role: userRole,
        userId: userId || 'anonymous'
      },
      timeout: 5000, // 5 second timeout
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      this.connectionStatus = 'connected';
      console.log('🔌 Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus = 'disconnected';
      console.log('🔌 Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      this.connectionStatus = 'disconnected';
      console.error('🔌 Socket connection error:', error);
      console.log('💡 Make sure the socket server is running: npm run server');
    });

    this.socket.on('error', (error) => {
      console.error('🔌 Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus = 'disconnected';
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }

  // Vendor TV Screen Methods
  emitOrderUpdate(orderData: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('order-update', orderData);
      console.log('📤 Emitted order update:', orderData);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit order update');
    }
  }

  emitNewOrder(orderData: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('new-order', orderData);
      console.log('📤 Emitted new order:', orderData);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit new order');
    }
  }

  emitOrderStatusChange(orderId: string, status: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('order-status-change', { orderId, status });
      console.log('📤 Emitted status change:', { orderId, status });
    } else {
      console.warn('⚠️ Socket not connected, cannot emit status change');
    }
  }

  // Manager Dashboard Methods
  onOrderUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order-update', callback);
    }
  }

  onNewOrder(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  onOrderStatusChange(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order-status-change', callback);
    }
  }

  // Remove listeners
  offOrderUpdate() {
    if (this.socket) {
      this.socket.off('order-update');
    }
  }

  offNewOrder() {
    if (this.socket) {
      this.socket.off('new-order');
    }
  }

  offOrderStatusChange() {
    if (this.socket) {
      this.socket.off('order-status-change');
    }
  }
}

export default SocketService;
