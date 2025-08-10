
import { useState } from "react";
import { Camera, User, Calendar, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileSetupSuggestionProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: (data: { avatar_url: string; username: string; date_of_birth: string }) => void;
}

const ProfileSetupSuggestion = ({ isVisible, onClose, onComplete }: ProfileSetupSuggestionProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    avatar_url: "",
    username: "",
    date_of_birth: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
      toast({
        title: "Profile Setup Complete!",
        description: "Welcome to Trendly! Start exploring and posting your outfits.",
      });
    }
  };

  const handleSkip = () => {
    onClose();
    toast({
      title: "Profile Setup Skipped",
      description: "You can update your profile anytime from the profile section.",
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.avatar_url.trim() !== "";
      case 2:
        return formData.username.trim() !== "" && formData.username.length >= 3;
      case 3:
        return formData.date_of_birth !== "";
      default:
        return false;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-between items-center">
                <div className="flex-1" />
                <CardTitle className="text-xl">Complete Your Profile</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleSkip} className="flex-shrink-0">
                  <X size={20} />
                </Button>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`w-3 h-3 rounded-full ${
                      stepNumber <= step ? 'bg-trendly-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Camera size={48} className="mx-auto mb-2 text-trendly-primary" />
                        <h3 className="text-lg font-semibold">Add Your Profile Picture</h3>
                        <p className="text-sm text-gray-600">Let others recognize you!</p>
                      </div>
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={formData.avatar_url} alt="Profile" />
                          <AvatarFallback>
                            <Camera size={24} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                          <Label htmlFor="avatar_url">Profile Picture URL</Label>
                          <Input
                            id="avatar_url"
                            placeholder="Paste image URL here..."
                            value={formData.avatar_url}
                            onChange={(e) => handleInputChange("avatar_url", e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Tip: Right-click any image online and select "Copy image address"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <User size={48} className="mx-auto mb-2 text-trendly-primary" />
                        <h3 className="text-lg font-semibold">Choose Your Username</h3>
                        <p className="text-sm text-gray-600">This is how others will find you</p>
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Enter a unique username..."
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Must be at least 3 characters long
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Calendar size={48} className="mx-auto mb-2 text-trendly-primary" />
                        <h3 className="text-lg font-semibold">When's Your Birthday?</h3>
                        <p className="text-sm text-gray-600">We'll help you celebrate!</p>
                      </div>
                      <div>
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1 mr-2"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1 ml-2"
                >
                  {step === 3 ? (
                    <>
                      <Check size={16} className="mr-2" />
                      Complete
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileSetupSuggestion;
