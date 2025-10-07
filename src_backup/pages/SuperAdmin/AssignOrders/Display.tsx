// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@mui/material';
// import AssignmentIcon from '@mui/icons-material/Assignment';

// interface Order {
//   id: string;
//   customerName: string;
//   orderList: string;
//   location: string;
// }

// const AssignOrdersDisplay: React.FC = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState<Order[]>([
//     { id: 'ORD-1001', customerName: 'Rahul Sharma', orderList: 'Chicken - 2kg, Fish - 1kg', location: 'HSR Layout' },
//     { id: 'ORD-1002', customerName: 'Priya Patel', orderList: 'Eggs - 1 dozen, Pork - 500g', location: 'Koramangala' },
//     { id: 'ORD-1003', customerName: 'Sanjay Gupta', orderList: 'Fish - 3kg, Chicken - 1kg', location: 'Indiranagar' },
//     { id: 'ORD-1004', customerName: 'Anita Reddy', orderList: 'Pork - 1kg, Eggs - 2 dozen', location: 'Whitefield' },
//     { id: 'ORD-1005', customerName: 'Vikram Joshi', orderList: 'Chicken - 5kg', location: 'Jayanagar' },
//   ]);

//   const handleAssignClick = (orderId: string) => {
//     console.log("🚀 ~ handleAssignClick ~ orderId:", orderId)
//     navigate(`/assign-orders/assign/${orderId}`);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Orders to Assign</h1>
      
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Order ID
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Customer Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Order List
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order) => (
//               <tr key={order.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
//                   {order.id}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {order.customerName}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {order.orderList}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {order.location}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<AssignmentIcon />}
//                     onClick={() => handleAssignClick(order.id)}
//                     size="small"
//                   >
//                     Assign
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {orders.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500">No orders to assign at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignOrdersDisplay;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface Order {
  id: string;
  customerName: string;
  orderList: string;
  location: string;
}

const AssignOrdersDisplay: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-1001', customerName: 'Rahul Sharma', orderList: 'Chicken - 2kg, Fish - 1kg', location: 'HSR Layout' },
    { id: 'ORD-1002', customerName: 'Priya Patel', orderList: 'Eggs - 1 dozen, Pork - 500g', location: 'Koramangala' },
    { id: 'ORD-1003', customerName: 'Sanjay Gupta', orderList: 'Fish - 3kg, Chicken - 1kg', location: 'Indiranagar' },
    { id: 'ORD-1004', customerName: 'Anita Reddy', orderList: 'Pork - 1kg, Eggs - 2 dozen', location: 'Whitefield' },
    { id: 'ORD-1005', customerName: 'Vikram Joshi', orderList: 'Chicken - 5kg', location: 'Jayanagar' },
  ]);

  const handleAssignClick = (order: Order) => {
    // Log all order details
    console.log('🚀 ~ handleAssignClick ~ Order Details:', {
      orderId: order.id,
      customerName: order.customerName,
      orderList: order.orderList,
      location: order.location,
    });
    navigate(`/assign-orders/assign/${order.id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders to Assign</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order List
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F47C7C]">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.orderList}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Button
  variant="contained"
  startIcon={<AssignmentIcon />}
  onClick={() => handleAssignClick(order)}
  size="small"
  sx={{
    backgroundColor: '#F47C7C',
    color: '#FFF2F2', // text color
    '&:hover': {
      backgroundColor: '#EF9F9F', // hover color
    },
  }}
>
  Assign
</Button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders to assign at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default AssignOrdersDisplay;