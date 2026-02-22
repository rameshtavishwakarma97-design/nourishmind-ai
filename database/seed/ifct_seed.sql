-- ============================================
-- IFCT 2017 Seed Data — Top 120 Indian Foods
-- Source: Indian Food Composition Tables (NIN, Hyderabad)
-- Values per 100g edible portion
-- ============================================

-- CEREALS & GRAINS
INSERT INTO public.ifct_foods (id, food_name, food_name_hindi, food_group, region, cooking_state, per_100g_calories, per_100g_protein, per_100g_carbs, per_100g_fat, per_100g_fiber, per_100g_iron_mg, per_100g_calcium_mg, per_100g_magnesium_mg, per_100g_potassium_mg, per_100g_sodium_mg, per_100g_vitamin_b12_mcg, per_100g_vitamin_d_iu, per_100g_zinc_mg, per_100g_folate_mcg, glycemic_index)
VALUES
('IFCT001', 'Rice, white, cooked', 'Chawal', 'Cereals', 'All India', 'cooked', 130, 2.7, 28.2, 0.3, 0.4, 0.2, 10, 12, 35, 5, 0, 0, 0.49, 8, 73),
('IFCT002', 'Rice, brown, cooked', 'Brown chawal', 'Cereals', 'All India', 'cooked', 123, 2.7, 25.6, 0.97, 1.8, 0.53, 33, 39, 86, 4, 0, 0, 0.62, 9, 68),
('IFCT003', 'Wheat flour, whole', 'Atta', 'Cereals', 'All India', 'raw', 341, 12.1, 71.2, 1.7, 12.5, 4.9, 48, 138, 363, 17, 0, 0, 2.85, 36.6, 62),
('IFCT004', 'Chapati (wheat)', 'Roti', 'Cereals', 'All India', 'cooked', 297, 10.6, 49.9, 7.5, 3.4, 3.27, 30, 70, 140, 24, 0, 0, 1.5, 20, 62),
('IFCT005', 'Paratha (wheat, plain)', 'Paratha', 'Cereals', 'North India', 'cooked', 326, 8.3, 44.3, 13.5, 2.1, 2.6, 28, 55, 120, 32, 0, 0, 1.2, 15, 62),
('IFCT006', 'Poha (flattened rice)', 'Poha', 'Cereals', 'All India', 'raw', 346, 6.6, 77.3, 1.2, 0.7, 20, 20, 50, 113, 3, 0, 0, 0.7, 10, 64),
('IFCT007', 'Oats, rolled', 'Oats', 'Cereals', 'Imported', 'raw', 389, 16.9, 66.3, 6.9, 10.6, 4.72, 54, 177, 429, 2, 0, 0, 3.97, 56, 55),
('IFCT008', 'Ragi (finger millet)', 'Ragi', 'Cereals', 'South India', 'raw', 328, 7.3, 72, 1.3, 11.5, 3.9, 344, 137, 408, 11, 0, 0, 2.3, 18.3, 104),
('IFCT009', 'Jowar (sorghum)', 'Jowar', 'Cereals', 'West India', 'raw', 349, 10.4, 72.6, 1.9, 9.7, 4.1, 25, 171, 350, 7, 0, 0, 1.6, 20, 62),
('IFCT010', 'Bajra (pearl millet)', 'Bajra', 'Cereals', 'North India', 'raw', 361, 11.6, 67.5, 5, 11.3, 8, 42, 124, 307, 10.9, 0, 0, 3.1, 45.5, 54),
('IFCT011', 'Maida (refined flour)', 'Maida', 'Cereals', 'All India', 'raw', 348, 11.0, 73.9, 0.9, 2.7, 2.7, 23, 30, 140, 3, 0, 0, 0.7, 25, 71),
('IFCT012', 'Semolina (suji/rava)', 'Suji', 'Cereals', 'All India', 'raw', 334, 10.3, 72.8, 0.8, 3.9, 4.0, 17, 47, 186, 1, 0, 0, 1.05, 72, 66),
('IFCT013', 'Bread, white', 'Bread', 'Cereals', 'All India', 'cooked', 265, 9.0, 49.0, 3.2, 2.7, 3.3, 151, 25, 100, 491, 0, 0, 0.8, 30, 75),
('IFCT014', 'Dosa batter (rice+urad)', 'Dosa', 'Cereals', 'South India', 'cooked', 168, 3.9, 25.9, 5.2, 0.8, 0.9, 16, 28, 80, 120, 0, 0, 0.6, 12, 77),
('IFCT015', 'Idli (steamed)', 'Idli', 'Cereals', 'South India', 'cooked', 153, 4.3, 26.5, 3.0, 0.9, 0.8, 18, 25, 75, 130, 0, 0, 0.5, 10, 77),
('IFCT016', 'Upma (semolina)', 'Upma', 'Cereals', 'South India', 'cooked', 150, 3.8, 22.5, 5.0, 1.2, 0.7, 14, 20, 65, 180, 0, 0, 0.5, 15, 65),
('IFCT017', 'Puri (deep fried)', 'Puri', 'Cereals', 'North India', 'cooked', 370, 7.5, 44.8, 18.0, 2.0, 3.0, 30, 40, 110, 30, 0, 0, 1.0, 15, 68),

