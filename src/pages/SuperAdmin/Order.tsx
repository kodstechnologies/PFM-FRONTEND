// // import { useMemo, useState, useEffect } from 'react'
// // import { useParams } from 'react-router-dom'
// // import { callApi } from '../../util/admin_api'
// // import { RefreshCw, User, MapPin, Phone, Package, IndianRupee, Truck, Download, Calendar } from 'lucide-react'
// // import DatePicker from "react-datepicker"
// // import "react-datepicker/dist/react-datepicker.css"
// // import * as XLSX from 'xlsx'

// // // Simple cn utility (classNames with Tailwind merge simulation)
// // function cn(...classes: (string | undefined | null | false)[]) {
// //     return classes.filter(Boolean).join(' ')
// // }

// // type Status =
// //     | 'pending'
// //     | 'confirmed'
// //     | 'preparing'
// //     | 'ready'
// //     | 'picked_up'
// //     | 'in_transit'
// //     | 'delivered'
// //     | 'cancelled'

// // interface OrderDetail {
// //     _id: string
// //     name: string
// //     quantity: number
// //     price: number
// //     unit?: string
// //     weight?: string
// //     img?: string | null
// // }

// // interface DeliveryTimeline {
// //     acceptedAt?: string | null
// //     inTransitAt?: string | null
// //     deliveredAt?: string | null
// //     rejectedAt?: string | null
// // }
// // interface Customer {
// //     name: string
// //     phone: string
// //     houseNo?: string
// //     location: string
// //     pincode?: string
// // }

// // interface Store {
// //     _id?: string
// //     name: string
// //     location?: string
// //     phone?: string
// //     storeName?: string  // Added for backward compatibility
// // }

// // interface DeliveryPartner {
// //     name: string
// //     phone?: string
// //     deliveryPartnerName?: string  // Added for backward compatibility
// // }

// // interface Order {
// //     _id: string
// //     customer: Customer & {
// //         deliveryTimeline?: DeliveryTimeline
// //     }
// //     totalAmount?: number
// //     amount?: number
// //     createdAt?: string
// //     status?: Status | string
// //     deliveryStatus?: string
// //     isUrgent?: boolean
// //     orderDetails?: OrderDetail[]
// //     store?: Store | null
// //     deliveryPartner?: DeliveryPartner | null
// //     userName?: string
// //     userPhoneNumber?: string
// //     houseNo?: string
// //     userLocation?: string
// //     userPincode?: string
// // }

// // function parseOrderDate(dateString?: string): Date | null {
// //     if (!dateString) return null;
// //     try {
// //         // Format: "06/01/2026, 02:09:00 pm" -> DD/MM/YYYY, HH:MM:SS am/pm
// //         const [datePart, timePart] = dateString.split(', ');
// //         const [dayStr, monthStr, yearStr] = datePart.split('/');
// //         const day = parseInt(dayStr, 10);
// //         const month = parseInt(monthStr, 10);
// //         const year = parseInt(yearStr, 10);
// //         const [hourStr, minStr, secStr, ...ampmArr] = timePart.split(':');
// //         let hour = parseInt(hourStr, 10);
// //         const min = parseInt(minStr, 10);
// //         const sec = parseInt(secStr, 10);
// //         const ampm = ampmArr.join('').toLowerCase().trim();
// //         if (ampm === 'pm' && hour !== 12) {
// //             hour += 12;
// //         } else if (ampm === 'am' && hour === 12) {
// //             hour = 0;
// //         }
// //         return new Date(year, month - 1, day, hour, min, sec);
// //     } catch {
// //         return null;
// //     }
// // }

// // function formatDate(dateString?: string) {
// //     const parsed = parseOrderDate(dateString);
// //     if (!parsed) return 'N/A'
// //     try {
// //         return parsed.toLocaleString('en-US', {
// //             dateStyle: 'medium',
// //             timeStyle: 'short',
// //         })
// //     } catch {
// //         return 'N/A'
// //     }
// // }

// // function formatDateDay(dateString?: string) {
// //     const parsed = parseOrderDate(dateString);
// //     if (!parsed) return 'N/A'
// //     try {
// //         return parsed.toLocaleDateString('en-US', {
// //             weekday: 'long',
// //             year: 'numeric',
// //             month: 'long',
// //             day: 'numeric',
// //         })
// //     } catch {
// //         return 'N/A'
// //     }
// // }

// // function formatDateForExcel(dateString?: string) {
// //     const parsed = parseOrderDate(dateString);
// //     if (!parsed) return ''
// //     try {
// //         return parsed.toLocaleDateString('en-IN', {
// //             year: 'numeric',
// //             month: '2-digit',
// //             day: '2-digit',
// //             hour: '2-digit',
// //             minute: '2-digit',
// //         })
// //     } catch {
// //         return ''
// //     }
// // }

// // function Chip({
// //     children,
// //     variant = 'default',
// //     className,
// // }: {
// //     children: React.ReactNode
// //     variant?: 'default' | 'success' | 'warning' | 'error'
// //     className?: string
// // }) {
// //     const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold'
// //     const variants = {
// //         default: 'border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
// //         success: 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200',
// //         warning: 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
// //         error: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
// //     }

// //     return (
// //         <span className={cn(baseClasses, variants[variant], className)}>
// //             {children}
// //         </span>
// //     )
// // }

// // function InfoRow({
// //     label,
// //     value,
// //     icon: Icon,
// //     highlight = false,
// // }: {
// //     label: string
// //     value?: string | number
// //     icon?: React.ComponentType<{ className?: string }>
// //     highlight?: boolean
// // }) {
// //     return (
// //         <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-2">
// //                 {Icon && <Icon className="h-4 w-4 text-gray-500" />}
// //                 <span className="text-sm font-medium text-gray-600">{label}:</span>
// //             </div>
// //             <span
// //                 className={cn(
// //                     'text-sm text-gray-900',
// //                     highlight && 'font-semibold text-blue-600'
// //                 )}
// //             >
// //                 {value ?? 'N/A'}
// //             </span>
// //         </div>
// //     )
// // }

// // function OrderItemCard({ item, index }: { item: OrderDetail; index: number }) {
// //     return (
// //         <div
// //             className={cn(
// //                 'flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
// //                 index % 2 === 0 && 'bg-gray-50 dark:bg-gray-900/50'
// //             )}
// //         >
// //             <div className="flex items-center gap-3">
// //                 {item.img ? (
// //                     <img
// //                         src={item.img}
// //                         alt={item.name}
// //                         className="size-12 rounded-md border border-gray-200 object-cover dark:border-gray-600"
// //                         onError={(e) => {
// //                             ; (e.currentTarget as HTMLImageElement).style.display = 'none'
// //                                 ; (e.currentTarget as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100 dark:bg-gray-700')
// //                         }}
// //                     />
// //                 ) : (
// //                     <div className="size-12 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center dark:border-gray-600 dark:bg-gray-700">
// //                         <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
// //                     </div>
// //                 )}
// //                 <div className="min-w-0 flex-1">
// //                     <div className="truncate font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
// //                     <div className="text-xs text-gray-600 dark:text-gray-400">
// //                         {item.quantity} {item.unit || ''} {item.weight ? `(${item.weight})` : ''}
// //                     </div>
// //                 </div>
// //             </div>
// //             <div className="text-right">
// //                 <div className="font-bold text-gray-900 dark:text-gray-100">₹{item.price}</div>
// //             </div>
// //         </div>
// //     )
// // }

// // function DateRangePicker({ dateRange, onChange, label }: {
// //     dateRange: { startDate: string; endDate: string }
// //     onChange: (range: { startDate: string; endDate: string }) => void
// //     label?: string
// // }) {
// //     const [rangeStart, setRangeStart] = useState<Date | null>(null)
// //     const [rangeEnd, setRangeEnd] = useState<Date | null>(null)

// //     useEffect(() => {
// //         setRangeStart(dateRange.startDate ? new Date(dateRange.startDate) : null)
// //         setRangeEnd(dateRange.endDate ? new Date(dateRange.endDate) : null)
// //     }, [dateRange.startDate, dateRange.endDate])

// //     const handleDateChange = (dates: [Date | null, Date | null]) => {
// //         const [start, end] = dates
// //         const startStr = start ? start.toISOString().split('T')[0] : ''
// //         const endStr = end ? end.toISOString().split('T')[0] : ''
// //         onChange({ startDate: startStr, endDate: endStr })
// //         setRangeStart(start)
// //         setRangeEnd(end)
// //     }

// //     const isSingleDay = dateRange.startDate && dateRange.endDate && new Date(dateRange.startDate).toDateString() === new Date(dateRange.endDate).toDateString()

// //     return (
// //         <div className="flex flex-col gap-2 w-52">
// //             {label && <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>}
// //             <div className="flex items-center gap-2">
// //                 <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
// //                 <DatePicker
// //                     selectsRange={true}
// //                     startDate={rangeStart}
// //                     endDate={rangeEnd}
// //                     onChange={handleDateChange}
// //                     dateFormat="dd/MM/yyyy"
// //                     placeholderText={label ? `Select ${label.toLowerCase()}` : "Select start and end dates"}
// //                     className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
// //                     isClearable={true}
// //                     wrapperClassName="w-full"
// //                 />
// //             </div>
// //             {dateRange.startDate && (
// //                 <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
// //                     <span className="font-medium">Sel: </span>
// //                     {isSingleDay ? (
// //                         `Single Day: ${new Date(dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
// //                     ) : (
// //                         `${new Date(dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(dateRange.endDate || dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
// //                     )}
// //                 </div>
// //             )}
// //         </div>
// //     )
// // }

// // export default function OrderDisplay({ status }: { status?: string }) {
// //     const [orders, setOrders] = useState<Order[]>([])
// //     const [loading, setLoading] = useState<boolean>(true)
// //     const [error, setError] = useState<string | null>(null)
// //     const [selectedId, setSelectedId] = useState<string | null>(null)
// //     const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
// //         startDate: '',
// //         endDate: ''
// //     })
// //     const [filterSearch, setFilterSearch] = useState('')
// //     const [minAmount, setMinAmount] = useState('')
// //     const [maxAmount, setMaxAmount] = useState('')
// //     const [deliveryPhase, setDeliveryPhase] = useState<'all' | 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'rejected'>('all')
// //     const { status: paramStatus } = useParams<{ status?: Status }>()

// //     // Use the passed status or paramStatus
// //     const currentStatus = status || paramStatus

// //     // Mimic original store filter behavior
// //     const storeUser =
// //         typeof window !== 'undefined'
// //             ? (JSON.parse(localStorage.getItem('storeUser') || '{}') as {
// //                 _id?: string
// //                 name?: string
// //             })
// //             : {}

// //     useEffect(() => {
// //         const fetchOrders = async () => {
// //             try {
// //                 setLoading(true)
// //                 setError(null)

// //                 const response = await callApi({
// //                     endpoint: '/admin/display-order',
// //                     method: 'GET',
// //                 })

// //                 // Extract orders directly (compatible with new API structure)
// //                 const ordersData: Order[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

// //                 // Transform data to match component expectations (bridge old/new structure)
// //                 const transformedOrders: Order[] = ordersData.map((order: any) => ({
// //                     ...order,

// //                     customer: {
// //                         ...order.customer,
// //                         deliveryTimeline: {
// //                             acceptedAt: order.customer?.deliveryTimeline?.acceptedAt ?? null,
// //                             inTransitAt: order.customer?.deliveryTimeline?.inTransitAt ?? null,
// //                             deliveredAt: order.customer?.deliveryTimeline?.deliveredAt ?? null,
// //                             rejectedAt: order.customer?.deliveryTimeline?.rejectedAt ?? null,
// //                         },
// //                     },

