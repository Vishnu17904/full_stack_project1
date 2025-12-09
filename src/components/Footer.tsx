import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export const Footer = () => {
     const navigate = useNavigate();     // ✅ Use inside the component
     const location = useLocation();

  const contactInfo = [
    { icon: MapPin, text: 'Vinayak misthan Bhandar Near Bus Stand Nimbi Jodha, Rajasthan' },
   { icon: Phone, text: "+91 9001007160", href: "tel:+919001007160"},
    { icon: Mail, text: 'info@vinayaksweets.com' },
    { icon: Clock, text: 'Open: 6:00 AM - 10:00 PM' }
  ];

  const quickLinks = ['Home', 'Products', 'About Us', 'Contact', 'Order Online'];
  const categories = ['Traditional Sweets', 'Namkeens & Snacks', 'Festival Specials', 'Gift Boxes', 'Seasonal Items'];
const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/16vC23YqV4/",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/vinayak_misthan_namkeen_2002?igsh=MXRsa2cxZGZvazhjNQ==",
    label: "Instagram",
  },
  {
    icon: Twitter,
    href: "https://twitter.com", 
    label: "Twitter",
  },
  {
    icon: MessageCircle,
    href: "https://wa.me/919001007160?text=Hello%20I%20want%20to%20place%20an%20order",
    label: "WhatsApp",
    external: true, //  rendering logic
  },
];


  return (
    <footer id="contact" className="relative bg-gradient-to-b from-background to-primary/10 border-t border-primary/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="font-cinzel text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3 group">
                    <IconComponent className="h-5 w-5 text-primary mt-1 group-hover:scale-110 transition-transform" />
                    <span className="text-foreground/70 group-hover:text-foreground transition-colors">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-cinzel text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Quick Links
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  className="block text-foreground/70 hover:text-primary transition-colors text-left"
                 onClick={() => {
                   const sectionId = link.toLowerCase().replace(/\s/g, '');

                  if (location.pathname !== '/') {
                 navigate('/', { state: { scrollTo: sectionId } });
                   } else {
                    const element = document.getElementById(sectionId);
                    if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                       }
                     }
                  }}

                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="font-cinzel text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Categories
            </h3>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="text-foreground/70 hover:text-primary transition-colors cursor-pointer">
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h3 className="font-cinzel text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Follow Us
            </h3>
            <p className="text-foreground/70 leading-relaxed">
              Stay connected for updates, special offers, and new product launches.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-card rounded-3xl p-8 mb-12 border border-primary/20 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-cinzel text-2xl font-bold text-foreground mb-4">
              Stay Sweet with Our Newsletter
            </h3>
            <p className="text-foreground/70 mb-6">
              Get exclusive offers, new product announcements, and sweet recipes delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-background/50 border border-primary/30 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="premium" className="px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/20 text-center">
          <p className="text-foreground/60">
            &copy; 2025 Vishnu_Prajapat. All rights reserved. Made with ❤️ for sweet lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};