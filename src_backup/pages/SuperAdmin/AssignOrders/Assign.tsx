import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, MenuItem, Box, Typography, Paper, Divider } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import { styled } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';

interface DeliveryPartner {
  id: string;
  name: string;
  vehicle: string;
  currentLocation: string;
  availability: 'available' | 'on-delivery' | 'offline';
}

interface OrderDetails {
  id: string;
  customerName: string;
  contactNumber?: string;
  orderList: { item: string; quantity: string }[];
  deliveryAddress?: string;
  deliveryInstructions?: string;
  orderTotal?: number;
  paymentStatus?: 'paid' | 'pending';
  location: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: typeof theme.shape.borderRadius === 'number'
    ? theme.shape.borderRadius * 2
    : parseInt(theme.shape.borderRadius as string, 10) * 2 || 8,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(3),
}));

const AssignOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // Mock data for delivery partners
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([
    { id: 'DP-1001', name: 'Aditya Store', vehicle: 'Bike', currentLocation: 'HSR Layout', availability: 'available' },
    { id: 'DP-1002', name: 'City Meat Shop', vehicle: 'Scooter', currentLocation: 'Koramangala', availability: 'available' },
    { id: 'DP-1003', name: 'A S Chicken', vehicle: 'Bike', currentLocation: 'Indiranagar', availability: 'on-delivery' },
    { id: 'DP-1004', name: 'Anil Store', vehicle: 'Car', currentLocation: 'Whitefield', availability: 'available' },
  ]);

  useEffect(() => {
    const state = location.state as
      | (Omit<OrderDetails, 'orderList'> & { orderList: string | { item: string; quantity: string }[] })
      | undefined;
    console.log('🚀 ~ AssignOrderPage ~ Location State:', state);

    if (state) {
      let parsedOrderList: { item: string; quantity: string }[] = [];
      if (typeof state.orderList === 'string') {
        parsedOrderList = state.orderList
          .split(', ')
          .map((item) => {
            const [itemName, quantity] = item.split(' - ');
            return { item: itemName || 'Unknown', quantity: quantity || 'N/A' };
          });
      } else if (Array.isArray(state.orderList)) {
        parsedOrderList = state.orderList;
      }

      const orderData: OrderDetails = {
        id: orderId || state.id || 'ORD-1001',
        customerName: state.customerName || 'Unknown',
        location: state.location || 'Unknown',
        orderList: parsedOrderList,
        contactNumber: state.contactNumber || '+91 9876543210',
        deliveryAddress: state.deliveryAddress || state.location || '123, 5th Cross, HSR Layout, Bangalore - 560102',
        deliveryInstructions: state.deliveryInstructions || 'None',
        orderTotal: state.orderTotal || 0,
        paymentStatus: state.paymentStatus || 'pending',
      };

      setOrderDetails(orderData);
      console.log('🚀 ~ AssignOrderPage ~ Order Details:', orderData);
    } else {
      setTimeout(() => {
        const mockOrder: OrderDetails = {
          id: orderId || 'ORD-1001',
          customerName: 'Rahul Sharma',
          contactNumber: '+91 9876543210',
          orderList: [
            { item: 'Chicken', quantity: '2kg' },
            { item: 'Fish', quantity: '1kg' },
            { item: 'Eggs', quantity: '1 dozen' },
          ],
          deliveryAddress: '123, 5th Cross, HSR Layout, Bangalore - 560102',
          deliveryInstructions: 'Ring bell twice. Call before delivery.',
          orderTotal: 1250,
          paymentStatus: 'paid',
          location: 'HSR Layout',
        };
        setOrderDetails(mockOrder);
        console.log('🚀 ~ AssignOrderPage ~ Mock Order Details:', mockOrder);
      }, 500);
    }
  }, [orderId, location.state]);

  const handleAssignOrder = () => {
    if (!selectedPartner) {
      toast.error('Please select a delivery partner', {
        toastId: 'assign-error',
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsAssigning(true);
    const selected = deliveryPartners.find((p) => p.id === selectedPartner);
    console.log('🚀 ~ handleAssignOrder ~ Assignment Details:', {
      deliveryPartner: {
        orderDetails,
        orderId,
        id: selected?.id,
        name: selected?.name,
        vehicle: selected?.vehicle,
        currentLocation: selected?.currentLocation,
      },
      deliveryNotes,
    });

    console.log('hellooooo');

    // Simulate API call
    setTimeout(() => {
      setIsAssigning(false);
      toast.success(
        `Order ${orderId} assigned to ${selected?.name || 'partner'} successfully!`,
        {
          toastId: 'assign-success',
          position: 'top-right',
          autoClose: 2000,
          onClose: () => navigate('/assign-orders'), // Navigate after toast closes
        }
      );
    }, 1500);
  };

  const availablePartners = deliveryPartners.filter(
    (partner) => partner.availability === 'available'
  );

  if (!orderDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64">
        <Typography>Loading order details...</Typography>
      </Box>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      <Box className="p-6 max-w-4xl mx-auto">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          color="primary"
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Assign Order #{orderId || 'ORD-1001'}
        </Typography>

        <StyledPaper>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
            Order Details
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                Customer Information
              </Typography>
              <Typography>Order ID: {orderDetails.id}</Typography>
              <Typography>Name: {orderDetails.customerName}</Typography>
              <Typography>Contact: {orderDetails.contactNumber || 'N/A'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                Delivery Information
              </Typography>
              <Typography>Address: {orderDetails.deliveryAddress || orderDetails.location}</Typography>
              <Typography>Instructions: {orderDetails.deliveryInstructions || 'None'}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
            Order Items
          </Typography>
          <Box className="min-w-full mb-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Item</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderList.length > 0 ? (
                  orderDetails.orderList.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm text-gray-700">{item.item}</td>
                      <td className="py-2 text-sm text-gray-700">{item.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-2 text-sm text-gray-500 text-center">
                      No items available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>

          <Typography sx={{ fontWeight: 'bold' }}>
            Order Total: ₹{orderDetails.orderTotal?.toFixed(2) || 'N/A'}
          </Typography>
          <Typography>
            Payment Status: {orderDetails.paymentStatus || 'N/A'}
          </Typography>
        </StyledPaper>

        <StyledPaper>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
            Assign Meat Center
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              select
              label="Select Store"
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            >
              <MenuItem value="">
                <em>Select a partner</em>
              </MenuItem>
              {availablePartners.map((partner) => (
                <MenuItem key={partner.id} value={partner.id}>
                  {partner.name} ({partner.vehicle}) - {partner.currentLocation}
                </MenuItem>
              ))}
            </TextField>

            {/* <TextField
              label="Delivery Notes (Optional)"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              sx={{ mb: 2 }}
            /> */}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssignmentTurnedInIcon />}
              onClick={handleAssignOrder}
              disabled={isAssigning || !selectedPartner}
              size="large"
              sx={{ px: 4 }}
            >
              {isAssigning ? 'Assigning...' : 'Assign Order'}
            </Button>
          </Box>
        </StyledPaper>
      </Box>
    </>
  );
};

export default AssignOrderPage;