// //                     userName: order.customer?.name,
// //                     userPhoneNumber: order.customer?.phone,
// //                     houseNo: order.customer?.houseNo,
// //                     userLocation: order.customer?.location,
// //                     userPincode: order.customer?.pincode,
// //                     totalAmount: order.amount,

// //                     store: order.store ? { ...order.store, storeName: order.store.name } : null,
// //                     deliveryPartner: order.deliveryPartner
// //                         ? { deliveryPartnerName: order.deliveryPartner.name }
// //                         : null,
// //                 }))


// //                 setOrders(transformedOrders)
// //             } catch (err: any) {
// //                 const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
// //                 setError(errorMessage)
// //                 console.error('Error fetching orders:', err)
// //             } finally {
// //                 setLoading(false)
// //             }
// //         }

// //         fetchOrders()
// //     }, [])

// //     const filteredOrders = useMemo(() => {
// //         let result = orders
// //         if (storeUser._id) {
// //             result = result.filter((o) => o.store?._id === storeUser._id || o.store?.name === storeUser.name)
// //         }
// //         if (currentStatus) {
// //             result = result.filter(
// //                 (o) => (o.status || 'pending').toLowerCase() === currentStatus.toLowerCase()
// //             )
// //         }

// //         // Date range filter for createdAt
// //         if (dateRange.startDate || dateRange.endDate) {
// //             const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0)
// //             const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date()
// //             end.setHours(23, 59, 59, 999) // Include full end day

// //             result = result.filter((o) => {
// //                 const orderDate = parseOrderDate(o.createdAt)
// //                 if (!orderDate) return false
// //                 return orderDate >= start && orderDate <= end
// //             })
// //         }
// //         // Search filter
// //         if (filterSearch) {
// //             const query = filterSearch.toLowerCase()
// //             result = result.filter(o =>
// //                 (o.userName?.toLowerCase().includes(query) ?? false) ||
// //                 (o.userPhoneNumber?.includes(filterSearch) ?? false) ||
// //                 (o.userLocation?.toLowerCase().includes(query) ?? false) ||
// //                 (o.store?.storeName?.toLowerCase().includes(query) ?? false)
// //             )
// //         }
// //         // Amount filters
// //         if (minAmount) {
// //             const min = parseFloat(minAmount)
// //             if (!isNaN(min)) {
// //                 result = result.filter(o => (o.totalAmount ?? 0) >= min)
// //             }
// //         }
// //         if (maxAmount) {
// //             const max = parseFloat(maxAmount)
// //             if (!isNaN(max)) {
// //                 result = result.filter(o => (o.totalAmount ?? 0) <= max)
// //             }
// //         }
// //         // Delivery phase filter
// //         if (deliveryPhase !== 'all') {
// //             result = result.filter(o => {
// //                 const tl = o.customer?.deliveryTimeline
// //                 if (!tl) return false
// //                 const rejected = !!tl.rejectedAt
// //                 switch (deliveryPhase) {
// //                     case 'pending':
// //                         return !tl.acceptedAt
// //                     case 'accepted':
// //                         return !!tl.acceptedAt && !tl.inTransitAt && !tl.deliveredAt && !rejected
// //                     case 'in_transit':
// //                         return !!tl.inTransitAt && !tl.deliveredAt && !rejected
// //                     case 'delivered':
// //                         return !!tl.deliveredAt && !rejected
// //                     case 'rejected':
// //                         return rejected
// //                     default:
// //                         return true
// //                 }
// //             })
// //         }
// //         // Sort by createdAt descending
// //         result = result.sort((a, b) => {
// //             const dateA = parseOrderDate(a.createdAt) || new Date(0)
// //             const dateB = parseOrderDate(b.createdAt) || new Date(0)
// //             return dateB.getTime() - dateA.getTime()
// //         })
// //         return result
// //     }, [orders, currentStatus, storeUser, dateRange, filterSearch, minAmount, maxAmount, deliveryPhase])

// //     // Group orders by day
// //     const groupedOrders = useMemo(() => {
// //         const groups: { [key: string]: Order[] } = {}
// //         filteredOrders.forEach(order => {
// //             const parsedDate = parseOrderDate(order.createdAt)
// //             if (parsedDate) {
// //                 const dayKey = parsedDate.toLocaleDateString('en-CA') // YYYY-MM-DD for sorting
// //                 if (!groups[dayKey]) {
// //                     groups[dayKey] = []
// //                 }
// //                 groups[dayKey].push(order)
// //             }
// //         })
// //         // Sort groups by date descending
// //         const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
// //         const sortedGroups: { day: string; orders: Order[] }[] = sortedKeys.map(key => ({
// //             day: key,
// //             orders: groups[key]
// //         }))
// //         return sortedGroups
// //     }, [filteredOrders])

// //     const selectedOrder = filteredOrders.find((o) => o._id === selectedId) ?? null

// //     // Status variant mapping for chips
// //     const getStatusVariant = (status: string) => {
// //         const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
// //             pending: 'warning',
// //             confirmed: 'default',
// //             preparing: 'default',
// //             ready: 'success',
// //             picked_up: 'success',
// //             in_transit: 'warning',
// //             delivered: 'success',
// //             cancelled: 'error',
// //         }
// //         return variants[status.toLowerCase()] || 'default'
// //     }

// //     const handleDownloadExcel = () => {
// //         if (!filteredOrders.length) {
// //             alert('No orders to download.')
// //             return
// //         }

// //         const rows: any[] = []

// //         // Headers for order summary
// //         rows.push(['Order ID', 'Customer Name', 'Phone', 'Address', 'Pincode', 'Store', 'Status', 'Delivery Status', 'Total Amount', 'Items Count', 'Created At'])

// //         // Add order summary rows
// //         filteredOrders.forEach((order) => {
// //             const address = `${order.houseNo || ''}, ${order.userLocation || ''}`.trim()
// //             rows.push([
// //                 order._id.slice(-6).toUpperCase(),
// //                 order.userName || '',
// //                 order.userPhoneNumber || '',
// //                 address,
// //                 order.userPincode || '',
// //                 order.store?.storeName || '',
// //                 order.status || 'Pending',
// //                 order.deliveryStatus || '',
// //                 `₹${order.totalAmount ?? 0}`,
// //                 order.orderDetails?.length || 0,
// //                 formatDateForExcel(order.createdAt),
// //             ])

// //             // Add detailed item rows (with order ID prefix)
// //             if (order.orderDetails && order.orderDetails.length > 0) {
// //                 order.orderDetails.forEach((item) => {
// //                     rows.push([
// //                         `  └ ${item.name}`,
// //                         item.quantity,
// //                         item.unit || '',
// //                         item.weight ? `(${item.weight})` : '',
// //                         `₹${item.price}`,
// //                         '', // Empty for order-level fields
// //                         '', '', '', '', '',
// //                     ])
// //                 })
// //             }
// //         })

// //         const ws = XLSX.utils.aoa_to_sheet(rows)
// //         const wb = XLSX.utils.book_new()
// //         XLSX.utils.book_append_sheet(wb, ws, 'Orders')

// //         // Generate filename with date range if applicable
// //         let filename = 'orders'
// //         if (dateRange.startDate && dateRange.endDate) {
// //             const start = new Date(dateRange.startDate).toISOString().split('T')[0]
// //             const end = new Date(dateRange.endDate).toISOString().split('T')[0]
// //             filename += `_${start}_to_${end}`
// //         } else if (dateRange.startDate) {
// //             const start = new Date(dateRange.startDate).toISOString().split('T')[0]
// //             filename += `_${start}`
// //         } else if (dateRange.endDate) {
// //             const end = new Date(dateRange.endDate).toISOString().split('T')[0]
// //             filename += `_upto_${end}`
// //         }

// //         // Add day count to filename if date range is selected
// //         if (dateRange.startDate && dateRange.endDate) {
// //             const start = new Date(dateRange.startDate);
// //             const end = new Date(dateRange.endDate);
// //             const diffTime = Math.abs(end.getTime() - start.getTime());
// //             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
// //             filename += `_${diffDays}_days`
// //         }

// //         filename += `_${currentStatus || 'all'}.xlsx`

// //         XLSX.writeFile(wb, filename)
// //     }

// //     const handleRefresh = () => {
// //         // Re-fetch data
// //         const fetchOrders = async () => {
// //             try {
// //                 setLoading(true)
// //                 setError(null)

// //                 const response = await callApi({
// //                     endpoint: '/admin/display-order',
// //                     method: 'GET',
// //                 })

// //                 const ordersData: any[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

// //                 const transformedOrders: Order[] = ordersData.map((order: any) => ({
// //                     ...order,
// //                     userName: order.customer?.name,
// //                     userPhoneNumber: order.customer?.phone,
// //                     houseNo: order.customer?.houseNo,
// //                     userLocation: order.customer?.location,
// //                     userPincode: order.customer?.pincode,
// //                     totalAmount: order.amount,
// //                     store: order.store ? { ...order.store, storeName: order.store.name } : null,
// //                     deliveryPartner: order.deliveryPartner ? { deliveryPartnerName: order.deliveryPartner.name } : null,
// //                 }))

// //                 setOrders(transformedOrders)
// //             } catch (err: any) {
// //                 const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
// //                 setError(errorMessage)
// //             } finally {
// //                 setLoading(false)
// //             }
// //         }

// //         fetchOrders()
// //     }

// //     const clearAllFilters = () => {
// //         setFilterSearch('')
// //         setMinAmount('')
// //         setMaxAmount('')
// //         setDeliveryPhase('all')
// //         setDateRange({ startDate: '', endDate: '' })
// //     }

// //     if (loading) {
// //         return (
// //             <section className="space-y-6">
// //                 <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
// //                     <div className="flex items-center justify-between">
// //                         <div className="space-y-2">
// //                             <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
// //                             <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
// //                         </div>
// //                         <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
// //                     </div>
// //                 </div>
// //                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// //                     {[...Array(3)].map((_, i) => (
// //                         <div
// //                             key={i}
// //                             className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
// //                         />
// //                     ))}
// //                 </div>
// //             </section>
// //         )
// //     }

// //     if (error) {
// //         return (
// //             <section
// //                 className="mx-auto w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
// //                 role="alert"
// //             >
// //                 <div className="mb-3 text-3xl" aria-hidden>
// //                     ⚠️
// //                 </div>
// //                 <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Error Loading Orders</h3>
// //                 <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">
// //                     Failed to fetch orders. Please try again later.
// //                 </p>
// //                 <div className="mt-4 flex justify-center">
// //                     <button
// //                         onClick={handleRefresh}
// //                         className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
// //                         aria-label="Retry loading orders"
// //                     >
// //                         <RefreshCw className="h-4 w-4" />
// //                         Try Again
// //                     </button>
// //                 </div>
// //             </section>
// //         )
// //     }

