import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package, ShoppingCart, Users, TrendingUp, Eye, Edit, Upload, X } from "lucide-react";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  image: string | null;
  category: string;
  stock?: number;
  isFeatured?: boolean;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  address: String;
}

const mockProducts = [
  { id: "PROD001", name: "Smartphone Pro", price: 1299, stock: 25, category: "Electronics", image: null },
  { id: "PROD002", name: "Wireless Headphones", price: 199, stock: 50, category: "Audio", image: null },
  { id: "PROD003", name: "Smart Watch", price: 399, stock: 15, category: "Wearables", image: null },
  { id: "PROD004", name: "Laptop Stand", price: 89, stock: 100, category: "Accessories", image: null },
];

export default function OwnerDashboard() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStock, setEditingStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    isFeatured: false,
  });
  const [productImage, setProductImage] = useState(null);

  // Fetch products and orders on load
  useEffect(() => {
    fetchProducts();
    fetchOrders();

   const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL; // 👈 use env variable
    const res = await fetch(`${API_URL}/api/orders/recent`);
    if (!res.ok) {
      throw new Error("Failed to fetch recent orders");
    }
    const data = await res.json();
    setOrders(data);
  } catch (err) {
    console.error("Failed to fetch recent orders:", err);
  } finally {
    setLoading(false);
  }
};


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
      // Fallback to mock data if API fails
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    setMessage('');
    setLoading(true);
    
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        image: productImage || '',
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add product');
      }

      const newProductData = await res.json();
      setProducts((prev) => [...prev, newProductData]);
      setMessage('✅ Product added successfully!');
      setNewProduct({ name: "", price: "", description: "", category: "", stock: "", isFeatured: false });
      setProductImage(null);
      setShowAddProduct(false);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, stock: Number(newStock) } : product
    ));
    setEditingStock(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "processing":
        return <Badge className="bg-primary text-primary-foreground">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your store, orders, and products</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+4 new this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,24,500</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Section */}
         <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order._id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>₹{order.total}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      updateOrderStatus(order._id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    {selectedOrder && selectedOrder._id === order._id && (
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Order Details - {order._id}
                          </DialogTitle>
                          <DialogDescription>
                            Complete order information and customer details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">
                                Customer Information
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Name: {order.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Email: {order.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Phone: {order.phone}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Phone: {order.address}
                              </p>                              
                            </div>
                            <div>
                              <h4 className="font-semibold">Order Information</h4>
                              <p className="text-sm text-muted-foreground">
                                Date:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Status: {order.status}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Total: ₹{order.total}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Payment: {order.paymentMethod}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold">Order Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item, index) => (
                                  <TableRow key={item.productId || `${order._id}-${index}`}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>₹{item.price}</TableCell>
                                    <TableCell>
                                      ₹{item.quantity * item.price}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

          {/* Products Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </div>
              <Button 
                onClick={() => setShowAddProduct(!showAddProduct)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              {showAddProduct && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-4">Add New Product</h3>
                  {message && (
                    <div className="mb-4 p-3 rounded-md bg-muted text-sm">
                      {message}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productPrice">Price (₹)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <Select 
                        value={newProduct.category} 
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sweets">Sweets</SelectItem>
                          <SelectItem value="namkeens">Namkeens</SelectItem>
                          <SelectItem value="festival">Festival Special</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productStock">Stock Quantity</Label>
                      <Input
                        id="productStock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="Enter stock quantity"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="productDescription">Description</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="productImage">Product Image</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="productImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                        {productImage && (
                          <div className="relative">
                            <img 
                              src={productImage} 
                              alt="Preview" 
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => setProductImage(null)}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={newProduct.isFeatured}
                          onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                          className="rounded border-input"
                        />
                        <Label htmlFor="isFeatured">Mark as Featured Product</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddProduct} size="sm" disabled={loading}>
                      {loading ? "Adding..." : "Add Product"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddProduct(false)}
                      size="sm"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>
                        {editingStock === product.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              defaultValue={product.stock}
                              className="w-20"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updateProductStock(product.id, (e.target as HTMLInputElement).value);
                                }
                              }}
                              onBlur={(e) => updateProductStock(product.id, (e.target as HTMLInputElement).value)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge variant={product.stock < 20 ? "destructive" : "secondary"}>
                              {product.stock}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingStock(product.id)}
                            >
                              <Edit size={14} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit Product
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}