-- PULSES & LEGUMES
('IFCT020', 'Toor dal (pigeon pea), cooked', 'Arhar dal', 'Pulses', 'All India', 'cooked', 128, 7.2, 21.0, 1.2, 3.2, 1.5, 45, 50, 367, 8, 0, 0, 1.0, 45, 29),
('IFCT021', 'Moong dal (green gram), cooked', 'Moong dal', 'Pulses', 'All India', 'cooked', 104, 7.1, 15.0, 0.4, 3.0, 1.4, 27, 48, 266, 6, 0, 0, 1.0, 36, 31),
('IFCT022', 'Masoor dal (red lentil), cooked', 'Masoor dal', 'Pulses', 'All India', 'cooked', 116, 9.0, 18.0, 0.4, 2.0, 3.3, 19, 36, 369, 2, 0, 0, 1.27, 181, 32),
('IFCT023', 'Chana dal (Bengal gram), cooked', 'Chana dal', 'Pulses', 'All India', 'cooked', 165, 8.9, 25.0, 2.6, 4.8, 2.8, 45, 54, 380, 10, 0, 0, 1.6, 40, 28),
('IFCT024', 'Rajma (kidney beans), cooked', 'Rajma', 'Pulses', 'North India', 'cooked', 127, 8.7, 22.0, 0.5, 6.4, 2.9, 28, 45, 405, 2, 0, 0, 1.0, 130, 29),
('IFCT025', 'Chole (chickpeas), cooked', 'Chole', 'Pulses', 'North India', 'cooked', 164, 8.9, 27.4, 2.6, 7.6, 2.9, 49, 48, 291, 7, 0, 0, 1.5, 172, 28),
('IFCT026', 'Urad dal (black gram), cooked', 'Urad dal', 'Pulses', 'All India', 'cooked', 105, 7.8, 14.5, 0.6, 4.0, 3.8, 138, 80, 300, 10, 0, 0, 1.4, 30, 43),
('IFCT027', 'Sprouts, moong', 'Moong sprouts', 'Pulses', 'All India', 'raw', 30, 3.0, 4.1, 0.2, 1.5, 0.8, 13, 21, 149, 6, 0, 0, 0.4, 60, 25),
('IFCT028', 'Soybean, raw', 'Soybean', 'Pulses', 'All India', 'raw', 432, 36.5, 30.2, 19.9, 9.3, 15.7, 277, 280, 1797, 2, 0, 0, 4.89, 375, 16),

