import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CreditCardIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/orders/my-orders");

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "paid":
        return <CreditCardIcon className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "cancelled":
      case "expired":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openOrderDetails = (order) => {
    console.log("Opening order:", order); // Debug log
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeOrderDetails = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedOrder(null);
    }, 300);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeOrderDetails();
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto"; // Re-enable scrolling
    };
  }, [showModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardDocumentListIcon className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">
            View and manage all your service orders
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "paid", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} Orders
                {status !== "all" && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
                    {orders.filter((o) => o.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "You haven't placed any orders yet."
                  : `You don't have any ${filter} orders.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ORDER-{order._id?.slice(-8)?.toUpperCase() || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status?.charAt(0)?.toUpperCase() +
                              order.status?.slice(1) || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items?.length || 0} service
                          {order.items?.length !== 1 ? "s" : ""}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items?.[0]?.title || "No items"}
                          {order.items?.length > 1 &&
                            ` +${order.items.length - 1} more`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total || order.amountPaid || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal - SIMPLIFIED FIX */}
        {showModal && selectedOrder && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50 bg-black opacity-40 transition-opacity"
              onClick={closeOrderDetails}
            ></div>

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 h-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                {/* Modal Panel */}
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  {/* Header */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex items-start justify-between">
                      <div className="mt-3 text-left sm:mt-0 sm:ml-4">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                          Order Details: ORDER-
                          {selectedOrder._id?.slice(-8)?.toUpperCase() || "N/A"}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {formatDate(selectedOrder.createdAt)} •{" "}
                            {selectedOrder.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={closeOrderDetails}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Order Status
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(selectedOrder.status)}
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  selectedOrder.status
                                )}`}
                              >
                                {selectedOrder.status
                                  ?.charAt(0)
                                  ?.toUpperCase() +
                                  selectedOrder.status?.slice(1) || "Unknown"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Total Amount
                            </p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {formatCurrency(
                                selectedOrder.total ||
                                  selectedOrder.amountPaid ||
                                  0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Customer Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-sm font-medium text-gray-900">
                                {selectedOrder.email}
                              </p>
                            </div>
                            {selectedOrder.shippingInfo?.phone && (
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {selectedOrder.shippingInfo.phone}
                                </p>
                              </div>
                            )}
                          </div>
                          {selectedOrder.shippingInfo?.address && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-500">
                                Shipping Address
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {selectedOrder.shippingInfo.address}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Services Purchased */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Services Purchased
                        </h4>
                        <div className="space-y-3">
                          {selectedOrder.items?.map((item, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {item.title || "Unknown Item"}
                                  </h5>
                                  {item.useCase && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {item.useCase}
                                    </p>
                                  )}
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-500">
                                      {item.quantity || 1} ×{" "}
                                      {formatCurrency(item.price || 0)}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(
                                      (item.price || 0) * (item.quantity || 1)
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Payment Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">
                                Payment Method
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                  Stripe
                                </span>
                              </div>
                            </div>
                            {selectedOrder.paidAt && (
                              <div>
                                <p className="text-xs text-gray-500">Paid On</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDate(selectedOrder.paidAt)}
                                </p>
                              </div>
                            )}
                          </div>
                          {selectedOrder.stripe?.paymentIntentId && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-500">
                                Transaction ID
                              </p>
                              <p className="text-sm font-mono text-gray-900 break-all">
                                {selectedOrder.stripe.paymentIntentId}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Amount Breakdown */}
                      {(selectedOrder.subtotal || selectedOrder.tax) && (
                        <div className="border-t border-gray-200 pt-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-lg font-semibold pt-2">
                              <span>Total</span>
                              <span>
                                {formatCurrency(
                                  selectedOrder.total ||
                                    selectedOrder.amountPaid ||
                                    0
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:ml-3 sm:w-auto"
                      onClick={closeOrderDetails}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
