-- ============================================
-- UPDATE: Replace Fashion & Sports with Life & Technology
-- Run this in Supabase SQL Editor
-- ============================================

-- Delete old questions for Fashion and Sports
DELETE FROM questions WHERE category_id IN (
  SELECT id FROM categories WHERE slug IN ('fashion', 'sports')
);

-- Delete old categories
DELETE FROM categories WHERE slug IN ('fashion', 'sports');

-- Insert new categories
INSERT INTO categories (name, slug, description, icon, image_url, color_from, color_to) VALUES
  ('Life & Evolution', 'life', 'From seeds to butterflies — spot the natural pattern', '🌱', '/assets/img/categories/life/cover.jpg', '#22c55e', '#06b6d4'),
  ('Technology', 'technology', 'Track the evolution of human innovation', '💡', '/assets/img/categories/technology/cover.jpg', '#f59e0b', '#ef4444')
ON CONFLICT (slug) DO NOTHING;

-- Insert new questions
DO $$
DECLARE
  life_id UUID;
  tech_id UUID;
BEGIN
  SELECT id INTO life_id FROM categories WHERE slug = 'life';
  SELECT id INTO tech_id FROM categories WHERE slug = 'technology';

  -- Life Q1: Human Growth
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    life_id,
    ARRAY['Baby', 'Toddler', 'Teenager'],
    ARRAY['/assets/img/categories/life/baby.jpg', '/assets/img/categories/life/toddler.jpg', '/assets/img/categories/life/teenager.jpg'],
    'Adult',
    '/assets/img/categories/life/adult.jpg',
    ARRAY['Adult', 'Elderly', 'Child'],
    ARRAY['/assets/img/categories/life/adult.jpg', '/assets/img/categories/life/elderly.jpg', '/assets/img/categories/life/child.jpg'],
    1,
    'The natural stages of human growth: baby, toddler, teenager, and then adulthood.'
  );

  -- Life Q2: Plant Lifecycle
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    life_id,
    ARRAY['Seed', 'Sprout', 'Tree'],
    ARRAY['/assets/img/categories/life/seed.jpg', '/assets/img/categories/life/sprout.jpg', '/assets/img/categories/life/tree.jpg'],
    'Fruit',
    '/assets/img/categories/life/fruit.jpg',
    ARRAY['Fruit', 'Dead Tree', 'Flower'],
    ARRAY['/assets/img/categories/life/fruit.jpg', '/assets/img/categories/life/dead-tree.jpg', '/assets/img/categories/life/flower.jpg'],
    1,
    'A plant grows from seed to sprout to tree, and then bears fruit — the cycle of life.'
  );

  -- Life Q3: Butterfly Metamorphosis
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    life_id,
    ARRAY['Egg', 'Caterpillar', 'Cocoon'],
    ARRAY['/assets/img/categories/life/egg.jpg', '/assets/img/categories/life/caterpillar.jpg', '/assets/img/categories/life/cocoon.jpg'],
    'Butterfly',
    '/assets/img/categories/life/butterfly.jpg',
    ARRAY['Butterfly', 'Moth', 'Ladybug'],
    ARRAY['/assets/img/categories/life/butterfly.jpg', '/assets/img/categories/life/moth.jpg', '/assets/img/categories/life/ladybug.jpg'],
    2,
    'Butterfly metamorphosis: egg, caterpillar, cocoon (chrysalis), and finally a beautiful butterfly.'
  );

  -- Technology Q1: Writing/Computing
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    tech_id,
    ARRAY['Typewriter', 'Desktop Computer', 'Laptop'],
    ARRAY['/assets/img/categories/technology/typewriter.jpg', '/assets/img/categories/technology/desktop-computer.jpg', '/assets/img/categories/technology/laptop.jpg'],
    'Tablet',
    '/assets/img/categories/technology/tablet.jpg',
    ARRAY['Tablet', 'Smartphone', 'Smartwatch'],
    ARRAY['/assets/img/categories/technology/tablet.jpg', '/assets/img/categories/technology/smartphone.jpg', '/assets/img/categories/technology/smartwatch-tech.jpg'],
    1,
    'Computing devices got progressively smaller and more portable: typewriter, desktop, laptop, tablet.'
  );

  -- Technology Q2: Storage Media
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    tech_id,
    ARRAY['VHS', 'CD', 'USB Drive'],
    ARRAY['/assets/img/categories/technology/vhs.jpg', '/assets/img/categories/technology/cd.jpg', '/assets/img/categories/technology/usb.jpg'],
    'Cloud Storage',
    '/assets/img/categories/technology/cloud-storage.jpg',
    ARRAY['Cloud Storage', 'Floppy Disk', 'Hard Drive'],
    ARRAY['/assets/img/categories/technology/cloud-storage.jpg', '/assets/img/categories/technology/floppy-disk.jpg', '/assets/img/categories/technology/hard-drive.jpg'],
    1,
    'Storage evolved from physical media to the cloud — each generation smaller and more accessible.'
  );

  -- Technology Q3: Lighting
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    tech_id,
    ARRAY['Candle', 'Oil Lamp', 'Light Bulb'],
    ARRAY['/assets/img/categories/technology/candle.jpg', '/assets/img/categories/technology/oil-lamp.jpg', '/assets/img/categories/technology/light-bulb.jpg'],
    'LED Light',
    '/assets/img/categories/technology/led-light.jpg',
    ARRAY['LED Light', 'Fluorescent', 'Torch'],
    ARRAY['/assets/img/categories/technology/led-light.jpg', '/assets/img/categories/technology/fluorescent.jpg', '/assets/img/categories/technology/torch.jpg'],
    2,
    'Lighting technology progressed from fire to oil to incandescent to energy-efficient LEDs.'
  );
END $$;