-- VEGETABLES
('IFCT030', 'Potato, cooked', 'Aloo', 'Vegetables', 'All India', 'cooked', 97, 2.0, 22.0, 0.1, 1.8, 0.7, 9, 21, 379, 5, 0, 0, 0.3, 13, 78),
('IFCT031', 'Onion, raw', 'Pyaz', 'Vegetables', 'All India', 'raw', 40, 1.1, 9.3, 0.1, 1.7, 0.2, 23, 10, 146, 4, 0, 0, 0.17, 19, 10),
('IFCT032', 'Tomato, raw', 'Tamatar', 'Vegetables', 'All India', 'raw', 18, 0.9, 3.9, 0.2, 1.2, 0.3, 10, 11, 237, 5, 0, 0, 0.17, 15, 15),
('IFCT033', 'Spinach (palak), cooked', 'Palak', 'Vegetables', 'All India', 'cooked', 23, 2.9, 3.6, 0.4, 2.2, 2.7, 99, 79, 466, 70, 0, 0, 0.53, 146, 15),
('IFCT034', 'Bhindi (okra), cooked', 'Bhindi', 'Vegetables', 'All India', 'cooked', 33, 1.9, 7.0, 0.2, 3.2, 0.6, 82, 57, 299, 7, 0, 0, 0.58, 46, 20),
('IFCT035', 'Cauliflower, cooked', 'Gobi', 'Vegetables', 'All India', 'cooked', 25, 1.9, 5.1, 0.1, 2.5, 0.4, 22, 12, 142, 15, 0, 0, 0.2, 44, 15),
('IFCT036', 'Cabbage, raw', 'Patta gobi', 'Vegetables', 'All India', 'raw', 25, 1.3, 5.8, 0.1, 2.5, 0.5, 40, 12, 170, 18, 0, 0, 0.18, 43, 10),
('IFCT037', 'Brinjal (eggplant), cooked', 'Baingan', 'Vegetables', 'All India', 'cooked', 25, 0.8, 5.9, 0.2, 3.0, 0.2, 9, 14, 123, 2, 0, 0, 0.16, 14, 15),
('IFCT038', 'Lauki (bottle gourd), cooked', 'Lauki', 'Vegetables', 'All India', 'cooked', 15, 0.6, 3.4, 0.02, 0.5, 0.2, 26, 11, 150, 2, 0, 0, 0.7, 6, 15),
('IFCT039', 'Karela (bitter gourd), cooked', 'Karela', 'Vegetables', 'All India', 'cooked', 17, 1.0, 3.7, 0.2, 2.8, 0.4, 19, 17, 296, 5, 0, 0, 0.8, 72, 24),
('IFCT040', 'Green peas, cooked', 'Matar', 'Vegetables', 'All India', 'cooked', 81, 5.4, 14.5, 0.4, 5.1, 1.5, 25, 33, 244, 5, 0, 0, 1.24, 65, 48),
('IFCT041', 'Carrot, raw', 'Gajar', 'Vegetables', 'All India', 'raw', 41, 0.9, 9.6, 0.2, 2.8, 0.3, 33, 12, 320, 69, 0, 0, 0.24, 19, 16),
('IFCT042', 'Capsicum (bell pepper), raw', 'Shimla mirch', 'Vegetables', 'All India', 'raw', 20, 0.9, 4.6, 0.2, 1.7, 0.3, 10, 10, 175, 3, 0, 0, 0.13, 10, 15),
('IFCT043', 'Cucumber, raw', 'Kheera', 'Vegetables', 'All India', 'raw', 15, 0.7, 3.6, 0.1, 0.5, 0.28, 16, 13, 147, 2, 0, 0, 0.2, 7, 15),
('IFCT044', 'Drumstick (moringa), cooked', 'Sahjan', 'Vegetables', 'South India', 'cooked', 64, 9.4, 8.5, 1.4, 2.0, 4.0, 185, 147, 337, 42, 0, 0, 0.6, 40, 20),
('IFCT045', 'Methi leaves (fenugreek)', 'Methi', 'Vegetables', 'All India', 'raw', 49, 4.4, 6.3, 0.9, 4.2, 16.5, 160, 42, 280, 76, 0, 0, 0.8, 62, 15),