// //     return (
// //         <section className="space-y-6">
// //             {/* Header */}
// //             <div className="flex flex-wrap items-start justify-between gap-4">
// //                 <div className="space-y-2">
// //                     <h1 className="text-balance text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
// //                         {currentStatus
// //                             ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
// //                             : 'Order Management'}
// //                     </h1>
// //                     <p className="text-sm text-gray-600 dark:text-gray-400">
// //                         Manage and track your orders efficiently
// //                     </p>
// //                 </div>
// //                 <div className="flex flex-col gap-4">
// //                     <div className="flex flex-wrap items-center gap-3">
// //                         {/* Search Input */}
// //                         <div className="relative min-w-[200px] flex-1">
// //                             <input
// //                                 type="text"
// //                                 placeholder="Search customer name, phone, store, address..."
// //                                 value={filterSearch}
// //                                 onChange={(e) => setFilterSearch(e.target.value)}
// //                                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
// //                             />
// //                         </div>
// //                         {/* Amount Filters */}
// //                         <div className="flex items-center gap-1 text-sm">
// //                             <span className="text-gray-500">₹</span>
// //                             <input
// //                                 type="number"
// //                                 placeholder="Min"
// //                                 value={minAmount}
// //                                 onChange={(e) => setMinAmount(e.target.value)}
// //                                 className="w-16 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
// //                             />
// //                             <span className="text-gray-500">-</span>
// //                             <input
// //                                 type="number"
// //                                 placeholder="Max"
// //                                 value={maxAmount}
// //                                 onChange={(e) => setMaxAmount(e.target.value)}
// //                                 className="w-16 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
// //                             />
// //                         </div>
// //                         {/* Delivery Phase Select */}
// //                         <select
// //                             value={deliveryPhase}
// //                             onChange={(e) => setDeliveryPhase(e.target.value as typeof deliveryPhase)}
// //                             className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 w-32"
// //                         >
// //                             <option value="all">All Phases</option>
// //                             <option value="pending">Pending</option>
// //                             <option value="accepted">Accepted</option>
// //                             <option value="in_transit">In Transit</option>
// //                             <option value="delivered">Delivered</option>
// //                             <option value="rejected">Rejected</option>
// //                         </select>
// //                         {/* Date Range Picker */}
// //                         <DateRangePicker dateRange={dateRange} onChange={setDateRange} label="Date Range" />
// //                     </div>
// //                     <div className="flex items-center justify-end gap-3 sm:justify-start">
// //                         {/* Download Button */}
// //                         <button
// //                             onClick={handleDownloadExcel}
// //                             disabled={!filteredOrders.length}
// //                             className={cn(
// //                                 'inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 ',
// //                                 !filteredOrders.length
// //                                     ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
// //                                     : 'border-gray-300 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600'
// //                             )}
// //                             aria-label="Download orders as Excel"
// //                         >
// //                             <Download className="h-4 w-4" />
// //                             Download Excel
// //                         </button>
// //                         <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-800/50">
// //                             <div className="text-right">
// //                                 <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{filteredOrders.length}</div>
// //                                 <div className="text-xs text-gray-600 dark:text-gray-400">
// //                                     order{filteredOrders.length !== 1 ? 's' : ''}
// //                                 </div>
// //                             </div>
// //                             <button
// //                                 onClick={handleRefresh}
// //                                 className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
// //                                 aria-label="Refresh orders"
// //                             >
// //                                 <RefreshCw className="h-4 w-4" />
// //                             </button>
// //                         </div>
// //                         <button
// //                             onClick={clearAllFilters}
// //                             className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
// //                         >
// //                             Clear Filters
// //                         </button>
// //                     </div>
// //                 </div>
// //             </div>

// //             {!filteredOrders.length ? (
// //                 <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
// //                     <div className="mb-4 text-5xl opacity-70" aria-hidden>
// //                         📦
// //                     </div>
// //                     <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No Orders Found</h2>
// //                     <p className="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
// //                         {currentStatus
// //                             ? `There are no ${currentStatus} orders to display at this time.`
// //                             : (dateRange.startDate || dateRange.endDate || filterSearch || minAmount || maxAmount || deliveryPhase !== 'all')
// //                                 ? 'No orders match the current filters.'
// //                                 : 'No orders available in your store at the moment.'}
// //                     </p>
// //                     <button
// //                         onClick={handleRefresh}
// //                         className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
// //                         aria-label="Refresh orders"
// //                     >
// //                         <RefreshCw className="h-4 w-4" />
// //                         Refresh Orders
// //                     </button>
// //                 </div>
// //             ) : (
// //                 <div className="flex flex-col gap-6 md:flex-row">
// //                     {/* Left: Order list - Grouped by day */}
// //                     <div className="w-full md:w-5/12">
// //                         <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
// //                             <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
// //                                 <span className="h-5 w-1 rounded bg-blue-600" />
// //                                 {currentStatus
// //                                     ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
// //                                     : 'All Orders'}
// //                             </h2>
// //                             {(dateRange.startDate || dateRange.endDate) && (
// //                                 <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
// //                                     Showing orders from{' '}
// //                                     {dateRange.startDate ? new Date(dateRange.startDate).toLocaleDateString() : 'the beginning'} to{' '}
// //                                     {dateRange.endDate ? new Date(dateRange.endDate).toLocaleDateString() : 'now'}
// //                                 </p>
// //                             )}
// //                         </div>

// //                         <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
// //                             <div className="flex flex-col gap-3">
// //                                 {groupedOrders.map(({ day, orders }, groupIdx) => (
// //                                     <div key={day} className="space-y-2">
// //                                         <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pb-2">
// //                                             <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
// //                                                 {formatDateDay(orders[0]?.createdAt)}
// //                                             </h3>
// //                                             <p className="text-xs text-gray-500 dark:text-gray-400">
// //                                                 {orders.length} order{orders.length !== 1 ? 's' : ''}
// //                                             </p>
// //                                         </div>
// //                                         <div className="flex flex-col gap-3">
// //                                             {orders.map((order, idx) => (
// //                                                 <button
// //                                                     key={order._id}
// //                                                     onClick={() => setSelectedId(order._id)}
// //                                                     className={cn(
// //                                                         'group relative w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-md',
// //                                                         selectedId === order._id &&
// //                                                         'ring-2 ring-blue-500 shadow-lg dark:ring-blue-500'
// //                                                     )}
// //                                                     aria-pressed={selectedId === order._id}
// //                                                     aria-label={`Select order ${order._id.slice(-6).toUpperCase()}`}
// //                                                     style={{
// //                                                         animationDelay: `${(groupIdx * 10 + idx) * 50}ms`,
// //                                                     }}
// //                                                 >
// //                                                     <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-blue-500/60 to-indigo-500/60 opacity-70" aria-hidden />

// //                                                     <div className="mb-2 flex items-start justify-between">
// //                                                         <div>
// //                                                             <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
// //                                                                 Order #{order._id.slice(-6).toUpperCase()}
// //                                                             </h3>
// //                                                             <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
// //                                                                 <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
// //                                                                 {formatDate(order.createdAt)}
// //                                                             </p>
// //                                                         </div>
// //                                                         <Chip variant={getStatusVariant(order.status || 'pending')}>
// //                                                             {order.status || 'Pending'}
// //                                                         </Chip>
// //                                                     </div>

// //                                                     <div className="grid grid-cols-[1fr_auto] items-center gap-3">
// //                                                         <div className="space-y-1">
// //                                                             <p className="text-sm text-gray-600 dark:text-gray-400">
// //                                                                 <span className="font-medium text-gray-900 dark:text-gray-100">
// //                                                                     Customer:
// //                                                                 </span>{' '}
// //                                                                 {order.userName ?? 'N/A'}
// //                                                             </p>
// //                                                             <p className="text-sm text-gray-600 dark:text-gray-400">
// //                                                                 <span className="font-medium text-gray-900 dark:text-gray-100">
// //                                                                     Store:
// //                                                                 </span>{' '}
// //                                                                 <span
// //                                                                     className={cn(
// //                                                                         order.store?.storeName === storeUser.name
// //                                                                             ? 'font-semibold text-blue-600 dark:text-blue-400'
// //                                                                             : 'text-gray-900 dark:text-gray-100'
// //                                                                     )}
// //                                                                 >
// //                                                                     {order.store?.storeName ?? 'N/A'}
// //                                                                 </span>
// //                                                             </p>
// //                                                         </div>
// //                                                         <div className="text-right">
// //                                                             <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
// //                                                                 ₹{order.totalAmount ?? 0}
// //                                                             </div>
// //                                                             <div className="flex items-center justify-end gap-1 text-xs text-gray-600 dark:text-gray-400">
// //                                                                 <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
// //                                                                 {(order.orderDetails?.length ?? 0)} item
// //                                                                 {order.orderDetails?.length !== 1 ? 's' : ''}
// //                                                             </div>
// //                                                         </div>
// //                                                     </div>
// //                                                 </button>
// //                                             ))}
// //                                         </div>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Right: Details */}
// //                     <div className="w-full md:w-7/12">
// //                         <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
// //                             <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
// //                                 <span className="h-5 w-1 rounded bg-blue-600" />
// //                                 Order Details
// //                             </h2>
// //                         </div>

// //                         {selectedOrder ? (
// //                             <div className="sticky top-5 animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
// //                                 {/* Header */}
// //                                 <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
// //                                     <div>
// //                                         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
// //                                             Order #{selectedOrder._id.slice(-6).toUpperCase()}
// //                                         </h3>
// //                                         <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
// //                                             <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
// //                                             Created: {formatDate(selectedOrder.createdAt)}
// //                                         </p>
// //                                     </div>
// //                                     <Chip variant={getStatusVariant(selectedOrder.status || 'pending')}>
// //                                         {selectedOrder.status || 'Pending'}
// //                                     </Chip>
// //                                 </div>

// //                                 {/* Info grid */}
// //                                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
// //                                     <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
// //                                         <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
// //                                             <User className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
// //                                             Customer Information
// //                                         </h4>
// //                                         <div className="space-y-3">
// //                                             <InfoRow label="Name" value={selectedOrder.userName} icon={User} />
// //                                             <InfoRow
// //                                                 label="Phone"
// //                                                 value={selectedOrder.userPhoneNumber}
// //                                                 icon={Phone}
// //                                             />
// //                                             <InfoRow
// //                                                 label="Store"
// //                                                 value={selectedOrder.store?.storeName}
// //                                                 highlight={selectedOrder.store?.storeName === storeUser.name}
// //                                                 icon={MapPin}
// //                                             />
// //                                             <div>
// //                                                 <InfoRow label="Address" value="" icon={MapPin} />
// //                                                 <p className="ml-6 text-sm text-gray-600 dark:text-gray-400">
// //                                                     {selectedOrder.houseNo ? `${selectedOrder.houseNo}, ` : ''}
// //                                                     {selectedOrder.userLocation ?? 'N/A'}
// //                                                     {selectedOrder.userPincode
// //                                                         ? `, ${selectedOrder.userPincode}`
// //                                                         : ''}
// //                                                 </p>
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                     <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
// //                                         <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
// //                                             <IndianRupee className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
// //                                             Order Summary
// //                                         </h4>
// //                                         <div className="space-y-3">
// //                                             <InfoRow
// //                                                 label="Total Amount"
// //                                                 value={`₹${selectedOrder.totalAmount ?? 0}`}
// //                                                 icon={IndianRupee}
// //                                             />
// //                                             <InfoRow
// //                                                 label="Delivery Status"
// //                                                 value={selectedOrder.deliveryStatus}
// //                                                 icon={Truck}
// //                                             />
// //                                             {/* Manager removed from new API; conditionally render if present in future */}
// //                                             {selectedOrder.deliveryPartner && (
// //                                                 <InfoRow
// //                                                     label="Delivery Partner"
// //                                                     value={selectedOrder.deliveryPartner.deliveryPartnerName}
// //                                                     icon={Truck}
// //                                                 />
// //                                             )}
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                                 {/* Delivery Timeline */}
// //                                 {selectedOrder.customer?.deliveryTimeline && (
// //                                     <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
// //                                         <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
// //                                             <Truck className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
// //                                             Delivery Timeline
// //                                         </h4>

// //                                         <div className="space-y-2">
// //                                             {Object.entries(selectedOrder.customer.deliveryTimeline).map(
// //                                                 ([key, value]) =>
// //                                                     value && (
// //                                                         <InfoRow
// //                                                             key={key}
// //                                                             label={key.replace(/([A-Z])/g, ' $1')}
// //                                                             value={formatDate(value as string)}
// //                                                         />
// //                                                     )
// //                                             )}
// //                                         </div>
// //                                     </div>
// //                                 )}


