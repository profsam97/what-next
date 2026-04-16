-- ============================================
-- What's Next? — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_guest BOOLEAN DEFAULT false,
  has_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  color_from TEXT,
  color_to TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  sequence TEXT[] NOT NULL,
  sequence_images TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  correct_answer_image TEXT,
  options TEXT[] NOT NULL,
  option_images TEXT[],
  difficulty INT DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  score INT DEFAULT 0,
  time_bonus INT DEFAULT 0,
  total_score INT DEFAULT 0,
  title TEXT,
  answers JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);

CREATE POLICY "Users can view all game sessions" ON game_sessions FOR SELECT USING (true);
CREATE POLICY "Users can insert own game sessions" ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Seed Categories
-- ============================================

INSERT INTO categories (name, slug, description, icon, image_url, color_from, color_to) VALUES
  ('Fashion', 'fashion', 'Track the evolution of style through the decades', '👗', '/assets/img/categories/fashion/cover.jpg', '#ec4899', '#8b5cf6'),
  ('Sports', 'sports', 'From legends to dynasties, predict the next era', '⚽', '/assets/img/categories/sports/cover.jpg', '#f97316', '#ef4444'),
  ('Pop Culture', 'popculture', 'Music, tech, and trends — what comes next?', '🎬', '/assets/img/categories/popculture/cover.jpg', '#06b6d4', '#3b82f6')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Questions
-- ============================================

DO $$
DECLARE
  fashion_id UUID;
  sports_id UUID;
  popculture_id UUID;
