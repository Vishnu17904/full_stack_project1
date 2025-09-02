import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User, Mail, Phone, MapPin, Calendar, Package, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const queryParams = new URLSearchParams();
          if (parsedUser.email) queryParams.append("email", parsedUser.email);
          if (parsedUser.phone) queryParams.append("phone", parsedUser.phone);

const API_URL = import.meta.env.VITE_API_URL; // 👈 env variable

const response = await fetch(
  `${API_URL}/api/orders/user-orders?${queryParams.toString()}`
);

if (!response.ok) {
  throw new Error("Failed to fetch orders");
}
          const data = await response.json();
          setOrders(data);
        } catch (err) {
          setError(err.message);
          console.error('Failed to fetch user orders:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  const recentOrders = orders.slice(0, 3); // Since backend sorts by newest first

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {user.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <p className="text-muted-foreground capitalize">{user.userType || 'Customer'}</p>
                </div>
                <Button variant="destructive" className="ml-auto" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-foreground">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-foreground">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="text-foreground">{user.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </label>
                  <p className="text-foreground">{user.address || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </label>
                  <p className="text-foreground">{user.createdAt?.slice(0, 10) || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Error fetching orders.</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your order history will appear here once you make your first purchase.
                    </p>
                  </div>
                ) : (
<ul className="space-y-3">
  {orders.map((order) => (
    <li key={order._id} className="border p-4 rounded-md text-left">
      <p className="font-medium">Order ID: {order._id.slice(-6)}</p>
      <p className="text-sm text-muted-foreground">
        ₹{order.total} • {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <p className="text-sm">Items: {order.items.length}</p>

      {/* ✅ Show item names */}
      <ul className="ml-4 list-disc text-sm text-muted-foreground">
        {order.items.map((item, idx) => (
          <li key={item.productId || `${order._id}-${idx}`}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>

                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error fetching recent orders.</p>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start shopping to see your orders here!
                  </p>
                  <Button onClick={() => navigate('/')}>Browse Products</Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {recentOrders.map((order) => (
                    <li key={order._id} className="border p-4 rounded-md text-left">
                      <p className="font-medium">Order ID: {order._id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{order.total} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Items: {order.items.length}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;