// //                                 {/* Items */}
// //                                 <div className="mt-6 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
// //                                     <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
// //                                         <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
// //                                         Order Items ({selectedOrder.orderDetails?.length ?? 0})
// //                                     </h4>
// //                                     {selectedOrder.orderDetails?.length ? (
// //                                         <div className="mt-3 flex flex-col gap-2">
// //                                             {selectedOrder.orderDetails.map((item, i) => (
// //                                                 <OrderItemCard key={`${item._id}-${i}`} item={item} index={i} />
// //                                             ))}
// //                                         </div>
// //                                     ) : (
// //                                         <p className="py-6 text-center text-sm italic text-gray-600 dark:text-gray-400">
// //                                             No items in this order
// //                                         </p>
// //                                     )}
// //                                 </div>
// //                             </div>
// //                         ) : (
// //                             <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
// //                                 <div className="mb-4 text-5xl opacity-50" aria-hidden>
// //                                     👆
// //                                 </div>
// //                                 <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Select an Order</h3>
// //                                 <p className="mx-auto max-w-sm text-sm text-gray-600 dark:text-gray-400">
// //                                     Choose an order from the list to view detailed information.
// //                                 </p>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
// //             )}
// //         </section>
// //     )
// // }

// import { useMemo, useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { callApi } from '../../util/admin_api'
// import { RefreshCw, User, MapPin, Phone, Package, IndianRupee, Truck, Download, Calendar } from 'lucide-react'
// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"
// import * as XLSX from 'xlsx'

// // Simple cn utility (classNames with Tailwind merge simulation)
// function cn(...classes: (string | undefined | null | false)[]) {
//     return classes.filter(Boolean).join(' ')
// }

// type Status =
//     | 'pending'
//     | 'confirmed'
//     | 'preparing'
//     | 'ready'
//     | 'picked_up'
//     | 'in_transit'
//     | 'delivered'
//     | 'cancelled'

// interface OrderDetail {
//     _id: string
//     name: string
//     quantity: number
//     price: number
//     unit?: string
//     weight?: string
//     img?: string | null
// }

// interface DeliveryTimeline {
//     acceptedAt?: string | null
//     inTransitAt?: string | null
//     deliveredAt?: string | null
//     rejectedAt?: string | null
// }
// interface Customer {
//     name: string
//     phone: string
//     houseNo?: string
//     location: string
//     pincode?: string
// }

// interface Store {
//     _id?: string
//     name: string
//     location?: string
//     phone?: string
//     storeName?: string  // Added for backward compatibility
// }

// interface DeliveryPartner {
//     name: string
//     phone?: string
//     deliveryPartnerName?: string  // Added for backward compatibility
// }

// interface Order {
//     _id: string
//     customer: Customer & {
//         deliveryTimeline?: DeliveryTimeline
//     }
//     totalAmount?: number
//     amount?: number
//     createdAt?: string
//     status?: Status | string
//     deliveryStatus?: string
//     isUrgent?: boolean
//     orderDetails?: OrderDetail[]
//     store?: Store | null
//     deliveryPartner?: DeliveryPartner | null
//     userName?: string
//     userPhoneNumber?: string
//     houseNo?: string
//     userLocation?: string
//     userPincode?: string
// }

// function parseOrderDate(dateString?: string): Date | null {
//     if (!dateString) return null;
//     try {
//         // Format: "06/01/2026, 02:09:00 pm" -> DD/MM/YYYY, HH:MM:SS am/pm
//         const [datePart, timePart] = dateString.split(', ');
//         const [dayStr, monthStr, yearStr] = datePart.split('/');
//         const day = parseInt(dayStr, 10);
//         const month = parseInt(monthStr, 10);
//         const year = parseInt(yearStr, 10);
//         const [hourStr, minStr, secStr, ...ampmArr] = timePart.split(':');
//         let hour = parseInt(hourStr, 10);
//         const min = parseInt(minStr, 10);
//         const sec = parseInt(secStr, 10);
//         const ampm = ampmArr.join('').toLowerCase().trim();
//         if (ampm === 'pm' && hour !== 12) {
//             hour += 12;
//         } else if (ampm === 'am' && hour === 12) {
//             hour = 0;
//         }
//         return new Date(year, month - 1, day, hour, min, sec);
//     } catch {
//         return null;
//     }
// }

// function formatDate(dateString?: string) {
//     const parsed = parseOrderDate(dateString);
//     if (!parsed) return 'N/A'
//     try {
//         return parsed.toLocaleString('en-US', {
//             dateStyle: 'medium',
//             timeStyle: 'short',
//         })
//     } catch {
//         return 'N/A'
//     }
// }

// function formatDateDay(dateString?: string) {
//     const parsed = parseOrderDate(dateString);
//     if (!parsed) return 'N/A'
//     try {
//         return parsed.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//         })
//     } catch {
//         return 'N/A'
//     }
// }

// function formatDateForExcel(dateString?: string) {
//     const parsed = parseOrderDate(dateString);
//     if (!parsed) return ''
//     try {
//         return parsed.toLocaleDateString('en-IN', {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//         })
//     } catch {
//         return ''
//     }
// }

// function Chip({
//     children,
//     variant = 'default',
//     className,
// }: {
//     children: React.ReactNode
//     variant?: 'default' | 'success' | 'warning' | 'error'
//     className?: string
// }) {
//     const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold'
//     const variants = {
//         default: 'border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
//         success: 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200',
//         warning: 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
//         error: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
//     }

//     return (
//         <span className={cn(baseClasses, variants[variant], className)}>
//             {children}
//         </span>
//     )
// }

// function InfoRow({
//     label,
//     value,
//     icon: Icon,
//     highlight = false,
// }: {
//     label: string
//     value?: string | number
//     icon?: React.ComponentType<{ className?: string }>
//     highlight?: boolean
// }) {
//     return (
//         <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//                 {Icon && <Icon className="h-4 w-4 text-gray-500" />}
//                 <span className="text-sm font-medium text-gray-600">{label}:</span>
//             </div>
//             <span
//                 className={cn(
//                     'text-sm text-gray-900',
//                     highlight && 'font-semibold text-blue-600'
//                 )}
//             >
//                 {value ?? 'N/A'}
//             </span>
//         </div>
//     )
// }

// function OrderItemCard({ item, index }: { item: OrderDetail; index: number }) {
//     return (
//         <div
//             className={cn(
//                 'flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
//                 index % 2 === 0 && 'bg-gray-50 dark:bg-gray-900/50'
//             )}
//         >
//             <div className="flex items-center gap-3">
//                 {item.img ? (
//                     <img
//                         src={item.img}
//                         alt={item.name}
//                         className="size-12 rounded-md border border-gray-200 object-cover dark:border-gray-600"
//                         onError={(e) => {
//                             ; (e.currentTarget as HTMLImageElement).style.display = 'none'
//                                 ; (e.currentTarget as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100 dark:bg-gray-700')
//                         }}
//                     />
//                 ) : (
//                     <div className="size-12 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center dark:border-gray-600 dark:bg-gray-700">
//                         <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                     </div>
//                 )}
//                 <div className="min-w-0 flex-1">
//                     <div className="truncate font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400">
//                         {item.quantity} {item.unit || ''} {item.weight ? `(${item.weight})` : ''}
//                     </div>
//                 </div>
//             </div>
//             <div className="text-right">
//                 <div className="font-bold text-gray-900 dark:text-gray-100">₹{item.price}</div>
//             </div>
//         </div>
//     )
// }

// function DateRangePicker({ dateRange, onChange, label }: {
//     dateRange: { startDate: string; endDate: string }
//     onChange: (range: { startDate: string; endDate: string }) => void
//     label?: string
// }) {
//     const [rangeStart, setRangeStart] = useState<Date | null>(null)
//     const [rangeEnd, setRangeEnd] = useState<Date | null>(null)

//     useEffect(() => {
//         setRangeStart(dateRange.startDate ? new Date(dateRange.startDate) : null)
//         setRangeEnd(dateRange.endDate ? new Date(dateRange.endDate) : null)
//     }, [dateRange.startDate, dateRange.endDate])

//     const handleDateChange = (dates: [Date | null, Date | null]) => {
//         const [start, end] = dates
//         const startStr = start ? start.toISOString().split('T')[0] : ''
//         const endStr = end ? end.toISOString().split('T')[0] : ''
//         onChange({ startDate: startStr, endDate: endStr })
//         setRangeStart(start)
//         setRangeEnd(end)
//     }

//     const isSingleDay = dateRange.startDate && dateRange.endDate && new Date(dateRange.startDate).toDateString() === new Date(dateRange.endDate).toDateString()

//     return (
//         <div className="flex flex-col gap-2 w-52">
//             {label && <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>}
//             <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
//                 <DatePicker
//                     selectsRange={true}
//                     startDate={rangeStart}
//                     endDate={rangeEnd}
//                     onChange={handleDateChange}
//                     dateFormat="dd/MM/yyyy"
//                     placeholderText={label ? `Select ${label.toLowerCase()}` : "Select start and end dates"}
//                     className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
//                     isClearable={true}
//                     wrapperClassName="w-full"
//                 />
//             </div>
//             {dateRange.startDate && (
//                 <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
//                     <span className="font-medium">Sel: </span>
//                     {isSingleDay ? (
//                         `Single Day: ${new Date(dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
//                     ) : (
//                         `${new Date(dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(dateRange.endDate || dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default function OrderDisplay({ status }: { status?: string }) {
//     const [orders, setOrders] = useState<Order[]>([])
//     const [loading, setLoading] = useState<boolean>(true)
//     const [error, setError] = useState<string | null>(null)
//     const [selectedId, setSelectedId] = useState<string | null>(null)
//     const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
//         startDate: '',
//         endDate: ''
//     })
//     const [filterSearch, setFilterSearch] = useState('')
//     const [minAmount, setMinAmount] = useState('')
//     const [maxAmount, setMaxAmount] = useState('')
//     const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Status>('all')
//     const { status: paramStatus } = useParams<{ status?: Status }>()

//     // Use the passed status or paramStatus
//     const currentStatus = status || paramStatus

//     // Mimic original store filter behavior
//     const storeUser =
//         typeof window !== 'undefined'
//             ? (JSON.parse(localStorage.getItem('storeUser') || '{}') as {
//                 _id?: string
//                 name?: string
//             })
//             : {}

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 setLoading(true)
//                 setError(null)

//                 const response = await callApi({
//                     endpoint: '/admin/display-order',
//                     method: 'GET',
//                 })

//                 // Extract orders directly (compatible with new API structure)
//                 const ordersData: Order[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

//                 // Transform data to match component expectations (bridge old/new structure)
//                 const transformedOrders: Order[] = ordersData.map((order: any) => ({
//                     ...order,

//                     customer: {
//                         ...order.customer,
//                         deliveryTimeline: {
//                             acceptedAt: order.customer?.deliveryTimeline?.acceptedAt ?? null,
//                             inTransitAt: order.customer?.deliveryTimeline?.inTransitAt ?? null,
//                             deliveredAt: order.customer?.deliveryTimeline?.deliveredAt ?? null,
//                             rejectedAt: order.customer?.deliveryTimeline?.rejectedAt ?? null,
//                         },
//                     },

//                     userName: order.customer?.name,
//                     userPhoneNumber: order.customer?.phone,
//                     houseNo: order.customer?.houseNo,
//                     userLocation: order.customer?.location,
//                     userPincode: order.customer?.pincode,
//                     totalAmount: order.amount,

//                     store: order.store ? { ...order.store, storeName: order.store.name } : null,
//                     deliveryPartner: order.deliveryPartner
//                         ? { deliveryPartnerName: order.deliveryPartner.name }
//                         : null,
//                 }))