-- FRUITS
('IFCT050', 'Banana, ripe', 'Kela', 'Fruits', 'All India', 'raw', 89, 1.1, 22.8, 0.3, 2.6, 0.26, 5, 27, 358, 1, 0, 0, 0.15, 20, 51),
('IFCT051', 'Apple', 'Seb', 'Fruits', 'North India', 'raw', 52, 0.3, 13.8, 0.2, 2.4, 0.12, 6, 5, 107, 1, 0, 0, 0.04, 3, 36),
('IFCT052', 'Mango, ripe', 'Aam', 'Fruits', 'All India', 'raw', 60, 0.8, 15.0, 0.4, 1.6, 0.16, 11, 10, 168, 1, 0, 0, 0.09, 43, 51),
('IFCT053', 'Papaya, ripe', 'Papita', 'Fruits', 'All India', 'raw', 43, 0.5, 10.8, 0.3, 1.7, 0.25, 20, 21, 182, 8, 0, 0, 0.08, 37, 60),
('IFCT054', 'Guava', 'Amrood', 'Fruits', 'All India', 'raw', 68, 2.6, 14.3, 1.0, 5.4, 0.26, 18, 22, 417, 2, 0, 0, 0.23, 49, 12),
('IFCT055', 'Orange', 'Santra', 'Fruits', 'All India', 'raw', 47, 0.9, 11.8, 0.1, 2.4, 0.1, 40, 11, 181, 0, 0, 0, 0.07, 30, 43),
('IFCT056', 'Watermelon', 'Tarbooz', 'Fruits', 'All India', 'raw', 30, 0.6, 7.6, 0.2, 0.4, 0.24, 7, 10, 112, 1, 0, 0, 0.1, 3, 76),
('IFCT057', 'Pomegranate', 'Anaar', 'Fruits', 'All India', 'raw', 83, 1.7, 18.7, 1.2, 4.0, 0.3, 10, 12, 236, 3, 0, 0, 0.35, 38, 53),
('IFCT058', 'Grapes', 'Angoor', 'Fruits', 'West India', 'raw', 69, 0.7, 18.1, 0.2, 0.9, 0.36, 10, 7, 191, 2, 0, 0, 0.07, 2, 53),
('IFCT059', 'Chikoo (sapodilla)', 'Chikoo', 'Fruits', 'West India', 'raw', 83, 0.4, 20.0, 1.1, 5.3, 0.8, 21, 12, 193, 12, 0, 0, 0.1, 14, 55),

-- DAIRY
('IFCT060', 'Milk, whole (cow)', 'Doodh', 'Dairy', 'All India', 'raw', 62, 3.2, 4.7, 3.3, 0, 0.05, 113, 10, 132, 44, 0.45, 2, 0.37, 5, 27),
('IFCT061', 'Milk, buffalo', 'Bhains ka doodh', 'Dairy', 'All India', 'raw', 97, 3.7, 5.2, 6.9, 0, 0.12, 210, 31, 178, 52, 0.36, 8, 0.22, 6, 27),
('IFCT062', 'Curd (dahi)', 'Dahi', 'Dairy', 'All India', 'raw', 60, 3.1, 4.7, 3.1, 0, 0.02, 149, 15, 234, 40, 0.37, 0.6, 0.52, 7, 36),
('IFCT063', 'Paneer (cottage cheese)', 'Paneer', 'Dairy', 'All India', 'raw', 265, 18.3, 1.2, 20.8, 0, 0.23, 208, 26, 100, 22, 0.82, 4, 2.7, 37, 27),
('IFCT064', 'Ghee (clarified butter)', 'Ghee', 'Dairy', 'All India', 'raw', 883, 0.3, 0, 99.5, 0, 0, 3, 0, 1, 0, 0, 10, 0, 0, 0),
('IFCT065', 'Butter', 'Makhan', 'Dairy', 'All India', 'raw', 717, 0.9, 0.1, 81.1, 0, 0.02, 24, 2, 24, 11, 0.17, 7.1, 0.09, 3, 0),
('IFCT066', 'Buttermilk (chaas)', 'Chaas', 'Dairy', 'All India', 'raw', 40, 3.3, 4.8, 0.9, 0, 0.05, 116, 11, 151, 105, 0.22, 1, 0.42, 5, 35),
('IFCT067', 'Khoya (mawa)', 'Khoya', 'Dairy', 'North India', 'raw', 321, 10.6, 18.0, 23.5, 0, 0.5, 650, 50, 300, 200, 1.0, 3, 1.5, 10, 30),