BEGIN
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
  SELECT id INTO sports_id FROM categories WHERE slug = 'sports';
  SELECT id INTO popculture_id FROM categories WHERE slug = 'popculture';

  -- Fashion Q1
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    fashion_id,
    ARRAY['Bell Bottoms', 'Skinny Jeans', 'Wide Leg Pants'],
    ARRAY['/assets/img/categories/fashion/bell-bottoms.jpg', '/assets/img/categories/fashion/skinny-jeans.jpg', '/assets/img/categories/fashion/wide-leg-pants.jpg'],
    'Cargo Pants',
    '/assets/img/categories/fashion/cargo-pants.jpg',
    ARRAY['Cargo Pants', 'Leggings', 'Overalls'],
    ARRAY['/assets/img/categories/fashion/cargo-pants.jpg', '/assets/img/categories/fashion/leggings.jpg', '/assets/img/categories/fashion/overalls.jpg'],
    1,
    'Fashion cycles between slim and loose fits. After wide legs, cargo pants emerged as the utilitarian trend of the 2020s.'
  );

  -- Fashion Q2
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    fashion_id,
    ARRAY['Corset', 'Waistcoat', 'Crop Top'],
    ARRAY['/assets/img/categories/fashion/corset.jpg', '/assets/img/categories/fashion/waistcoat.jpg', '/assets/img/categories/fashion/crop-top.jpg'],
    'Bustier',
    '/assets/img/categories/fashion/bustier.jpg',
    ARRAY['Bustier', 'Hoodie', 'Blazer'],
    ARRAY['/assets/img/categories/fashion/bustier.jpg', '/assets/img/categories/fashion/hoodie.jpg', '/assets/img/categories/fashion/blazer.jpg'],
    2,
    'Structured tops keep cycling back. The bustier became a runway staple, blending corset heritage with modern aesthetics.'
  );

  -- Fashion Q3
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    fashion_id,
    ARRAY['Platform Shoes', 'Stilettos', 'Chunky Sneakers'],
    ARRAY['/assets/img/categories/fashion/platform-shoes.jpg', '/assets/img/categories/fashion/stilettos.jpg', '/assets/img/categories/fashion/chunky-sneakers.jpg'],
    'Ballet Flats',
    '/assets/img/categories/fashion/ballet-flats.jpg',
    ARRAY['Ballet Flats', 'Cowboy Boots', 'Flip Flops'],
    ARRAY['/assets/img/categories/fashion/ballet-flats.jpg', '/assets/img/categories/fashion/cowboy-boots.jpg', '/assets/img/categories/fashion/flip-flops.jpg'],
    1,
    'After the chunky sneaker trend, fashion swung to minimalist ballet flats — comfort meets elegance.'
  );

  -- Sports Q1
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    sports_id,
    ARRAY['Pele', 'Maradona', 'Ronaldo'],
    ARRAY['/assets/img/categories/sports/pele.jpg', '/assets/img/categories/sports/maradona.jpg', '/assets/img/categories/sports/ronaldo.jpg'],
    'Messi',
    '/assets/img/categories/sports/messi.jpg',
    ARRAY['Messi', 'Neymar', 'Mbappe'],
    ARRAY['/assets/img/categories/sports/messi.jpg', '/assets/img/categories/sports/neymar.jpg', '/assets/img/categories/sports/mbappe.jpg'],
    1,
    'Each generation had its GOAT. After Ronaldo (R9), Messi took the crown with record Ballon d''Ors.'
  );

  -- Sports Q2
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    sports_id,
    ARRAY['Bulls Dynasty', 'Lakers Three-peat', 'Spurs Era'],
    ARRAY['/assets/img/categories/sports/bulls.jpg', '/assets/img/categories/sports/lakers.jpg', '/assets/img/categories/sports/spurs.jpg'],
    'Warriors Dynasty',
    '/assets/img/categories/sports/warriors.jpg',
    ARRAY['Warriors Dynasty', 'Heat Big Three', 'Celtics Revival'],
    ARRAY['/assets/img/categories/sports/warriors.jpg', '/assets/img/categories/sports/heat.jpg', '/assets/img/categories/sports/celtics.jpg'],
    2,
    'The Warriors revolutionized basketball with the three-point era, creating the next great NBA dynasty.'
  );

  -- Sports Q3
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    sports_id,
    ARRAY['Wooden Rackets', 'Metal Rackets', 'Graphite Rackets'],
    ARRAY['/assets/img/categories/sports/wooden-racket.jpg', '/assets/img/categories/sports/metal-racket.jpg', '/assets/img/categories/sports/graphite-racket.jpg'],
    'Carbon Fiber Rackets',
    '/assets/img/categories/sports/carbon-fiber-racket.jpg',
    ARRAY['Carbon Fiber Rackets', 'Titanium Rackets', 'Plastic Rackets'],
    ARRAY['/assets/img/categories/sports/carbon-fiber-racket.jpg', '/assets/img/categories/sports/titanium-racket.jpg', '/assets/img/categories/sports/plastic-racket.jpg'],
    1,
    'Tennis racket evolution followed material science — carbon fiber offered the best power-to-weight ratio.'
  );

  -- Pop Culture Q1
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    popculture_id,
    ARRAY['MySpace', 'Facebook', 'Instagram'],
    ARRAY['/assets/img/categories/popculture/myspace.jpg', '/assets/img/categories/popculture/facebook.jpg', '/assets/img/categories/popculture/instagram.jpg'],
    'TikTok',
    '/assets/img/categories/popculture/tiktok.jpg',
    ARRAY['TikTok', 'Twitter', 'Snapchat'],
    ARRAY['/assets/img/categories/popculture/tiktok.jpg', '/assets/img/categories/popculture/twitter.jpg', '/assets/img/categories/popculture/snapchat.jpg'],
    1,
    'Social media evolved from profiles to photos to short-form video. TikTok became the dominant platform.'
  );

  -- Pop Culture Q2
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    popculture_id,
    ARRAY['DVD', 'Blu-ray', 'Streaming'],
    ARRAY['/assets/img/categories/popculture/dvd.jpg', '/assets/img/categories/popculture/bluray.jpg', '/assets/img/categories/popculture/streaming.jpg'],
    'AI-Curated Content',
    '/assets/img/categories/popculture/ai-content.jpg',
    ARRAY['AI-Curated Content', 'VR Cinema', 'Hologram TV'],
    ARRAY['/assets/img/categories/popculture/ai-content.jpg', '/assets/img/categories/popculture/vr-cinema.jpg', '/assets/img/categories/popculture/hologram-tv.jpg'],
    2,
    'After streaming, AI-driven personalized content is reshaping how we consume entertainment.'
  );

  -- Pop Culture Q3
  INSERT INTO questions (category_id, sequence, sequence_images, correct_answer, correct_answer_image, options, option_images, difficulty, explanation)
  VALUES (
    popculture_id,
    ARRAY['Nokia 3310', 'Blackberry', 'iPhone'],
    ARRAY['/assets/img/categories/popculture/nokia.jpg', '/assets/img/categories/popculture/blackberry.jpg', '/assets/img/categories/popculture/iphone.jpg'],
    'Foldable Phones',
    '/assets/img/categories/popculture/foldable-phone.jpg',
    ARRAY['Foldable Phones', 'Smart Glasses', 'Smartwatch'],
    ARRAY['/assets/img/categories/popculture/foldable-phone.jpg', '/assets/img/categories/popculture/smart-glasses.jpg', '/assets/img/categories/popculture/smartwatch.jpg'],
    1,
    'After the smartphone revolution, foldable phones represent the next evolution in mobile design.'
  );
END $$;

-- ============================================
-- Auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, is_guest)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'Player_' || substr(new.id::text, 1, 8)),
    COALESCE((new.raw_user_meta_data->>'is_guest')::boolean, false)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