//                 setOrders(transformedOrders)
//             } catch (err: any) {
//                 const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
//                 setError(errorMessage)
//                 console.error('Error fetching orders:', err)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchOrders()
//     }, [])

//     const filteredOrders = useMemo(() => {
//         let result = orders
//         if (storeUser._id) {
//             result = result.filter((o) => o.store?._id === storeUser._id || o.store?.name === storeUser.name)
//         }
//         if (currentStatus) {
//             result = result.filter(
//                 (o) => (o.status || 'pending').toLowerCase() === currentStatus.toLowerCase()
//             )
//         }

//         // Order status filter
//         if (orderStatusFilter !== 'all') {
//             result = result.filter(
//                 (o) => (o.status || 'pending').toLowerCase() === orderStatusFilter.toLowerCase()
//             )
//         }

//         // Date range filter for createdAt
//         if (dateRange.startDate || dateRange.endDate) {
//             const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0)
//             const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date()
//             end.setHours(23, 59, 59, 999) // Include full end day

//             result = result.filter((o) => {
//                 const orderDate = parseOrderDate(o.createdAt)
//                 if (!orderDate) return false
//                 return orderDate >= start && orderDate <= end
//             })
//         }
//         // Search filter
//         if (filterSearch) {
//             const query = filterSearch.toLowerCase()
//             result = result.filter(o =>
//                 (o.userName?.toLowerCase().includes(query) ?? false) ||
//                 (o.userPhoneNumber?.includes(filterSearch) ?? false) ||
//                 (o.userLocation?.toLowerCase().includes(query) ?? false) ||
//                 (o.store?.storeName?.toLowerCase().includes(query) ?? false)
//             )
//         }
//         // Amount filters
//         if (minAmount) {
//             const min = parseFloat(minAmount)
//             if (!isNaN(min)) {
//                 result = result.filter(o => (o.totalAmount ?? 0) >= min)
//             }
//         }
//         if (maxAmount) {
//             const max = parseFloat(maxAmount)
//             if (!isNaN(max)) {
//                 result = result.filter(o => (o.totalAmount ?? 0) <= max)
//             }
//         }
//         // Delivery phase filter
//         if (deliveryPhase !== 'all') {
//             result = result.filter(o => {
//                 const tl = o.customer?.deliveryTimeline
//                 if (!tl) return false
//                 const rejected = !!tl.rejectedAt
//                 switch (deliveryPhase) {
//                     case 'pending':
//                         return !tl.acceptedAt && !rejected
//                     case 'accepted':
//                         return !!tl.acceptedAt && !tl.inTransitAt && !tl.deliveredAt && !rejected
//                     case 'in_transit':
//                         return !!tl.inTransitAt && !tl.deliveredAt && !rejected
//                     case 'delivered':
//                         return !!tl.deliveredAt && !rejected
//                     case 'rejected':
//                         return rejected
//                     default:
//                         return true
//                 }
//             })
//         }
//         // Sort by createdAt descending
//         result = result.sort((a, b) => {
//             const dateA = parseOrderDate(a.createdAt) || new Date(0)
//             const dateB = parseOrderDate(b.createdAt) || new Date(0)
//             return dateB.getTime() - dateA.getTime()
//         })
//         return result
//     }, [orders, currentStatus, storeUser, dateRange, filterSearch, minAmount, maxAmount, deliveryPhase, orderStatusFilter])

//     // Group orders by day
//     const groupedOrders = useMemo(() => {
//         const groups: { [key: string]: Order[] } = {}
//         filteredOrders.forEach(order => {
//             const parsedDate = parseOrderDate(order.createdAt)
//             if (parsedDate) {
//                 const dayKey = parsedDate.toLocaleDateString('en-CA') // YYYY-MM-DD for sorting
//                 if (!groups[dayKey]) {
//                     groups[dayKey] = []
//                 }
//                 groups[dayKey].push(order)
//             }
//         })
//         // Sort groups by date descending
//         const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
//         const sortedGroups: { day: string; orders: Order[] }[] = sortedKeys.map(key => ({
//             day: key,
//             orders: groups[key]
//         }))
//         return sortedGroups
//     }, [filteredOrders])

//     const selectedOrder = filteredOrders.find((o) => o._id === selectedId) ?? null

//     // Status variant mapping for chips
//     const getStatusVariant = (status: string) => {
//         const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
//             pending: 'warning',
//             confirmed: 'default',
//             preparing: 'default',
//             ready: 'success',
//             picked_up: 'success',
//             in_transit: 'warning',
//             delivered: 'success',
//             cancelled: 'error',
//         }
//         return variants[status.toLowerCase()] || 'default'
//     }

//     const handleDownloadExcel = () => {
//         if (!filteredOrders.length) {
//             alert('No orders to download.')
//             return
//         }

//         const rows: any[] = []

//         // Headers for order summary
//         rows.push(['Order ID', 'Customer Name', 'Phone', 'Address', 'Pincode', 'Store', 'Status', 'Delivery Status', 'Total Amount', 'Items Count', 'Created At'])

//         // Add order summary rows
//         filteredOrders.forEach((order) => {
//             const address = `${order.houseNo || ''}, ${order.userLocation || ''}`.trim()
//             rows.push([
//                 order._id.slice(-6).toUpperCase(),
//                 order.userName || '',
//                 order.userPhoneNumber || '',
//                 address,
//                 order.userPincode || '',
//                 order.store?.storeName || '',
//                 order.status || 'Pending',
//                 order.deliveryStatus || '',
//                 `₹${order.totalAmount ?? 0}`,
//                 order.orderDetails?.length || 0,
//                 formatDateForExcel(order.createdAt),
//             ])

//             // Add detailed item rows (with order ID prefix)
//             if (order.orderDetails && order.orderDetails.length > 0) {
//                 order.orderDetails.forEach((item) => {
//                     rows.push([
//                         `  └ ${item.name}`,
//                         item.quantity,
//                         item.unit || '',
//                         item.weight ? `(${item.weight})` : '',
//                         `₹${item.price}`,
//                         '', // Empty for order-level fields
//                         '', '', '', '', '',
//                     ])
//                 })
//             }
//         })

//         const ws = XLSX.utils.aoa_to_sheet(rows)
//         const wb = XLSX.utils.book_new()
//         XLSX.utils.book_append_sheet(wb, ws, 'Orders')

//         // Generate filename with date range if applicable
//         let filename = 'orders'
//         if (dateRange.startDate && dateRange.endDate) {
//             const start = new Date(dateRange.startDate).toISOString().split('T')[0]
//             const end = new Date(dateRange.endDate).toISOString().split('T')[0]
//             filename += `_${start}_to_${end}`
//         } else if (dateRange.startDate) {
//             const start = new Date(dateRange.startDate).toISOString().split('T')[0]
//             filename += `_${start}`
//         } else if (dateRange.endDate) {
//             const end = new Date(dateRange.endDate).toISOString().split('T')[0]
//             filename += `_upto_${end}`
//         }

//         // Add day count to filename if date range is selected
//         if (dateRange.startDate && dateRange.endDate) {
//             const start = new Date(dateRange.startDate);
//             const end = new Date(dateRange.endDate);
//             const diffTime = Math.abs(end.getTime() - start.getTime());
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//             filename += `_${diffDays}_days`
//         }

//         filename += `_${currentStatus || 'all'}.xlsx`

//         XLSX.writeFile(wb, filename)
//     }

//     const handleRefresh = () => {
//         // Re-fetch data
//         const fetchOrders = async () => {
//             try {
//                 setLoading(true)
//                 setError(null)

//                 const response = await callApi({
//                     endpoint: '/admin/display-order',
//                     method: 'GET',
//                 })

//                 const ordersData: any[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

//                 const transformedOrders: Order[] = ordersData.map((order: any) => ({
//                     ...order,
//                     userName: order.customer?.name,
//                     userPhoneNumber: order.customer?.phone,
//                     houseNo: order.customer?.houseNo,
//                     userLocation: order.customer?.location,
//                     userPincode: order.customer?.pincode,
//                     totalAmount: order.amount,
//                     store: order.store ? { ...order.store, storeName: order.store.name } : null,
//                     deliveryPartner: order.deliveryPartner ? { deliveryPartnerName: order.deliveryPartner.name } : null,
//                 }))

//                 setOrders(transformedOrders)
//             } catch (err: any) {
//                 const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
//                 setError(errorMessage)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchOrders()
//     }

//     const clearAllFilters = () => {
//         setFilterSearch('')
//         setMinAmount('')
//         setMaxAmount('')
//         setDeliveryPhase('all')
//         setOrderStatusFilter('all')
//         setDateRange({ startDate: '', endDate: '' })
//     }

//     if (loading) {
//         return (
//             <section className="space-y-6">
//                 <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
//                     <div className="flex items-center justify-between">
//                         <div className="space-y-2">
//                             <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                             <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                         </div>
//                         <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     {[...Array(3)].map((_, i) => (
//                         <div
//                             key={i}
//                             className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
//                         />
//                     ))}
//                 </div>
//             </section>
//         )
//     }

//     if (error) {
//         return (
//             <section
//                 className="mx-auto w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
//                 role="alert"
//             >
//                 <div className="mb-3 text-3xl" aria-hidden>
//                     ⚠️
//                 </div>
//                 <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Error Loading Orders</h3>
//                 <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">
//                     Failed to fetch orders. Please try again later.
//                 </p>
//                 <div className="mt-4 flex justify-center">
//                     <button
//                         onClick={handleRefresh}
//                         className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
//                         aria-label="Retry loading orders"
//                     >
//                         <RefreshCw className="h-4 w-4" />
//                         Try Again
//                     </button>
//                 </div>
//             </section>
//         )
//     }