-- MEAT, FISH & EGGS
('IFCT070', 'Chicken breast, cooked', 'Chicken', 'Meat', 'All India', 'cooked', 165, 31.0, 0, 3.6, 0, 1.04, 11, 29, 256, 74, 0.34, 5, 1.0, 4, 0),
('IFCT071', 'Chicken thigh, cooked', 'Chicken tangri', 'Meat', 'All India', 'cooked', 209, 26.0, 0, 10.9, 0, 1.3, 12, 23, 220, 84, 0.3, 4, 2.8, 6, 0),
('IFCT072', 'Egg, whole, boiled', 'Anda', 'Eggs', 'All India', 'cooked', 155, 12.6, 1.1, 10.6, 0, 1.75, 50, 10, 126, 124, 0.89, 87, 1.05, 44, 0),
('IFCT073', 'Egg white, boiled', 'Anda safed', 'Eggs', 'All India', 'cooked', 52, 11.0, 0.7, 0.2, 0, 0.08, 7, 11, 163, 166, 0.09, 0, 0.03, 4, 0),
('IFCT074', 'Mutton (goat), cooked', 'Mutton', 'Meat', 'All India', 'cooked', 143, 27.1, 0, 3.0, 0, 3.7, 17, 23, 310, 82, 2.6, 3, 5.3, 8, 0),
('IFCT075', 'Fish (rohu), cooked', 'Rohu machli', 'Fish', 'All India', 'cooked', 97, 16.6, 0, 3.2, 0, 0.9, 110, 28, 260, 58, 2.5, 68, 0.7, 12, 0),
('IFCT076', 'Prawns, cooked', 'Jhinga', 'Fish', 'All India', 'cooked', 99, 20.9, 0.2, 1.1, 0, 2.4, 64, 35, 220, 566, 1.2, 0, 1.6, 3, 0),

-- NUTS & SEEDS
('IFCT080', 'Almonds', 'Badam', 'Nuts', 'All India', 'raw', 579, 21.2, 21.6, 49.9, 12.5, 3.71, 269, 270, 733, 1, 0, 0, 3.12, 44, 15),
('IFCT081', 'Cashew nuts', 'Kaju', 'Nuts', 'All India', 'raw', 553, 18.2, 30.2, 43.9, 3.3, 6.68, 37, 292, 660, 12, 0, 0, 5.78, 25, 22),
('IFCT082', 'Peanuts, raw', 'Moongfali', 'Nuts', 'All India', 'raw', 567, 25.8, 16.1, 49.2, 8.5, 4.58, 92, 168, 705, 18, 0, 0, 3.27, 240, 14),
('IFCT083', 'Walnuts', 'Akhrot', 'Nuts', 'North India', 'raw', 654, 15.2, 13.7, 65.2, 6.7, 2.91, 98, 158, 441, 2, 0, 0, 3.09, 98, 15),
('IFCT084', 'Coconut, fresh', 'Nariyal', 'Nuts', 'South India', 'raw', 354, 3.3, 15.2, 33.5, 9.0, 2.43, 14, 32, 356, 20, 0, 0, 1.1, 26, 45),
('IFCT085', 'Flaxseeds', 'Alsi', 'Seeds', 'All India', 'raw', 534, 18.3, 28.9, 42.2, 27.3, 5.73, 255, 392, 813, 30, 0, 0, 4.34, 87, 35),
('IFCT086', 'Chia seeds', 'Chia', 'Seeds', 'Imported', 'raw', 486, 16.5, 42.1, 30.7, 34.4, 7.72, 631, 335, 407, 16, 0, 0, 4.58, 49, 1),
('IFCT087', 'Dates, dried', 'Khajoor', 'Fruits', 'All India', 'raw', 277, 1.8, 75.0, 0.2, 6.7, 0.9, 64, 54, 696, 1, 0, 0, 0.44, 15, 42),

