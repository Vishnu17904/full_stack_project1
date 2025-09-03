import { useEffect, useMemo, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Package, ShoppingCart, Users, TrendingUp, Eye, Edit, X, Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  category: string;
  stock?: number;
  isFeatured?: boolean;
};

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  paymentMethod: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  items: OrderItem[];
};

// ---------- helpers ----------
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const api = (path: string) => `${API_BASE}${path}`; // dev: "" + /api/... (vite proxy), prod: https://.../api/...

async function readJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text || null;
  }
}

export default function OwnerDashboard() {
  const { toast } = useToast();

  // ui state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // add product form
  const [form, setForm] = useState<{
    name: string;
    price: string;
    description: string;
    category: string;
    stock: string;
    isFeatured: boolean;
    image: string | null;
  }>({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    isFeatured: false,
    image: null,
  });

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = new Set(orders.map((o) => o.email)).size;
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    return { totalOrders, totalProducts, totalCustomers, revenue };
  }, [orders, products]);

  // -------- fetchers --------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(api("/api/products"));
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error((data && (data.error || data.message)) || "Failed to fetch products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to fetch products", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(api("/api/orders/recent"));
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error((data && (data.error || data.message)) || "Failed to fetch orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      // keep UI calm; show a subtle toast only if products also failed
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    const t = setInterval(fetchOrders, 15000);
    return () => clearInterval(t);
  }, []);

  // -------- actions --------
  const onImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((s) => ({ ...s, image: String(ev.target?.result || "") }));
    reader.readAsDataURL(f);
  };

  const addProduct = async () => {
    setMessage("");
    setSaving(true);
    try {
      if (!form.name || !form.price || !form.category) {
        throw new Error("Name, price and category are required.");
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        stock: form.stock ? Number(form.stock) : 0,
        image: form.image || "",
        isFeatured: !!form.isFeatured,
      };

      const res = await fetch(api("/api/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error((data && (data.error || data.message)) || "Failed to add product");

      // your backend returns { message, product } — handle both shapes safely
      const created: Product = (data && (data.product ?? data)) as Product;
      setProducts((prev) => [...prev, created]);

      setMessage("✅ Product added successfully!");
      toast({ title: "Product added", description: `${payload.name} has been created.` });
      setForm({ name: "", price: "", description: "", category: "", stock: "", isFeatured: false, image: null });
      setShowAdd(false);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
      toast({ title: "Add product failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const changeOrderStatusLocal = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    // TODO: If you later add an API to persist status, call it here.
  };

  const updateStockInline = (id: string, next: number) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id || p.id === id ? { ...p, stock: next } : p)),
    );
    setEditingStock(null);
    // TODO: Optional: persist stock with PATCH /api/products/:id
  };

  // ---------- UI ----------
  const productKey = (p: Product) => p._id || p.id || `${p.name}-${Math.random()}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
              Owner Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground">Manage your store, orders, and products.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Live in last updates</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">In catalog</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Unique emails</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All-time (loaded)</p>
            </CardContent>
          </Card>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders and statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.name}</TableCell>
                        <TableCell>₹{order.total}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v: Order["status"]) => changeOrderStatusLocal(order._id, v)}
                          >
                            <SelectTrigger className="w-36">
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
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            {selectedOrder && selectedOrder._id === order._id && (
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Order {order._id}</DialogTitle>
                                  <DialogDescription>Placed on {new Date(order.createdAt).toLocaleString()}</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Customer</h4>
                                    <p className="text-sm text-muted-foreground">Name: {order.name}</p>
                                    <p className="text-sm text-muted-foreground">Email: {order.email}</p>
                                    <p className="text-sm text-muted-foreground">Phone: {order.phone}</p>
                                    {order.address && (
                                      <p className="text-sm text-muted-foreground">Address: {order.address}</p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Summary</h4>
                                    <p className="text-sm text-muted-foreground">Payment: {order.paymentMethod}</p>
                                    <p className="text-sm text-muted-foreground">Status: {order.status}</p>
                                    <p className="text-sm text-muted-foreground">Total: ₹{order.total}</p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <h4 className="font-semibold mb-2">Items</h4>
                                  <div className="rounded-md border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Product</TableHead>
                                          <TableHead>Qty</TableHead>
                                          <TableHead>Price</TableHead>
                                          <TableHead>Total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {order.items.map((it, i) => (
                                          <TableRow key={`${order._id}-${i}`}>
                                            <TableCell>{it.name}</TableCell>
                                            <TableCell>{it.quantity}</TableCell>
                                            <TableCell>₹{it.price}</TableCell>
                                            <TableCell>₹{it.price * it.quantity}</TableCell>
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
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          {loading ? "Loading orders..." : "No orders yet"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your inventory</CardDescription>
              </div>
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Fill the details and save.</DialogDescription>
                  </DialogHeader>

                  {message && (
                    <div className="rounded-md border text-sm p-3">{message}</div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="pname">Name *</Label>
                      <Input
                        id="pname"
                        value={form.name}
                        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                        placeholder="e.g. Kaju Katli"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pprice">Price (₹) *</Label>
                      <Input
                        id="pprice"
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                        placeholder="e.g. 299"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pcat">Category *</Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => setForm((s) => ({ ...s, category: v }))}
                      >
                        <SelectTrigger id="pcat">
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
                    <div className="space-y-2">
                      <Label htmlFor="pstock">Stock</Label>
                      <Input
                        id="pstock"
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))}
                        placeholder="e.g. 25"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="pfeatured">Featured</Label>
                        <div className="flex items-center gap-2">
                          <input
                              id="pfeatured"
                                type="checkbox"
                                  checked={form.isFeatured}
                                  onChange={(e) => setForm((s) => ({ ...s, isFeatured: e.target.checked }))}
                                className="h-4 w-4"
                                   />
                              <span className="text-sm text-muted-foreground">Show this product in Featured section</span>
                                 </div>
                              </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="pdesc">Description</Label>
                      <Textarea
                        id="pdesc"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                        placeholder="Short product description"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>Image</Label>
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 text-sm hover:bg-muted/60">
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                          <input type="file" accept="image/*" className="hidden" onChange={onImagePick} />
                        </label>
                        {form.image && (
                          <div className="relative">
                            <img
                              src={form.image}
                              alt="preview"
                              className="h-16 w-16 rounded-md object-cover border"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => setForm((s) => ({ ...s, image: null }))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                    <Button onClick={addProduct} disabled={saving}>
                      {saving ? "Saving..." : "Save Product"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-24">Price</TableHead>
                      <TableHead className="w-40">Stock</TableHead>
                      <TableHead className="w-40">Category</TableHead>
                      <TableHead className="text-right w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => {
                      const id = (p._id || p.id)!;
                      return (
                        <TableRow key={productKey(p)}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="h-10 w-10 rounded object-cover border"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded bg-muted border grid place-items-center text-xs text-muted-foreground">
                                  IMG
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="truncate">{p.name}</div>
                                {p.isFeatured && (
                                  <span className="text-xs text-primary">Featured</span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>₹{Number(p.price).toLocaleString()}</TableCell>

                          <TableCell>
                            {editingStock === id ? (
                              <Input
                                type="number"
                                defaultValue={p.stock ?? 0}
                                className="w-24"
                                autoFocus
                                onBlur={(e) => updateStockInline(id, Number((e.target as HTMLInputElement).value))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const val = Number((e.target as HTMLInputElement).value);
                                    updateStockInline(id, val);
                                  }
                                }}
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <Badge variant={(p.stock ?? 0) < 20 ? "destructive" : "secondary"}>
                                  {p.stock ?? 0}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingStock(id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="capitalize">{p.category}</TableCell>

                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          {loading ? "Loading products..." : "No products"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}








