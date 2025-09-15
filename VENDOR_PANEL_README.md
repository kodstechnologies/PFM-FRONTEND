# Vendor Panel - Priya Fresh Meats

## Overview
The vendor panel provides a TV screen interface for vendor stores to manage live orders in real-time. This is designed to be displayed on a TV screen in the vendor store.

## Features

### 🖥️ Live Orders TV Screen
- **Real-time order display** with three columns: New Orders, Preparing, Awaiting Pickup
- **Auto-refresh** every 10 seconds with simulated new orders
- **Click to manage** - Click on any order card to move it to the next stage
- **Fullscreen mode** - Press F11 to toggle fullscreen for TV display
- **Live clock** showing current time
- **Responsive design** optimized for TV screens

### 📊 Vendor Dashboard
- **Entry point** for vendor management
- **Navigation** to different vendor features
- **Instructions** for TV screen usage

## How to Access

### For Development:
1. Navigate to `/vendor` - Main vendor dashboard
2. Click "Open TV Screen" or navigate to `/vendor/live-orders` - TV screen interface

### For Production TV Display:
1. Open `/vendor/live-orders` directly in a browser
2. Press F11 for fullscreen mode
3. The screen will automatically refresh and show live orders

## TV Screen Features

### Order Management
- **New Orders** (Yellow) - Fresh orders that need attention
- **Preparing** (Blue) - Orders being prepared
- **Awaiting Pickup** (Green) - Orders ready for customer pickup

### Interactive Features
- **Click any order** to move it to the next stage
- **Visual feedback** with hover effects and transitions
- **Highlighted newest orders** in red for immediate attention

### Keyboard Shortcuts
- **F11** - Toggle fullscreen mode
- **Click** - Move order to next stage

## Technical Details

### Components Created:
- `src/pages/Vendor/Dashboard.tsx` - Main vendor dashboard
- `src/pages/Vendor/LiveOrders.tsx` - TV screen interface
- `src/router/vendorRoutes.tsx` - Vendor routing
- Updated `src/router/routes.tsx` - Added vendor routes

### Styling:
- Dark theme optimized for TV displays
- High contrast colors for visibility
- Responsive design for different screen sizes
- Smooth animations and transitions

### Data Flow:
- Simulated order data with realistic order IDs
- Automatic order generation every 10 seconds
- State management for order status updates
- Real-time clock updates

## Usage Instructions

### For Store Staff:
1. **Monitor the TV screen** for new orders
2. **Click on orders** to move them through the workflow
3. **Watch for highlighted orders** (red) that need immediate attention
4. **Use fullscreen mode** (F11) for optimal TV display

### For Administrators:
1. **Access vendor dashboard** at `/vendor`
2. **Navigate to TV screen** for live monitoring
3. **Configure settings** as needed for your store

## Future Enhancements
- Real API integration for live order data
- Sound notifications for new orders
- Order details modal on click
- Print functionality for order receipts
- Multi-store support
- Analytics dashboard

## File Structure
```
src/
├── pages/
│   └── Vendor/
│       ├── Dashboard.tsx      # Main vendor dashboard
│       └── LiveOrders.tsx     # TV screen interface
└── router/
    ├── routes.tsx             # Updated with vendor routes
    └── vendorRoutes.tsx       # Vendor-specific routes
``` 