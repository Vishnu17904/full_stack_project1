import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { User, Store, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onClose: () => void;
}

export const LoginForm = ({ onClose }: LoginFormProps) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'user' | 'owner'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const API_URL = import.meta.env.VITE_API_URL; // 👈 take from .env

  const loginUrl =
    userType === "owner"
      ? `${API_URL}/api/owner/login`
      : `${API_URL}/api/user/login`;

  try {
    const res = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        userType,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    const userData = userType === "owner" ? data.owner : data.user;

    const fullUser = {
      ...userData,
      phone: userData.phone || "",
      address: userData.address || "",
      createdAt: userData.createdAt || new Date().toISOString(),
      role: userType,
    };

    localStorage.setItem("user", JSON.stringify(fullUser));
    alert("Login successful!");

    if (userType === "owner") {
      navigate("/owner-dashboard");
    } else {
      onClose();
    }
  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    alert(err.message);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur-xl border-primary/20 shadow-glow">
        <CardHeader className="text-center">
          <CardTitle className="font-cinzel text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs
            value={userType}
            onValueChange={(value) => setUserType(value as 'user' | 'owner')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="owner" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Owner
              </TabsTrigger>
            </TabsList>

            {/* Common Form */}
            <TabsContent value={userType} className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" className="flex-1">
                    {userType === 'owner' ? 'Owner Sign In' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};



// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { User, Store, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// interface LoginFormProps {
//   onClose: () => void;
// }

// export const LoginForm = ({ onClose }: LoginFormProps) => {
//    const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [userType, setUserType] = useState<'user' | 'owner'>('user');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//  const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   const loginUrl = userType === "owner"
//     ? "http://localhost:5000/api/owner/login"
//     : "http://localhost:5000/api/user/login";

//   try {
//    const res = await fetch(loginUrl, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     email: formData.email,
//     password: formData.password,
//     userType: userType, // ✅ Add this line
//   }),
// });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Login failed");
//     }

//     const fullUser = {
//       ...data.user,
//       phone: data.user.phone || "",
//       address: data.user.address || "",
//       createdAt: data.user.createdAt || new Date().toISOString(),
//     };

//     localStorage.setItem("user", JSON.stringify(fullUser));
//     console.log("✅ Login successful:", fullUser);

//     alert("Login successful!");
//     onClose();
//   } catch (err: any) {
//     console.error("❌ Login error:", err.message);
//     alert(err.message);
//   }
// };



//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md bg-background/95 backdrop-blur-xl border-primary/20 shadow-glow">
//         <CardHeader className="text-center">
//           <CardTitle className="font-cinzel text-2xl bg-gradient-primary bg-clip-text text-transparent">
//             Welcome Back
//           </CardTitle>
//           <CardDescription>
//             Sign in to your account
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <Tabs value={userType} onValueChange={(value) => setUserType(value as 'user' | 'owner')}>
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="user" className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Customer
//               </TabsTrigger>
//               <TabsTrigger value="owner" className="flex items-center gap-2">
//                 <Store className="h-4 w-4" />
//                 Owner
//               </TabsTrigger>
//             </TabsList>

//             {/* User Login */}
//             <TabsContent value="user" className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Enter your password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="pl-10 pr-10"
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-1 top-1 h-8 w-8"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button type="button" variant="outline" onClick={onClose} className="flex-1">
//                     Cancel
//                   </Button>
//                   <Button type="submit" variant="default" className="flex-1">
//                     Sign In
//                   </Button>
//                 </div>
//               </form>
//             </TabsContent>

//             {/* Owner Login */}
//             <TabsContent value="owner" className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="owner-email">Owner Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="owner-email"
//                       name="email"
//                       type="email"
//                       placeholder="Enter owner email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="owner-password">Owner Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="owner-password"
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Enter owner password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="pl-10 pr-10"
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-1 top-1 h-8 w-8"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button type="button" variant="outline" onClick={onClose} className="flex-1">
//                     Cancel
//                   </Button>
//                   <Button type="submit" variant="premium" className="flex-1">
//                     Owner Sign In
//                   </Button>
//                 </div>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };





// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { User, Store, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// interface LoginFormProps {
//   onClose: () => void;
// }

// export const LoginForm = ({ onClose }: LoginFormProps) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [userType, setUserType] = useState<'user' | 'owner'>('user');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(formData)
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Login failed");
//     }

//     console.log("✅ Login successful:", data);
//     // You can store token or user data in localStorage here if needed
//     onClose();
//   } catch (err: any) {
//     console.error("❌ Login error:", err.message);
//     alert(err.message);
//   }
// };


//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md bg-background/95 backdrop-blur-xl border-primary/20 shadow-glow">
//         <CardHeader className="text-center">
//           <CardTitle className="font-cinzel text-2xl bg-gradient-primary bg-clip-text text-transparent">
//             Welcome Back
//           </CardTitle>
//           <CardDescription>
//             Sign in to your account
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent className="space-y-6">
//           <Tabs value={userType} onValueChange={(value) => setUserType(value as 'user' | 'owner')}>
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="user" className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Customer
//               </TabsTrigger>
//               <TabsTrigger value="owner" className="flex items-center gap-2">
//                 <Store className="h-4 w-4" />
//                 Owner
//               </TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="user" className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Enter your password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="pl-10 pr-10"
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-1 top-1 h-8 w-8"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>
                
//                 <div className="flex gap-3 pt-4">
//                   <Button type="button" variant="outline" onClick={onClose} className="flex-1">
//                     Cancel
//                   </Button>
//                   <Button type="submit" variant="default" className="flex-1">
//                     Sign In
//                   </Button>
//                 </div>
//               </form>
//             </TabsContent>
            
//             <TabsContent value="owner" className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="owner-email">Owner Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="owner-email"
//                       name="email"
//                       type="email"
//                       placeholder="Enter owner email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="owner-password">Owner Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="owner-password"
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Enter owner password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="pl-10 pr-10"
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-1 top-1 h-8 w-8"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>
                
//                 <div className="flex gap-3 pt-4">
//                   <Button type="button" variant="outline" onClick={onClose} className="flex-1">
//                     Cancel
//                   </Button>
//                   <Button type="submit" variant="premium" className="flex-1">
//                     Owner Sign In
//                   </Button>
//                 </div>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };