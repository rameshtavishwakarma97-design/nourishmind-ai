-- ============================================
-- Drug-Nutrient Interactions Seed Data
-- 30 common interactions relevant to Indian dietary patterns
-- ============================================

INSERT INTO public.drug_nutrient_interactions (supplement_keyword, food_keyword, interaction_type, severity, flag_message, recommendation)
VALUES
-- IRON INTERACTIONS
('iron', 'calcium', 'reduces_absorption', 'high', '⚠️ Calcium reduces iron absorption by up to 50%', 'Take iron and calcium supplements at least 2 hours apart. Avoid dairy with iron-rich meals.'),
('iron', 'tea', 'reduces_absorption', 'medium', '⚠️ Tea tannins reduce iron absorption by 60-70%', 'Avoid tea within 1 hour of meals or iron supplements. Try vitamin C-rich foods to boost iron absorption.'),
('iron', 'coffee', 'reduces_absorption', 'medium', '⚠️ Coffee polyphenols reduce iron absorption', 'Avoid coffee within 1 hour of iron-rich meals or supplements.'),
('iron', 'milk', 'reduces_absorption', 'medium', '⚠️ Dairy calcium interferes with iron absorption', 'Consume iron supplements with water or vitamin C juice, not with milk or dahi.'),
('iron', 'phytate', 'reduces_absorption', 'low', '⚠️ Whole grains contain phytates that reduce iron absorption', 'Soaking or fermenting grains (like for idli/dosa batter) reduces phytate content.'),

-- CALCIUM INTERACTIONS
('calcium', 'spinach', 'reduces_absorption', 'low', '⚠️ Spinach oxalates bind to calcium, reducing absorption', 'Don''t rely on palak as your primary calcium source. Use dairy, sesame, or ragi instead.'),
('calcium', 'iron', 'reduces_absorption', 'high', '⚠️ Taking calcium with iron reduces absorption of both', 'Take calcium and iron supplements at different times of day (morning vs evening).'),
('calcium', 'thyroid medication', 'reduces_absorption', 'high', '⚠️ Calcium reduces thyroid medication absorption', 'Take thyroid medication on empty stomach, wait 4 hours before calcium.'),

-- VITAMIN D INTERACTIONS
('vitamin d', 'cholestyramine', 'reduces_absorption', 'high', '⚠️ Cholestyramine (cholesterol medication) reduces Vitamin D absorption', 'Take Vitamin D supplement at least 4 hours after cholestyramine.'),

-- B12 INTERACTIONS
('metformin', 'vitamin b12', 'reduces_absorption', 'high', '⚠️ Metformin (diabetes medication) reduces B12 absorption over time', 'Get B12 levels checked every 6 months. Consider B12 supplementation.'),
('b12', 'metformin', 'reduces_absorption', 'high', '⚠️ Long-term metformin use depletes B12', 'Discuss B12 supplementation with your doctor. Eat B12-rich foods like dahi, paneer, eggs.'),

-- BLOOD THINNER INTERACTIONS
('warfarin', 'vitamin k', 'increases_risk', 'high', '⚠️ Vitamin K-rich foods can reduce warfarin effectiveness', 'Keep vitamin K intake consistent day-to-day. Don''t suddenly increase palak, methi, or broccoli.'),
('warfarin', 'spinach', 'increases_risk', 'high', '⚠️ Palak is very high in Vitamin K — can affect warfarin', 'Maintain consistent palak intake. Don''t eat large quantities sporadically.'),
('warfarin', 'methi', 'increases_risk', 'medium', '⚠️ Methi (fenugreek) is high in Vitamin K', 'Eat methi in consistent, moderate quantities while on warfarin.'),
('warfarin', 'green tea', 'increases_risk', 'medium', '⚠️ Green tea contains Vitamin K that can reduce warfarin effect', 'Limit green tea to 1-2 cups daily and keep intake consistent.'),

-- THYROID MEDICATION INTERACTIONS
('levothyroxine', 'soy', 'reduces_absorption', 'high', '⚠️ Soy products can reduce thyroid medication absorption', 'Take levothyroxine 4 hours before consuming soy products.'),
('levothyroxine', 'coffee', 'reduces_absorption', 'medium', '⚠️ Coffee reduces levothyroxine absorption', 'Wait at least 30-60 minutes after levothyroxine before drinking coffee.'),
('levothyroxine', 'calcium', 'reduces_absorption', 'high', '⚠️ Calcium supplements reduce levothyroxine absorption', 'Take levothyroxine on empty stomach, wait 4 hours before calcium.'),
('levothyroxine', 'iron', 'reduces_absorption', 'high', '⚠️ Iron supplements reduce levothyroxine absorption', 'Take levothyroxine on empty stomach, wait 4 hours before iron supplement.'),

-- STATINS INTERACTIONS
('statin', 'grapefruit', 'increases_risk', 'high', '⚠️ Grapefruit increases statin concentration in blood', 'Avoid grapefruit and grapefruit juice while on statins.'),

-- BLOOD PRESSURE MEDICATION
('ace inhibitor', 'potassium', 'increases_risk', 'high', '⚠️ ACE inhibitors + high potassium foods can cause hyperkalemia', 'Avoid excessive coconut water, bananas, or potassium supplements.'),
('ace inhibitor', 'coconut water', 'increases_risk', 'medium', '⚠️ Coconut water is high in potassium — risky with ACE inhibitors', 'Limit coconut water to 200ml/day while on ACE inhibitors.'),
('ace inhibitor', 'banana', 'increases_risk', 'low', '⚠️ Bananas are potassium-rich — monitor intake with ACE inhibitors', 'Limit to 1 banana/day. Monitor potassium levels regularly.'),

-- ANTACID INTERACTIONS
('antacid', 'iron', 'reduces_absorption', 'medium', '⚠️ Antacids reduce iron absorption', 'Take iron supplements 2 hours before or after antacids.'),
('antacid', 'zinc', 'reduces_absorption', 'medium', '⚠️ Antacids reduce zinc absorption', 'Take zinc supplements at a different time than antacids.'),

-- DIABETES MEDICATION
('glipizide', 'alcohol', 'increases_risk', 'high', '⚠️ Alcohol with diabetes medication can cause dangerous blood sugar drops', 'Avoid alcohol or eat food when consuming alcohol with diabetes medication.'),
('metformin', 'alcohol', 'increases_risk', 'high', '⚠️ Alcohol increases risk of lactic acidosis with metformin', 'Limit alcohol. Never drink on an empty stomach with metformin.'),

-- SUPPLEMENT TIMING
('fish oil', 'blood thinner', 'increases_risk', 'medium', '⚠️ Fish oil has blood-thinning properties — additive effect with anticoagulants', 'Discuss fish oil usage with your doctor if on blood thinners.'),

-- AYURVEDIC
('ashwagandha', 'thyroid medication', 'timing_conflict', 'medium', '⚠️ Ashwagandha may increase thyroid hormone levels', 'If on thyroid medication, consult doctor before taking ashwagandha.'),
('turmeric supplement', 'blood thinner', 'increases_risk', 'medium', '⚠️ Concentrated turmeric supplements have blood-thinning properties', 'Small amounts of haldi in cooking are fine. High-dose curcumin supplements may increase bleeding risk.');
