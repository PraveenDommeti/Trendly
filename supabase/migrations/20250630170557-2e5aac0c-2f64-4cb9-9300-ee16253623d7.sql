
-- Add new fashion products to the database with correct categories
INSERT INTO public.products (name, description, price, image_url, category, brand, is_internal, commission_rate, stock_quantity, is_active) VALUES
-- Men's Clothing
('Classic Black Formal Pants', 'Premium quality formal pants perfect for office wear and formal occasions. Made with comfortable fabric blend for all-day comfort.', 2899, '/lovable-uploads/c9e4f7ef-54b3-4eb9-899b-b1ff80a9b35b.png', 'bottoms', 'StyleCraft', true, 15, 50, true),

('Street Style Graphic Tee', 'Bold graphic t-shirt with "BUILT STRONG" print. Perfect for casual outings and streetwear enthusiasts.', 1299, '/lovable-uploads/8e2512b4-d6b6-4843-9623-5e79adb08f5a.png', 'tops', 'UrbanWear', true, 20, 75, true),

('Premium Blue Formal Shirt', 'Elegant blue formal shirt with fine texture. Perfect for business meetings and formal events.', 2199, '/lovable-uploads/9376126d-6d65-4960-a919-8a37905266d3.png', 'tops', 'Executive', true, 18, 40, true),

('Casual Olive Green T-Shirt', 'Comfortable cotton t-shirt in trendy olive green color. Essential for casual wardrobe.', 899, '/lovable-uploads/4897dcf1-7261-4188-8752-6c5a29a8c730.png', 'tops', 'BasicWear', true, 12, 100, true),

('Beige Linen Casual Shirt', 'Breathable linen shirt in classic beige. Perfect for summer and casual occasions.', 1799, '/lovable-uploads/78e54ebd-6f32-46ca-9ca1-cfbf9d264e89.png', 'tops', 'LinenCraft', true, 16, 60, true),

('Sky Blue Casual Shirt', 'Light and comfortable casual shirt in sky blue. Great for everyday wear.', 1599, '/lovable-uploads/be64d2c8-96c3-4b7a-87af-e5ed31a1e364.png', 'tops', 'CasualFit', true, 14, 80, true),

('White Cotton Casual Shirt', 'Classic white cotton shirt with comfortable fit. Versatile piece for any wardrobe.', 1399, '/lovable-uploads/982eb17b-98b3-4333-89c9-ace5bdf53dd8.png', 'tops', 'CottonCraft', true, 13, 90, true),

-- Women's Clothing (using 'tops' category instead of 'ethnic')
('Elegant Green Anarkali Suit', 'Beautiful green Anarkali suit with intricate embroidery and dupatta. Perfect for festivals and special occasions.', 4599, '/lovable-uploads/a76d9357-b80f-41ae-be3d-d25416b0a79d.png', 'tops', 'EthnicElegance', true, 25, 25, true),

('Pink Embellished Lehenga', 'Stunning pink lehenga with golden embroidery and beadwork. Ideal for weddings and celebrations.', 8999, '/lovable-uploads/1fe6e38d-66b5-478d-922e-9a88094453e8.png', 'tops', 'BridalCollection', true, 30, 15, true);