//     return (
//         <section className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-wrap items-start justify-between gap-4">
//                 <div className="space-y-2">
//                     <h1 className="text-balance text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
//                         {currentStatus
//                             ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
//                             : 'Order Management'}
//                     </h1>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Manage and track your orders efficiently
//                     </p>
//                 </div>
//                 <div className="flex flex-col gap-4">
//                     <div className="flex flex-wrap items-center gap-3">
//                         {/* Search Input */}
//                         <div className="relative min-w-[200px] flex-1">
//                             <input
//                                 type="text"
//                                 placeholder="Search customer name, phone, store, address..."
//                                 value={filterSearch}
//                                 onChange={(e) => setFilterSearch(e.target.value)}
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
//                             />
//                         </div>
//                         {/* Amount Filters */}
//                         <div className="flex items-center gap-1 text-sm">
//                             <span className="text-gray-500">₹</span>
//                             <input
//                                 type="number"
//                                 placeholder="Min"
//                                 value={minAmount}
//                                 onChange={(e) => setMinAmount(e.target.value)}
//                                 className="w-16 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
//                             />
//                             <span className="text-gray-500">-</span>
//                             <input
//                                 type="number"
//                                 placeholder="Max"
//                                 value={maxAmount}
//                                 onChange={(e) => setMaxAmount(e.target.value)}
//                                 className="w-16 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
//                             />
//                         </div>
//                         {/* Order Status Select */}
//                         <select
//                             value={orderStatusFilter}
//                             onChange={(e) => setOrderStatusFilter(e.target.value as 'all' | Status)}
//                             className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 w-32"
//                         >
//                             <option value="all">All Status</option>
//                             <option value="pending">Pending</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="preparing">Preparing</option>
//                             <option value="ready">Ready</option>
//                             <option value="picked_up">Picked Up</option>
//                             <option value="in_transit">In Transit</option>
//                             <option value="delivered">Delivered</option>
//                             <option value="cancelled">Cancelled</option>
//                         </select>
//                         {/* Delivery Phase Select */}
//                         <select
//                             value={deliveryPhase}
//                             onChange={(e) => setDeliveryPhase(e.target.value as typeof deliveryPhase)}
//                             className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 w-32"
//                         >
//                             <option value="all">All Phases</option>
//                             <option value="pending">Pending</option>
//                             <option value="accepted">Accepted</option>
//                             <option value="in_transit">In Transit</option>
//                             <option value="delivered">Delivered</option>
//                             <option value="rejected">Rejected</option>
//                         </select>
//                         {/* Date Range Picker */}
//                         <DateRangePicker dateRange={dateRange} onChange={setDateRange} label="Date Range" />
//                     </div>
//                     <div className="flex items-center justify-end gap-3 sm:justify-start">
//                         {/* Download Button */}
//                         <button
//                             onClick={handleDownloadExcel}
//                             disabled={!filteredOrders.length}
//                             className={cn(
//                                 'inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 ',
//                                 !filteredOrders.length
//                                     ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
//                                     : 'border-gray-300 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600'
//                             )}
//                             aria-label="Download orders as Excel"
//                         >
//                             <Download className="h-4 w-4" />
//                             Download Excel
//                         </button>
//                         <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-800/50">
//                             <div className="text-right">
//                                 <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{filteredOrders.length}</div>
//                                 <div className="text-xs text-gray-600 dark:text-gray-400">
//                                     order{filteredOrders.length !== 1 ? 's' : ''}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={handleRefresh}
//                                 className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
//                                 aria-label="Refresh orders"
//                             >
//                                 <RefreshCw className="h-4 w-4" />
//                             </button>
//                         </div>
//                         <button
//                             onClick={clearAllFilters}
//                             className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//                         >
//                             Clear Filters
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {!filteredOrders.length ? (
//                 <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
//                     <div className="mb-4 text-5xl opacity-70" aria-hidden>
//                         📦
//                     </div>
//                     <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No Orders Found</h2>
//                     <p className="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
//                         {currentStatus
//                             ? `There are no ${currentStatus} orders to display at this time.`
//                             : (dateRange.startDate || dateRange.endDate || filterSearch || minAmount || maxAmount || deliveryPhase !== 'all' || orderStatusFilter !== 'all')
//                                 ? 'No orders match the current filters.'
//                                 : 'No orders available in your store at the moment.'}
//                     </p>
//                     <button
//                         onClick={handleRefresh}
//                         className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
//                         aria-label="Refresh orders"
//                     >
//                         <RefreshCw className="h-4 w-4" />
//                         Refresh Orders
//                     </button>
//                 </div>
//             ) : (
//                 <div className="flex flex-col gap-6 md:flex-row">
//                     {/* Left: Order list - Grouped by day */}
//                     <div className="w-full md:w-5/12">
//                         <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
//                             <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
//                                 <span className="h-5 w-1 rounded bg-blue-600" />
//                                 {currentStatus
//                                     ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
//                                     : 'All Orders'}
//                             </h2>
//                             {(dateRange.startDate || dateRange.endDate) && (
//                                 <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
//                                     Showing orders from{' '}
//                                     {dateRange.startDate ? new Date(dateRange.startDate).toLocaleDateString() : 'the beginning'} to{' '}
//                                     {dateRange.endDate ? new Date(dateRange.endDate).toLocaleDateString() : 'now'}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
//                             <div className="flex flex-col gap-3">
//                                 {groupedOrders.map(({ day, orders }, groupIdx) => (
//                                     <div key={day} className="space-y-2">
//                                         <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pb-2">
//                                             <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                                 {formatDateDay(orders[0]?.createdAt)}
//                                             </h3>
//                                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                                                 {orders.length} order{orders.length !== 1 ? 's' : ''}
//                                             </p>
//                                         </div>
//                                         <div className="flex flex-col gap-3">
//                                             {orders.map((order, idx) => (
//                                                 <button
//                                                     key={order._id}
//                                                     onClick={() => setSelectedId(order._id)}
//                                                     className={cn(
//                                                         'group relative w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-md',
//                                                         selectedId === order._id &&
//                                                         'ring-2 ring-blue-500 shadow-lg dark:ring-blue-500'
//                                                     )}
//                                                     aria-pressed={selectedId === order._id}
//                                                     aria-label={`Select order ${order._id.slice(-6).toUpperCase()}`}
//                                                     style={{
//                                                         animationDelay: `${(groupIdx * 10 + idx) * 50}ms`,
//                                                     }}
//                                                 >
//                                                     <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-blue-500/60 to-indigo-500/60 opacity-70" aria-hidden />

//                                                     <div className="mb-2 flex items-start justify-between">
//                                                         <div>
//                                                             <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                                                 Order #{order._id.slice(-6).toUpperCase()}
//                                                             </h3>
//                                                             <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
//                                                                 <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
//                                                                 {formatDate(order.createdAt)}
//                                                             </p>
//                                                         </div>
//                                                         <Chip variant={getStatusVariant(order.status || 'pending')}>
//                                                             {order.status || 'Pending'}
//                                                         </Chip>
//                                                     </div>

//                                                     <div className="grid grid-cols-[1fr_auto] items-center gap-3">
//                                                         <div className="space-y-1">
//                                                             <p className="text-sm text-gray-600 dark:text-gray-400">
//                                                                 <span className="font-medium text-gray-900 dark:text-gray-100">
//                                                                     Customer:
//                                                                 </span>{' '}
//                                                                 {order.userName ?? 'N/A'}
//                                                             </p>
//                                                             <p className="text-sm text-gray-600 dark:text-gray-400">
//                                                                 <span className="font-medium text-gray-900 dark:text-gray-100">
//                                                                     Store:
//                                                                 </span>{' '}
//                                                                 <span
//                                                                     className={cn(
//                                                                         order.store?.storeName === storeUser.name
//                                                                             ? 'font-semibold text-blue-600 dark:text-blue-400'
//                                                                             : 'text-gray-900 dark:text-gray-100'
//                                                                     )}
//                                                                 >
//                                                                     {order.store?.storeName ?? 'N/A'}
//                                                                 </span>
//                                                             </p>
//                                                         </div>
//                                                         <div className="text-right">
//                                                             <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
//                                                                 ₹{order.totalAmount ?? 0}
//                                                             </div>
//                                                             <div className="flex items-center justify-end gap-1 text-xs text-gray-600 dark:text-gray-400">
//                                                                 <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
//                                                                 {(order.orderDetails?.length ?? 0)} item
//                                                                 {order.orderDetails?.length !== 1 ? 's' : ''}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right: Details */}
//                     <div className="w-full md:w-7/12">
//                         <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
//                             <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
//                                 <span className="h-5 w-1 rounded bg-blue-600" />
//                                 Order Details
//                             </h2>
//                         </div>

//                         {selectedOrder ? (
//                             <div className="sticky top-5 animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
//                                 {/* Header */}
//                                 <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
//                                     <div>
//                                         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
//                                             Order #{selectedOrder._id.slice(-6).toUpperCase()}
//                                         </h3>
//                                         <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                                             <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
//                                             Created: {formatDate(selectedOrder.createdAt)}
//                                         </p>
//                                     </div>
//                                     <Chip variant={getStatusVariant(selectedOrder.status || 'pending')}>
//                                         {selectedOrder.status || 'Pending'}
//                                     </Chip>
//                                 </div>

//                                 {/* Info grid */}
//                                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                                     <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
//                                         <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                             <User className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
//                                             Customer Information
//                                         </h4>
//                                         <div className="space-y-3">
//                                             <InfoRow label="Name" value={selectedOrder.userName} icon={User} />
//                                             <InfoRow
//                                                 label="Phone"
//                                                 value={selectedOrder.userPhoneNumber}
//                                                 icon={Phone}
//                                             />
//                                             <InfoRow
//                                                 label="Store"
//                                                 value={selectedOrder.store?.storeName}
//                                                 highlight={selectedOrder.store?.storeName === storeUser.name}
//                                                 icon={MapPin}
//                                             />
//                                             <div>
//                                                 <InfoRow label="Address" value="" icon={MapPin} />
//                                                 <p className="ml-6 text-sm text-gray-600 dark:text-gray-400">
//                                                     {selectedOrder.houseNo ? `${selectedOrder.houseNo}, ` : ''}
//                                                     {selectedOrder.userLocation ?? 'N/A'}
//                                                     {selectedOrder.userPincode
//                                                         ? `, ${selectedOrder.userPincode}`
//                                                         : ''}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
//                                         <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                             <IndianRupee className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
//                                             Order Summary
//                                         </h4>
//                                         <div className="space-y-3">
//                                             <InfoRow
//                                                 label="Total Amount"
//                                                 value={`₹${selectedOrder.totalAmount ?? 0}`}
//                                                 icon={IndianRupee}
//                                             />
//                                             <InfoRow
//                                                 label="Delivery Status"
//                                                 value={selectedOrder.deliveryStatus}
//                                                 icon={Truck}
//                                             />
//                                             {/* Manager removed from new API; conditionally render if present in future */}
//                                             {selectedOrder.deliveryPartner && (
//                                                 <InfoRow
//                                                     label="Delivery Partner"
//                                                     value={selectedOrder.deliveryPartner.deliveryPartnerName}
//                                                     icon={Truck}
//                                                 />
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Delivery Timeline */}
//                                 {selectedOrder.customer?.deliveryTimeline && (
//                                     <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
//                                         <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                             <Truck className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
//                                             Delivery Timeline
//                                         </h4>

//                                         <div className="space-y-2">
//                                             {Object.entries(selectedOrder.customer.deliveryTimeline).map(
//                                                 ([key, value]) =>
//                                                     value && (
//                                                         <InfoRow
//                                                             key={key}
//                                                             label={key.replace(/([A-Z])/g, ' $1')}
//                                                             value={formatDate(value as string)}
//                                                         />
//                                                     )
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}


//                                 {/* Items */}
//                                 <div className="mt-6 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
//                                     <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                         <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                                         Order Items ({selectedOrder.orderDetails?.length ?? 0})
//                                     </h4>
//                                     {selectedOrder.orderDetails?.length ? (
//                                         <div className="mt-3 flex flex-col gap-2">
//                                             {selectedOrder.orderDetails.map((item, i) => (
//                                                 <OrderItemCard key={`${item._id}-${i}`} item={item} index={i} />
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <p className="py-6 text-center text-sm italic text-gray-600 dark:text-gray-400">
//                                             No items in this order
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
//                                 <div className="mb-4 text-5xl opacity-50" aria-hidden>
//                                     👆
//                                 </div>
//                                 <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Select an Order</h3>
//                                 <p className="mx-auto max-w-sm text-sm text-gray-600 dark:text-gray-400">
//                                     Choose an order from the list to view detailed information.
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </section>
//     )
// }

import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { callApi } from '../../util/admin_api'
import { RefreshCw, User, MapPin, Phone, Package, IndianRupee, Truck, Download, Calendar } from 'lucide-react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import * as XLSX from 'xlsx'

// Simple cn utility (classNames with Tailwind merge simulation)
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}

type Status =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'

type DeliveryPhase = 'all' | 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'rejected'

interface OrderDetail {
    _id: string
    name: string
    quantity: number
    price: number
    unit?: string
    weight?: string
    img?: string | null
}

interface DeliveryTimeline {
    acceptedAt?: string | null
    inTransitAt?: string | null
    deliveredAt?: string | null
    rejectedAt?: string | null
}
interface Customer {
    name: string
    phone: string
    houseNo?: string
    location: string
    pincode?: string
}

interface Store {
    _id?: string
    name: string
    location?: string
    phone?: string
    storeName?: string  // Added for backward compatibility
}

interface DeliveryPartner {
    name: string
    phone?: string
    deliveryPartnerName?: string  // Added for backward compatibility
}

