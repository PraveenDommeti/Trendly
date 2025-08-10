
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, MapPin, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoPaymentModal from "../components/CryptoPaymentModal";
import { useSupabaseTrendly } from "../context/SupabaseTrendlyContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useSupabaseTrendly();
  const [address, setAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'crypto') {
      setShowCryptoPayment(true);
      return;
    }

    // Simulate successful order
    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully.",
    });
    
    clearCart();
    navigate("/");
  };

  const handleCryptoPaymentComplete = (txHash: string) => {
    toast({
      title: "Payment Successful!",
      description: `Transaction completed: ${txHash.slice(0, 10)}...`,
    });
    
    clearCart();
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div>
        <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>

        <div className="flex flex-col items-center justify-center p-8 h-80 text-center">
          <CreditCard size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button 
            onClick={() => navigate("/shop")} 
            className="bg-trendly-primary hover:bg-trendly-dark"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <ScrollArea className="flex-1 p-4 pb-24">
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            {cart.map((item) => (
              <motion.div 
                key={item.id} 
                className="flex items-center mb-4 last:mb-0"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={item.image_url || ''} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </motion.div>
            ))}
            
            <div className="border-t mt-4 pt-4 flex justify-between">
              <p className="font-bold">Total</p>
              <p className="font-bold text-trendly-primary">₹{totalAmount}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Delivery Options</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div 
                className={`p-4 border-b flex items-center ${deliveryOption === 'standard' ? 'bg-gray-50' : ''}`}
                onClick={() => setDeliveryOption('standard')}
              >
                <div className={`w-4 h-4 rounded-full border ${deliveryOption === 'standard' ? 'border-2 border-trendly-primary' : 'border-gray-300'}`}>
                  {deliveryOption === 'standard' && <div className="w-2 h-2 m-[2px] rounded-full bg-trendly-primary"></div>}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-sm text-gray-500">3-5 business days</p>
                </div>
                <p className="font-semibold text-trendly-primary">Free</p>
              </div>
              
              <div 
                className={`p-4 flex items-center ${deliveryOption === 'express' ? 'bg-gray-50' : ''}`}
                onClick={() => setDeliveryOption('express')}
              >
                <div className={`w-4 h-4 rounded-full border ${deliveryOption === 'express' ? 'border-2 border-trendly-primary' : 'border-gray-300'}`}>
                  {deliveryOption === 'express' && <div className="w-2 h-2 m-[2px] rounded-full bg-trendly-primary"></div>}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium">Express Delivery</p>
                  <p className="text-sm text-gray-500">1-2 business days</p>
                </div>
                <p className="font-semibold">₹99</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin size={18} className="mr-2" />
              Delivery Address
            </h2>
            <Input
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Landmark (optional)"
              className="mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" />
              <Input placeholder="Pincode" />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <CreditCard size={18} className="mr-2" />
              Payment Method
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-3">
                <div 
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'card' 
                      ? 'border-trendly-primary bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === 'card' ? 'border-trendly-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 m-[2px] rounded-full bg-trendly-primary"></div>}
                      </div>
                      <div className="ml-3 flex items-center">
                        <CreditCard size={16} className="mr-2" />
                        <span>Credit/Debit Card</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">**** **** **** 4455</span>
                  </div>
                </div>

                <div 
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'crypto' 
                      ? 'border-trendly-primary bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === 'crypto' ? 'border-trendly-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'crypto' && <div className="w-2 h-2 m-[2px] rounded-full bg-trendly-primary"></div>}
                      </div>
                      <div className="ml-3 flex items-center">
                        <Zap size={16} className="mr-2 text-purple-600" />
                        <span>Crypto Payment (HBAR)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-green-600 font-medium">Instant</span>
                      <p className="text-xs text-gray-500">Low fees</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery</span>
                  <span>{deliveryOption === 'standard' ? 'Free' : '₹99'}</span>
                </div>
                <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                  <span>Total</span>
                  <span className="text-trendly-primary">
                    ₹{deliveryOption === 'standard' ? totalAmount : totalAmount + 99}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handlePlaceOrder}
            className="w-full bg-trendly-primary hover:bg-trendly-dark mb-8"
          >
            {paymentMethod === 'crypto' ? 'Pay with Crypto' : 'Place Order'}
          </Button>
        </div>
      </ScrollArea>

      {/* Crypto Payment Modal */}
      <CryptoPaymentModal
        isOpen={showCryptoPayment}
        onClose={() => setShowCryptoPayment(false)}
        amount={deliveryOption === 'standard' ? totalAmount : totalAmount + 99}
        onPaymentComplete={handleCryptoPaymentComplete}
      />
    </div>
  );
};

export default CheckoutPage;
