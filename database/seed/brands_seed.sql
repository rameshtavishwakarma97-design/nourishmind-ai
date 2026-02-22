-- ============================================
-- Indian Brands Seed Data — Top 50 Packaged Products
-- Values per 100g unless noted
-- ============================================

INSERT INTO public.indian_brands (brand_name, product_name, variant, pack_size_g, price_inr, per_100g_calories, per_100g_protein, per_100g_carbs, per_100g_fat, per_100g_fiber, per_100g_sodium_mg, serving_size_g, serving_size_display, is_verified)
VALUES
-- PROTEIN SUPPLEMENTS
('Myprotein', 'Impact Whey Protein', 'Chocolate Smooth', 1000, 2499, 387, 72.0, 11.0, 7.5, 1.0, 130, 30, '1 scoop (30g)', true),
('MuscleBlaze', 'Biozyme Whey Protein', 'Rich Chocolate', 1000, 2999, 370, 75.0, 9.0, 5.0, 0.5, 150, 33, '1 scoop (33g)', true),
('Optimum Nutrition', 'Gold Standard Whey', 'Double Rich Chocolate', 907, 3799, 375, 79.3, 10.3, 3.4, 0, 220, 29, '1 scoop (29g)', true),
('Nakpro', 'Perform Whey Protein', 'Mango', 1000, 1599, 380, 70.0, 16.0, 4.0, 0.5, 120, 30, '1 scoop (30g)', true),

-- DAIRY
('Amul', 'Gold Milk', 'Full Cream', 500, 32, 62, 3.2, 4.7, 3.5, 0, 44, 200, '1 glass (200ml)', true),
('Amul', 'Taaza Milk', 'Toned', 500, 27, 50, 3.0, 4.8, 1.5, 0, 40, 200, '1 glass (200ml)', true),
('Amul', 'Masti Dahi', 'Plain', 400, 48, 60, 3.1, 4.7, 3.1, 0, 40, 100, '100g', true),
('Amul', 'Cheese Slices', 'Plain', 100, 79, 289, 20.0, 4.0, 22.0, 0, 1200, 20, '1 slice (20g)', true),
('Mother Dairy', 'Classic Curd', 'Plain', 400, 44, 62, 3.4, 4.5, 3.0, 0, 42, 100, '100g', true),
('Nestle', 'A+ Nourish Dahi', 'Plain', 400, 49, 55, 3.5, 4.3, 2.5, 0, 38, 100, '100g', true),
('Amul', 'Paneer', 'Fresh', 200, 89, 265, 18.3, 1.2, 20.8, 0, 22, 100, '100g (1 block)', true),

-- SNACKS
('Bingo', 'Mad Angles', 'Piri Piri', 26, 10, 530, 6.0, 58.0, 30.0, 2.5, 650, 26, '₹10 pack (26g)', true),
('Bingo', 'Mad Angles', 'Achaari Masti', 26, 10, 520, 5.5, 60.0, 28.0, 2.0, 680, 26, '₹10 pack (26g)', true),
('Lays', 'Classic Salted', 'Original', 52, 20, 541, 6.3, 52.0, 34.0, 4.0, 720, 28, '1 serving (28g)', true),
('Lays', 'Magic Masala', 'Indian', 52, 20, 535, 6.0, 53.0, 33.0, 3.5, 750, 28, '1 serving (28g)', true),
('Kurkure', 'Masala Munch', 'Masala', 45, 10, 540, 6.5, 56.0, 32.0, 2.0, 800, 30, '30g', true),
('Haldirams', 'Aloo Bhujia', 'Namkeen', 200, 65, 571, 12.9, 42.0, 39.0, 4.0, 900, 30, '30g', true),
('Haldirams', 'Moong Dal', 'Namkeen', 200, 60, 460, 22.0, 42.0, 22.0, 6.0, 800, 30, '30g', true),

-- INSTANT NOODLES & READY MEALS
('Maggi', '2-Minute Noodles', 'Masala', 70, 14, 403, 9.0, 56.1, 15.7, 2.8, 900, 70, '1 pack (70g)', true),
('Maggi', 'Atta Noodles', 'Masala', 70, 16, 370, 10.0, 55.0, 12.0, 5.0, 850, 70, '1 pack (70g)', true),
('Yippee', 'Magic Masala', 'Classic', 70, 14, 410, 8.5, 57.0, 16.0, 2.5, 920, 70, '1 pack (70g)', true),
('MTR', 'Ready to Eat Rajma Masala', 'Rajma', 300, 99, 95, 5.0, 12.5, 2.5, 3.5, 400, 300, '1 pack (300g)', true),
('MTR', 'Ready to Eat Dal Fry', 'Dal Fry', 300, 89, 80, 4.0, 10.0, 2.5, 2.0, 380, 300, '1 pack (300g)', true),

