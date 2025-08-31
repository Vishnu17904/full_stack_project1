import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import { CartPage } from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { Products } from "./components/products";
import OwnerDashboard from "./pages/OwnerDashboard";

const queryClient = new QueryClient();

// ✅ Define routes
const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/products", element: <Products /> },
  { path: "/owner-dashboard", element: <OwnerDashboard /> },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
           // v7_relativeSplatPath: true,
          }}
        />
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;












// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { CartProvider } from "@/contexts/CartContext";
// import Index from "./pages/Index";
// import { CartPage } from "./pages/CartPage";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <CartProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/cart" element={<CartPage />} />
//             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </CartProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
