import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
// Allow configuring CORS origins via env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});

app.use(cors());
app.use(express.json());

// Store connected clients
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  const { role, userId } = socket.handshake.query;
  connectedClients.set(socket.id, { role, userId });
  
  console.log(`👤 ${role} connected: ${userId}`);

  // Handle new orders from vendor TV screen
  socket.on('new-order', (orderData) => {
    console.log('📤 Broadcasting new order:', orderData);
    // Broadcast to all manager clients
    socket.broadcast.emit('new-order', {
      ...orderData,
      timestamp: new Date().toISOString()
    });
  });

  // Handle order status changes from vendor TV screen
  socket.on('order-status-change', (updateData) => {
    console.log('📤 Broadcasting status change:', updateData);
    // Broadcast to all manager clients
    socket.broadcast.emit('order-status-change', {
      ...updateData,
      timestamp: new Date().toISOString()
    });
  });

  // Handle order updates
  socket.on('order-update', (orderData) => {
    console.log('📤 Broadcasting order update:', orderData);
    socket.broadcast.emit('order-update', orderData);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Socket server running on port ${PORT}`);
  console.log(`📡 Ready for real-time communication`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedClients: connectedClients.size,
    timestamp: new Date().toISOString()
  });
});