interface Order {
    _id: string
    customer: Customer & {
        deliveryTimeline?: DeliveryTimeline
    }
    totalAmount?: number
    amount?: number
    createdAt?: string
    status?: Status | string
    deliveryStatus?: string
    isUrgent?: boolean
    orderDetails?: OrderDetail[]
    store?: Store | null
    deliveryPartner?: DeliveryPartner | null
    userName?: string
    userPhoneNumber?: string
    houseNo?: string
    userLocation?: string
    userPincode?: string
}

function parseOrderDate(dateString?: string): Date | null {
    if (!dateString) return null;
    try {
        // Format: "06/01/2026, 02:09:00 pm" -> DD/MM/YYYY, HH:MM:SS am/pm
        const [datePart, timePart] = dateString.split(', ');
        const [dayStr, monthStr, yearStr] = datePart.split('/');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        const [hourStr, minStr, secStr, ...ampmArr] = timePart.split(':');
        let hour = parseInt(hourStr, 10);
        const min = parseInt(minStr, 10);
        const sec = parseInt(secStr, 10);
        const ampm = ampmArr.join('').toLowerCase().trim();
        if (ampm === 'pm' && hour !== 12) {
            hour += 12;
        } else if (ampm === 'am' && hour === 12) {
            hour = 0;
        }
        return new Date(year, month - 1, day, hour, min, sec);
    } catch {
        return null;
    }
}

function formatDate(dateString?: string) {
    const parsed = parseOrderDate(dateString);
    if (!parsed) return 'N/A'
    try {
        return parsed.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    } catch {
        return 'N/A'
    }
}

function formatDateDay(dateString?: string) {
    const parsed = parseOrderDate(dateString);
    if (!parsed) return 'N/A'
    try {
        return parsed.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    } catch {
        return 'N/A'
    }
}

function formatDateForExcel(dateString?: string) {
    const parsed = parseOrderDate(dateString);
    if (!parsed) return ''
    try {
        return parsed.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return ''
    }
}

function Chip({
    children,
    variant = 'default',
    className,
}: {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error'
    className?: string
}) {
    const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold'
    const variants = {
        default: 'border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
        success: 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200',
        warning: 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
        error: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
    }

    return (
        <span className={cn(baseClasses, variants[variant], className)}>
            {children}
        </span>
    )
}

function InfoRow({
    label,
    value,
    icon: Icon,
    highlight = false,
}: {
    label: string
    value?: string | number
    icon?: React.ComponentType<{ className?: string }>
    highlight?: boolean
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                <span className="text-sm font-medium text-gray-600">{label}:</span>
            </div>
            <span
                className={cn(
                    'text-sm text-gray-900',
                    highlight && 'font-semibold text-blue-600'
                )}
            >
                {value ?? 'N/A'}
            </span>
        </div>
    )
}