-- OILS & FATS
('IFCT090', 'Mustard oil', 'Sarson ka tel', 'Oils', 'North India', 'raw', 884, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('IFCT091', 'Groundnut oil', 'Moongfali tel', 'Oils', 'West India', 'raw', 884, 0, 0, 100, 0, 0.03, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('IFCT092', 'Coconut oil', 'Nariyal tel', 'Oils', 'South India', 'raw', 862, 0, 0, 100, 0, 0.04, 1, 0, 0, 0, 0, 0, 0, 0, 0),
('IFCT093', 'Sunflower oil', 'Surajmukhi tel', 'Oils', 'All India', 'raw', 884, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 5.6, 0, 0, 0),
('IFCT094', 'Olive oil', 'Olive oil', 'Oils', 'Imported', 'raw', 884, 0, 0, 100, 0, 0.56, 1, 0, 1, 2, 0, 0, 0, 0, 0),

-- SPICES & CONDIMENTS
('IFCT100', 'Turmeric powder', 'Haldi', 'Spices', 'All India', 'raw', 312, 9.7, 67.1, 3.3, 22.7, 55, 168, 208, 2080, 27, 0, 0, 4.5, 20, 5),
('IFCT101', 'Cumin seeds', 'Jeera', 'Spices', 'All India', 'raw', 375, 17.8, 44.2, 22.3, 10.5, 66.4, 931, 366, 1788, 168, 0, 0, 4.8, 10, 5),
('IFCT102', 'Coriander seeds', 'Dhania', 'Spices', 'All India', 'raw', 298, 12.4, 55.0, 17.8, 41.9, 16.3, 709, 330, 1267, 35, 0, 0, 4.7, 2, 5),
('IFCT103', 'Red chilli powder', 'Lal mirch', 'Spices', 'All India', 'raw', 282, 13.5, 49.7, 14.3, 34.8, 14.3, 148, 152, 2014, 30, 0, 0, 2.5, 51, 5),
('IFCT104', 'Ginger, fresh', 'Adrak', 'Spices', 'All India', 'raw', 80, 1.8, 17.8, 0.8, 2.0, 0.6, 16, 43, 415, 13, 0, 0, 0.34, 11, 15),
('IFCT105', 'Garlic, fresh', 'Lehsun', 'Spices', 'All India', 'raw', 149, 6.4, 33.1, 0.5, 2.1, 1.7, 181, 25, 401, 17, 0, 0, 1.16, 3, 30),
('IFCT106', 'Green chilli, fresh', 'Hari mirch', 'Spices', 'All India', 'raw', 40, 2.0, 8.8, 0.2, 1.5, 1.0, 18, 24, 340, 7, 0, 0, 0.3, 23, 15),

-- SUGAR & SWEETENERS
('IFCT110', 'Sugar, white', 'Cheeni', 'Sugar', 'All India', 'raw', 387, 0, 100, 0, 0, 0.05, 1, 0, 2, 1, 0, 0, 0, 0, 65),
('IFCT111', 'Jaggery', 'Gur', 'Sugar', 'All India', 'raw', 383, 0.4, 96.7, 0.1, 0, 11, 80, 70, 480, 30, 0, 0, 0.2, 0, 65),
('IFCT112', 'Honey', 'Shahad', 'Sugar', 'All India', 'raw', 304, 0.3, 82.4, 0, 0.2, 0.42, 6, 2, 52, 4, 0, 0, 0.22, 2, 55),

-- PREPARED INDIAN DISHES (per 100g serving)
('IFCT120', 'Dal fry (toor dal)', 'Dal fry', 'Prepared', 'All India', 'cooked', 85, 4.5, 10.0, 3.0, 2.0, 1.0, 25, 30, 200, 250, 0, 0, 0.6, 30, 30),
('IFCT121', 'Aloo gobi (dry)', 'Aloo gobi', 'Prepared', 'North India', 'cooked', 95, 2.5, 13.0, 4.0, 2.5, 0.6, 18, 18, 200, 150, 0, 0, 0.3, 20, 55),
('IFCT122', 'Palak paneer', 'Palak paneer', 'Prepared', 'North India', 'cooked', 140, 7.5, 5.0, 10.5, 1.5, 2.0, 100, 45, 300, 200, 0.3, 1, 1.2, 80, 20),
('IFCT123', 'Rajma curry', 'Rajma', 'Prepared', 'North India', 'cooked', 110, 6.0, 15.0, 3.0, 4.0, 2.0, 30, 35, 350, 280, 0, 0, 0.8, 100, 32),
('IFCT124', 'Chicken curry', 'Chicken curry', 'Prepared', 'All India', 'cooked', 148, 15.0, 4.0, 8.0, 0.5, 1.5, 20, 22, 200, 300, 0.2, 3, 1.5, 10, 10),
('IFCT125', 'Chole (chickpea curry)', 'Chole', 'Prepared', 'North India', 'cooked', 130, 6.0, 18.0, 4.0, 5.0, 2.0, 40, 35, 250, 280, 0, 0, 1.0, 120, 30),
('IFCT126', 'Sambar', 'Sambar', 'Prepared', 'South India', 'cooked', 65, 3.5, 8.0, 2.0, 2.5, 1.0, 30, 25, 200, 300, 0, 0, 0.5, 25, 28),
('IFCT127', 'Coconut chutney', 'Chutney', 'Prepared', 'South India', 'cooked', 150, 2.5, 8.0, 12.5, 3.0, 0.8, 10, 15, 150, 80, 0, 0, 0.5, 8, 30),
('IFCT128', 'Vada pav (one piece ~170g)', 'Vada pav', 'Prepared', 'West India', 'cooked', 290, 6.5, 38.0, 12.5, 2.0, 1.5, 20, 25, 200, 380, 0, 0, 0.7, 15, 62),
('IFCT129', 'Biryani, chicken', 'Chicken biryani', 'Prepared', 'All India', 'cooked', 180, 10.0, 22.0, 6.0, 1.0, 1.0, 20, 20, 150, 350, 0.2, 2, 1.0, 12, 60),
('IFCT130', 'Khichdi (moong dal rice)', 'Khichdi', 'Prepared', 'All India', 'cooked', 120, 4.5, 20.0, 2.5, 1.5, 0.8, 15, 25, 150, 200, 0, 0, 0.6, 20, 45),
('IFCT131', 'Poha (prepared)', 'Poha', 'Prepared', 'West India', 'cooked', 160, 3.5, 28.0, 4.0, 1.0, 2.0, 15, 20, 100, 150, 0, 0, 0.5, 10, 64),

-- BEVERAGES
('IFCT140', 'Tea, black with milk & sugar', 'Chai', 'Beverages', 'All India', 'cooked', 37, 1.0, 5.5, 1.2, 0, 0.02, 30, 5, 50, 15, 0.1, 0.5, 0.1, 2, 0),
('IFCT141', 'Coffee, black, no sugar', 'Coffee', 'Beverages', 'All India', 'cooked', 2, 0.3, 0, 0, 0, 0.01, 2, 7, 49, 2, 0, 0, 0.05, 0, 0),
('IFCT142', 'Lassi, sweet', 'Lassi', 'Beverages', 'North India', 'cooked', 75, 2.5, 12.0, 2.0, 0, 0.03, 100, 10, 150, 40, 0.2, 0.5, 0.3, 5, 36),
('IFCT143', 'Coconut water', 'Nariyal pani', 'Beverages', 'South India', 'raw', 19, 0.7, 3.7, 0.2, 1.1, 0.29, 24, 25, 250, 105, 0, 0, 0.1, 3, 3),
('IFCT144', 'Nimbu pani (lemonade)', 'Nimbu pani', 'Beverages', 'All India', 'cooked', 25, 0.1, 6.5, 0, 0, 0.03, 3, 2, 15, 60, 0, 0, 0.02, 2, 0);
