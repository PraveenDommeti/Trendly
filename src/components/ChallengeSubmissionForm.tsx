
import { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { useChallenges } from "../context/ChallengesContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface ChallengeSubmissionFormProps {
  challengeId: string;
  onClose: () => void;
}

const ChallengeSubmissionForm = ({ challengeId, onClose }: ChallengeSubmissionFormProps) => {
  const { submitToChallenge } = useChallenges();
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock image URLs for this demo
  const mockImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1721322800607-8c38375eef04?q=80&w=600&auto=format&fit=crop"
  ];

  const handleSubmit = () => {
    if (!selectedImage) {
      toast({
        title: "Missing image",
        description: "Please select or upload an image for your submission",
        variant: "destructive",
      });
      return;
    }

    if (!caption) {
      toast({
        title: "Missing caption",
        description: "Please add a caption to your submission",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      submitToChallenge(challengeId, selectedImage, caption);
      
      toast({
        title: "Submission successful!",
        description: "Your entry has been submitted to the challenge",
      });
      
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  // For a real app, this would handle file uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    // In a real app, we would handle file upload here
    // For this demo, we'll just randomly select one of our mock images
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setSelectedImage(randomImage);
    
    toast({
      title: "Image uploaded",
      description: "Your image has been successfully uploaded",
    });
  };

  return (
    <div className="space-y-4 pt-2">
      {!selectedImage ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Camera size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-4">Upload a photo of your outfit</p>
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Upload size={16} />
                Choose Image
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <div className="relative">
          <motion.img
            src={selectedImage}
            alt="Challenge submission"
            className="w-full aspect-square object-cover rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-white/80"
            onClick={() => setSelectedImage(null)}
          >
            Change
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="caption" className="block text-sm font-medium">
          Caption
        </label>
        <Textarea
          id="caption"
          placeholder="Describe your style challenge entry..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-trendly-primary hover:bg-trendly-dark"
          disabled={isLoading || !selectedImage}
        >
          {isLoading ? "Submitting..." : "Submit Entry"}
        </Button>
      </div>
    </div>
  );
};

export default ChallengeSubmissionForm;