-- HEALTH BARS & BREAKFAST
('Yoga Bar', 'Protein Bar', 'Almond Fudge', 60, 149, 350, 33.3, 41.7, 10.0, 5.0, 200, 60, '1 bar (60g)', true),
('RiteBite', 'Max Protein', 'Choco Fudge', 70, 169, 357, 28.6, 42.9, 10.0, 4.0, 230, 70, '1 bar (70g)', true),
('Kelloggs', 'Chocos', 'Chocolate', 385, 215, 390, 6.5, 82.5, 3.5, 3.0, 400, 30, '1 serving (30g)', true),
('Kelloggs', 'Oats', 'Plain', 500, 159, 367, 12.0, 63.0, 7.0, 10.0, 5, 40, '1 serving (40g)', true),
('Saffola', 'Masala Oats', 'Classic Masala', 39, 25, 385, 10.3, 64.1, 10.3, 5.1, 900, 39, '1 pack (39g)', true),

-- BEVERAGES
('Bournvita', 'Health Drink', 'Chocolate', 500, 235, 385, 7.7, 80.0, 2.5, 2.0, 130, 20, '2 tbsp (20g)', true),
('Horlicks', 'Classic Malt', 'Regular', 500, 280, 377, 11.0, 79.5, 2.0, 2.0, 280, 27, '4 tbsp (27g)', true),
('Complan', 'Nutrition Drink', 'Royale Chocolate', 500, 310, 410, 18.0, 60.0, 12.0, 0, 300, 33, '2 scoops (33g)', true),
('Paper Boat', 'Aam Panna', 'Traditional', 250, 30, 44, 0, 10.8, 0, 0, 40, 250, '1 bottle (250ml)', true),
('Real', 'Fruit Juice', 'Mango', 1000, 99, 55, 0, 13.5, 0, 0, 10, 200, '1 glass (200ml)', true),

-- BREAD & BAKERY
('Britannia', 'Bread', 'White', 400, 40, 265, 8.0, 50.0, 3.0, 2.5, 500, 28, '1 slice (28g)', true),
('Britannia', 'Bread', 'Whole Wheat', 400, 45, 250, 9.5, 46.0, 3.5, 5.0, 470, 28, '1 slice (28g)', true),
('Britannia', 'Good Day', 'Butter Cookies', 120, 30, 484, 5.0, 65.0, 22.0, 1.5, 300, 25, '3 biscuits (25g)', true),
('Parle', 'Parle-G', 'Glucose Biscuit', 250, 20, 460, 6.0, 72.0, 16.5, 1.0, 350, 23, '4 biscuits (23g)', true),
('Parle', 'Hide & Seek', 'Chocolate Chip', 120, 30, 490, 5.0, 63.0, 24.0, 2.0, 250, 25, '3 biscuits (25g)', true),

-- COOKING ESSENTIALS
('Fortune', 'Refined Soybean Oil', 'Regular', 1000, 149, 884, 0, 0, 100, 0, 0, 10, '1 tbsp (10ml)', true),
('Saffola', 'Gold Oil', 'Blended', 1000, 199, 884, 0, 0, 100, 0, 0, 10, '1 tbsp (10ml)', true),
('Aashirvaad', 'Atta', 'Whole Wheat', 5000, 255, 341, 12.1, 71.2, 1.7, 12.5, 17, 30, '1 chapati dough (30g)', true),
('Aashirvaad', 'Atta', 'Multigrain', 5000, 285, 335, 12.5, 68.0, 2.5, 14.0, 20, 30, '1 chapati dough (30g)', true),

-- SWEETS
('Haldirams', 'Rasgulla', 'Tin', 1000, 199, 186, 4.5, 36.0, 2.5, 0, 30, 40, '1 piece (40g)', true),
('Amul', 'Dark Chocolate', '55% Cocoa', 150, 130, 524, 7.0, 52.0, 32.0, 6.0, 20, 30, '1 row (30g)', true),
('Britannia', 'Treat Croissant', 'Chocolate', 45, 30, 420, 7.0, 48.0, 22.0, 1.5, 350, 45, '1 croissant (45g)', true);