function OrderItemCard({ item, index }: { item: OrderDetail; index: number }) {
    return (
        <div
            className={cn(
                'flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
                index % 2 === 0 && 'bg-gray-50 dark:bg-gray-900/50'
            )}
        >
            <div className="flex items-center gap-3">
                {item.img ? (
                    <img
                        src={item.img}
                        alt={item.name}
                        className="size-12 rounded-md border border-gray-200 object-cover dark:border-gray-600"
                        onError={(e) => {
                            ; (e.currentTarget as HTMLImageElement).style.display = 'none'
                                ; (e.currentTarget as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100 dark:bg-gray-700')
                        }}
                    />
                ) : (
                    <div className="size-12 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center dark:border-gray-600 dark:bg-gray-700">
                        <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.quantity} {item.unit || ''} {item.weight ? `(${item.weight})` : ''}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-gray-100">₹{item.price}</div>
            </div>
        </div>
    )
}

function DateRangePicker({ dateRange, onChange, label }: {
    dateRange: { startDate: string; endDate: string }
    onChange: (range: { startDate: string; endDate: string }) => void
    label?: string
}) {
    const [rangeStart, setRangeStart] = useState<Date | null>(null)
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null)

    useEffect(() => {
        setRangeStart(dateRange.startDate ? new Date(dateRange.startDate) : null)
        setRangeEnd(dateRange.endDate ? new Date(dateRange.endDate) : null)
    }, [dateRange.startDate, dateRange.endDate])

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates
        const startStr = start ? start.toISOString().split('T')[0] : ''
        const endStr = end ? end.toISOString().split('T')[0] : ''
        onChange({ startDate: startStr, endDate: endStr })
        setRangeStart(start)
        setRangeEnd(end)
    }

    const isSingleDay = dateRange.startDate && dateRange.endDate && new Date(dateRange.startDate).toDateString() === new Date(dateRange.endDate).toDateString()

    return (
        <div className="flex flex-col gap-2 w-52">
            {label && <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>}
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <DatePicker
                    selectsRange={true}
                    startDate={rangeStart}
                    endDate={rangeEnd}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={label ? `Select ${label.toLowerCase()}` : "Select start and end dates"}
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    isClearable={true}
                    wrapperClassName="w-full"
                />
            </div>
            {dateRange.startDate && (
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    <span className="font-medium">Sel: </span>
                    {isSingleDay ? (
                        `Single Day: ${new Date(dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    ) : (
                        `${new Date(dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(dateRange.endDate || dateRange.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    )}
                </div>
            )}
        </div>
    )
}

export default function OrderDisplay({ status }: { status?: string }) {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: ''
    })
    const [filterSearch, setFilterSearch] = useState('')
    const [minAmount, setMinAmount] = useState('')
    const [maxAmount, setMaxAmount] = useState('')
    const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Status>('all')
    const [deliveryPhase, setDeliveryPhase] = useState<DeliveryPhase>('all')
    const { status: paramStatus } = useParams<{ status?: Status }>()

    // Use the passed status or paramStatus
    const currentStatus = status || paramStatus

    // Mimic original store filter behavior
    const storeUser =
        typeof window !== 'undefined'
            ? (JSON.parse(localStorage.getItem('storeUser') || '{}') as {
                _id?: string
                name?: string
            })
            : {}

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await callApi({
                    endpoint: '/admin/display-order',
                    method: 'GET',
                })

                // Extract orders directly (compatible with new API structure)
                const ordersData: Order[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

                // Transform data to match component expectations (bridge old/new structure)
                const transformedOrders: Order[] = ordersData.map((order: any) => ({
                    ...order,

                    customer: {
                        ...order.customer,
                        deliveryTimeline: {
                            acceptedAt: order.customer?.deliveryTimeline?.acceptedAt ?? null,
                            inTransitAt: order.customer?.deliveryTimeline?.inTransitAt ?? null,
                            deliveredAt: order.customer?.deliveryTimeline?.deliveredAt ?? null,
                            rejectedAt: order.customer?.deliveryTimeline?.rejectedAt ?? null,
                        },
                    },

                    userName: order.customer?.name,
                    userPhoneNumber: order.customer?.phone,
                    houseNo: order.customer?.houseNo,
                    userLocation: order.customer?.location,
                    userPincode: order.customer?.pincode,
                    totalAmount: order.amount,

                    store: order.store ? { ...order.store, storeName: order.store.name } : null,
                    deliveryPartner: order.deliveryPartner
                        ? { deliveryPartnerName: order.deliveryPartner.name }
                        : null,
                }))


                setOrders(transformedOrders)
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
                setError(errorMessage)
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const filteredOrders = useMemo(() => {
        let result = orders
        if (storeUser._id) {
            result = result.filter((o) => o.store?._id === storeUser._id || o.store?.name === storeUser.name)
        }
        if (currentStatus) {
            result = result.filter(
                (o) => (o.status || 'pending').toLowerCase() === currentStatus.toLowerCase()
            )
        }

        // Order status filter
        if (orderStatusFilter !== 'all') {
            result = result.filter(
                (o) => (o.status || 'pending').toLowerCase() === orderStatusFilter.toLowerCase()
            )
        }

        // Date range filter for createdAt
        if (dateRange.startDate || dateRange.endDate) {
            const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0)
            const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date()
            end.setHours(23, 59, 59, 999) // Include full end day

            result = result.filter((o) => {
                const orderDate = parseOrderDate(o.createdAt)
                if (!orderDate) return false
                return orderDate >= start && orderDate <= end
            })
        }
        // Search filter
        if (filterSearch) {
            const query = filterSearch.toLowerCase()
            result = result.filter(o =>
                (o.userName?.toLowerCase().includes(query) ?? false) ||
                (o.userPhoneNumber?.includes(filterSearch) ?? false) ||
                (o.userLocation?.toLowerCase().includes(query) ?? false) ||
                (o.store?.storeName?.toLowerCase().includes(query) ?? false)
            )
        }
        // Amount filters
        if (minAmount) {
            const min = parseFloat(minAmount)
            if (!isNaN(min)) {
                result = result.filter(o => (o.totalAmount ?? 0) >= min)
            }
        }
        if (maxAmount) {
            const max = parseFloat(maxAmount)
            if (!isNaN(max)) {
                result = result.filter(o => (o.totalAmount ?? 0) <= max)
            }
        }
        // Delivery phase filter
        if (deliveryPhase !== 'all') {
            result = result.filter(o => {
                const tl = o.customer?.deliveryTimeline
                if (!tl) return false
                const rejected = !!tl.rejectedAt
                switch (deliveryPhase) {
                    case 'pending':
                        return !tl.acceptedAt && !rejected
                    case 'accepted':
                        return !!tl.acceptedAt && !tl.inTransitAt && !tl.deliveredAt && !rejected
                    case 'in_transit':
                        return !!tl.inTransitAt && !tl.deliveredAt && !rejected
                    case 'delivered':
                        return !!tl.deliveredAt && !rejected
                    case 'rejected':
                        return rejected
                    default:
                        return true
                }
            })
        }
        // Sort by createdAt descending
        result = result.sort((a, b) => {
            const dateA = parseOrderDate(a.createdAt) || new Date(0)
            const dateB = parseOrderDate(b.createdAt) || new Date(0)
            return dateB.getTime() - dateA.getTime()
        })
        return result
    }, [orders, currentStatus, storeUser, dateRange, filterSearch, minAmount, maxAmount, deliveryPhase, orderStatusFilter])

    // Group orders by day
    const groupedOrders = useMemo(() => {
        const groups: { [key: string]: Order[] } = {}
        filteredOrders.forEach(order => {
            const parsedDate = parseOrderDate(order.createdAt)
            if (parsedDate) {
                const dayKey = parsedDate.toLocaleDateString('en-CA') // YYYY-MM-DD for sorting
                if (!groups[dayKey]) {
                    groups[dayKey] = []
                }
                groups[dayKey].push(order)
            }
        })
        // Sort groups by date descending
        const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        const sortedGroups: { day: string; orders: Order[] }[] = sortedKeys.map(key => ({
            day: key,
            orders: groups[key]
        }))
        return sortedGroups
    }, [filteredOrders])

    const selectedOrder = filteredOrders.find((o) => o._id === selectedId) ?? null

    // Status variant mapping for chips
    const getStatusVariant = (status: string) => {
        const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
            pending: 'warning',
            confirmed: 'default',
            preparing: 'default',
            ready: 'success',
            picked_up: 'success',
            in_transit: 'warning',
            delivered: 'success',
            cancelled: 'error',
        }
        return variants[status.toLowerCase()] || 'default'
    }

    const handleDownloadExcel = () => {
        if (!filteredOrders.length) {
            alert('No orders to download.')
            return
        }

        const rows: any[] = []

        // Headers for order summary
        rows.push(['Order ID', 'Customer Name', 'Phone', 'Address', 'Pincode', 'Store', 'Status', 'Delivery Status', 'Total Amount', 'Items Count', 'Created At'])

        // Add order summary rows
        filteredOrders.forEach((order) => {
            const address = `${order.houseNo || ''}, ${order.userLocation || ''}`.trim()
            rows.push([
                order._id.slice(-6).toUpperCase(),
                order.userName || '',
                order.userPhoneNumber || '',
                address,
                order.userPincode || '',
                order.store?.storeName || '',
                order.status || 'Pending',
                order.deliveryStatus || '',
                `₹${order.totalAmount ?? 0}`,
                order.orderDetails?.length || 0,
                formatDateForExcel(order.createdAt),
            ])

            // Add detailed item rows (with order ID prefix)
            if (order.orderDetails && order.orderDetails.length > 0) {
                order.orderDetails.forEach((item) => {
                    rows.push([
                        `  └ ${item.name}`,
                        item.quantity,
                        item.unit || '',
                        item.weight ? `(${item.weight})` : '',
                        `₹${item.price}`,
                        '', // Empty for order-level fields
                        '', '', '', '', '',
                    ])
                })
            }
        })

        const ws = XLSX.utils.aoa_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Orders')

        // Generate filename with date range if applicable
        let filename = 'orders'
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate).toISOString().split('T')[0]
            const end = new Date(dateRange.endDate).toISOString().split('T')[0]
            filename += `_${start}_to_${end}`
        } else if (dateRange.startDate) {
            const start = new Date(dateRange.startDate).toISOString().split('T')[0]
            filename += `_${start}`
        } else if (dateRange.endDate) {
            const end = new Date(dateRange.endDate).toISOString().split('T')[0]
            filename += `_upto_${end}`
        }

        // Add day count to filename if date range is selected
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            filename += `_${diffDays}_days`
        }

        filename += `_${currentStatus || 'all'}.xlsx`

        XLSX.writeFile(wb, filename)
    }

    const handleRefresh = () => {
        // Re-fetch data
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await callApi({
                    endpoint: '/admin/display-order',
                    method: 'GET',
                })

                const ordersData: any[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

                const transformedOrders: Order[] = ordersData.map((order: any) => ({
                    ...order,
                    userName: order.customer?.name,
                    userPhoneNumber: order.customer?.phone,
                    houseNo: order.customer?.houseNo,
                    userLocation: order.customer?.location,
                    userPincode: order.customer?.pincode,
                    totalAmount: order.amount,
                    store: order.store ? { ...order.store, storeName: order.store.name } : null,
                    deliveryPartner: order.deliveryPartner ? { deliveryPartnerName: order.deliveryPartner.name } : null,
                }))

                setOrders(transformedOrders)
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }

    const clearAllFilters = () => {
        setFilterSearch('')
        setMinAmount('')
        setMaxAmount('')
        setDeliveryPhase('all')
        setOrderStatusFilter('all')
        setDateRange({ startDate: '', endDate: '' })
    }

    if (loading) {
        return (
            <section className="space-y-6">
                <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                        />
                    ))}
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section
                className="mx-auto w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
                role="alert"
            >
                <div className="mb-3 text-3xl" aria-hidden>
                    ⚠️
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Error Loading Orders</h3>
                <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">
                    Failed to fetch orders. Please try again later.
                </p>
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
                        aria-label="Retry loading orders"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-balance text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                        {currentStatus
                            ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
                            : 'Order Management'}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage and track your orders efficiently
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative min-w-[200px] flex-1">
                            <input
                                type="text"
                                placeholder="Search customer name, phone, store, address..."
                                value={filterSearch}
                                onChange={(e) => setFilterSearch(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        {/* Amount Filters */}
                        <div className="flex items-center gap-1 text-sm">
                            <span className="text-gray-500">₹</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                className="w-16 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                className="w-16 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        {/* Order Status Select */}
                        <select
                            value={orderStatusFilter}
                            onChange={(e) => setOrderStatusFilter(e.target.value as 'all' | Status)}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 w-32"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {/* Delivery Phase Select */}
                        {/* <select
                            value={deliveryPhase}
                            onChange={(e) => setDeliveryPhase(e.target.value as DeliveryPhase)}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 w-32"
                        >
                            <option value="all">All Phases</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="rejected">Rejected</option>
                        </select> */}
                        {/* Date Range Picker */}
                        <DateRangePicker dateRange={dateRange} onChange={setDateRange} label="Date Range" />
                    </div>
                    <div className="flex items-center justify-end gap-3 sm:justify-start">
                        {/* Download Button */}
                        <button
                            onClick={handleDownloadExcel}
                            disabled={!filteredOrders.length}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 ',
                                !filteredOrders.length
                                    ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                    : 'border-gray-300 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600'
                            )}
                            aria-label="Download orders as Excel"
                        >
                            <Download className="h-4 w-4" />
                            Download Excel
                        </button>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-800/50">
                            <div className="text-right">
                                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{filteredOrders.length}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    order{filteredOrders.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                                aria-label="Refresh orders"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            onClick={clearAllFilters}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {!filteredOrders.length ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 text-5xl opacity-70" aria-hidden>
                        📦
                    </div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No Orders Found</h2>
                    <p className="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
                        {currentStatus
                            ? `There are no ${currentStatus} orders to display at this time.`
                            : (dateRange.startDate || dateRange.endDate || filterSearch || minAmount || maxAmount || deliveryPhase !== 'all' || orderStatusFilter !== 'all')
                                ? 'No orders match the current filters.'
                                : 'No orders available in your store at the moment.'}
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
                        aria-label="Refresh orders"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Orders
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Left: Order list - Grouped by day */}
                    <div className="w-full md:w-5/12">
                        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                <span className="h-5 w-1 rounded bg-blue-600" />
                                {currentStatus
                                    ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
                                    : 'All Orders'}
                            </h2>
                            {(dateRange.startDate || dateRange.endDate) && (
                                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                    Showing orders from{' '}
                                    {dateRange.startDate ? new Date(dateRange.startDate).toLocaleDateString() : 'the beginning'} to{' '}
                                    {dateRange.endDate ? new Date(dateRange.endDate).toLocaleDateString() : 'now'}
                                </p>
                            )}
                        </div>

                        <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                            <div className="flex flex-col gap-3">
                                {groupedOrders.map(({ day, orders }, groupIdx) => (
                                    <div key={day} className="space-y-2">
                                        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pb-2">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {formatDateDay(orders[0]?.createdAt)}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {orders.length} order{orders.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {orders.map((order, idx) => (
                                                <button
                                                    key={order._id}
                                                    onClick={() => setSelectedId(order._id)}
                                                    className={cn(
                                                        'group relative w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-md',
                                                        selectedId === order._id &&
                                                        'ring-2 ring-blue-500 shadow-lg dark:ring-blue-500'
                                                    )}
                                                    aria-pressed={selectedId === order._id}
                                                    aria-label={`Select order ${order._id.slice(-6).toUpperCase()}`}
                                                    style={{
                                                        animationDelay: `${(groupIdx * 10 + idx) * 50}ms`,
                                                    }}
                                                >
                                                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-blue-500/60 to-indigo-500/60 opacity-70" aria-hidden />

                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                Order #{order._id.slice(-6).toUpperCase()}
                                                            </h3>
                                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                                <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                                {formatDate(order.createdAt)}
                                                            </p>
                                                        </div>
                                                        <Chip variant={getStatusVariant(order.status || 'pending')}>
                                                            {order.status || 'Pending'}
                                                        </Chip>
                                                    </div>

                                                    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                    Customer:
                                                                </span>{' '}
                                                                {order.userName ?? 'N/A'}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                    Store:
                                                                </span>{' '}
                                                                <span
                                                                    className={cn(
                                                                        order.store?.storeName === storeUser.name
                                                                            ? 'font-semibold text-blue-600 dark:text-blue-400'
                                                                            : 'text-gray-900 dark:text-gray-100'
                                                                    )}
                                                                >
                                                                    {order.store?.storeName ?? 'N/A'}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                                ₹{order.totalAmount ?? 0}
                                                            </div>
                                                            <div className="flex items-center justify-end gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                                <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                                {(order.orderDetails?.length ?? 0)} item
                                                                {order.orderDetails?.length !== 1 ? 's' : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-7/12">
                        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                <span className="h-5 w-1 rounded bg-blue-600" />
                                Order Details
                            </h2>
                        </div>

                        {selectedOrder ? (
                            <div className="sticky top-5 animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                                {/* Header */}
                                <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            Order #{selectedOrder._id.slice(-6).toUpperCase()}
                                        </h3>
                                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                            Created: {formatDate(selectedOrder.createdAt)}
                                        </p>
                                    </div>
                                    <Chip variant={getStatusVariant(selectedOrder.status || 'pending')}>
                                        {selectedOrder.status || 'Pending'}
                                    </Chip>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            <User className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            Customer Information
                                        </h4>
                                        <div className="space-y-3">
                                            <InfoRow label="Name" value={selectedOrder.userName} icon={User} />
                                            <InfoRow
                                                label="Phone"
                                                value={selectedOrder.userPhoneNumber}
                                                icon={Phone}
                                            />
                                            <InfoRow
                                                label="Store"
                                                value={selectedOrder.store?.storeName}
                                                highlight={selectedOrder.store?.storeName === storeUser.name}
                                                icon={MapPin}
                                            />
                                            <div>
                                                <InfoRow label="Address" value="" icon={MapPin} />
                                                <p className="ml-6 text-sm text-gray-600 dark:text-gray-400">
                                                    {selectedOrder.houseNo ? `${selectedOrder.houseNo}, ` : ''}
                                                    {selectedOrder.userLocation ?? 'N/A'}
                                                    {selectedOrder.userPincode
                                                        ? `, ${selectedOrder.userPincode}`
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            <IndianRupee className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            Order Summary
                                        </h4>
                                        <div className="space-y-3">
                                            <InfoRow
                                                label="Total Amount"
                                                value={`₹${selectedOrder.totalAmount ?? 0}`}
                                                icon={IndianRupee}
                                            />
                                            <InfoRow
                                                label="Delivery Status"
                                                value={selectedOrder.deliveryStatus}
                                                icon={Truck}
                                            />
                                            {/* Manager removed from new API; conditionally render if present in future */}
                                            {selectedOrder.deliveryPartner && (
                                                <InfoRow
                                                    label="Delivery Partner"
                                                    value={selectedOrder.deliveryPartner.deliveryPartnerName}
                                                    icon={Truck}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Delivery Timeline */}
                                {selectedOrder.customer?.deliveryTimeline && (
                                    <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            <Truck className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            Delivery Timeline
                                        </h4>

                                        <div className="space-y-2">
                                            {Object.entries(selectedOrder.customer.deliveryTimeline).map(
                                                ([key, value]) =>
                                                    value && (
                                                        <InfoRow
                                                            key={key}
                                                            label={key.replace(/([A-Z])/g, ' $1')}
                                                            value={formatDate(value as string)}
                                                        />
                                                    )
                                            )}
                                        </div>
                                    </div>
                                )}


                                {/* Items */}
                                <div className="mt-6 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        Order Items ({selectedOrder.orderDetails?.length ?? 0})
                                    </h4>
                                    {selectedOrder.orderDetails?.length ? (
                                        <div className="mt-3 flex flex-col gap-2">
                                            {selectedOrder.orderDetails.map((item, i) => (
                                                <OrderItemCard key={`${item._id}-${i}`} item={item} index={i} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-6 text-center text-sm italic text-gray-600 dark:text-gray-400">
                                            No items in this order
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-4 text-5xl opacity-50" aria-hidden>
                                    👆
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Select an Order</h3>
                                <p className="mx-auto max-w-sm text-sm text-gray-600 dark:text-gray-400">
                                    Choose an order from the list to view detailed information.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}