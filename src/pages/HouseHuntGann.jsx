import React from 'react';
import { TrendingUp, Coins, Scroll, Home, Star, BarChart3, Users, Skull, Globe, Crown, Eye, Target } from 'lucide-react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';

const GANN_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: TrendingUp,
    theme: "Identity & First Impressions",
    ruler: "Mars",
    storyTitle: "The Cotton Farmer's Son",
    content: `In the dusty fields of Texas, young William embodied the self-made visionary. Born June 6, 1878, in Lufkin, Texas, blending farming roots with market mysticism, he projected enigmatic confidence, claiming astrological insights into trading.

From the start, his identity mirrored Gemini's twins: the scientific trader analyzing patterns, versus the mystical seer reading cosmic cycles in market movements.

He would become legendary as a man who could predict market turns with uncanny precision, yet he presented himself as merely a student of natural law and geometry.`,
    keyDate: "June 6, 1878",
    numerology: "6+6+1+8+7+8 = 36/9 - Universal visionary, mystic trader",
    color: "from-red-500 to-orange-500"
  },
  {
    house: 2,
    name: "House of Values",
    icon: Coins,
    theme: "Money, Possessions & Self-Worth",
    ruler: "Venus",
    storyTitle: "Market Fortunes",
    content: `Gann turned cotton trades into wealth using geometric methods, but he prized knowledge above gold. His early successes in commodity trading built fortune, yet he valued the methods more than the money.

In 1927, he published "Tunnel Thru the Air" - a novel that hid trading secrets in its pages. For those who could decode it, vast wealth awaited. For others, it was merely fiction.

Number 2 embodies duality—in Gann's case, the balance between accumulating wealth and hoarding sacred knowledge. He taught that true value lay in understanding cycles, not chasing profits.`,
    keyDate: "1900s-1920s",
    numerology: "2 = Balanced financial harmony, duality of profit and wisdom",
    color: "from-green-500 to-emerald-500"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: Scroll,
    theme: "Speech, Writing & Ideas",
    ruler: "Mercury",
    storyTitle: "Coded Forecasts",
    content: `Through writings and seminars, Gann predicted market turns with astrological precision. "The Truth of the Stock Tape" (1923) revealed techniques—but were they biblical prophecies in disguise?

His courses commanded high prices because students glimpsed something beyond charts: planetary alignments, biblical numerology, sacred geometry all woven into market forecasting.

He communicated in layers—surface teachings for beginners, hidden methods for initiates. Mercury's domain mastered: truth revealed through careful concealment.`,
    keyDate: "1923-1940s",
    numerology: "3 = Expression, the mystic communicator who reveals and conceals",
    color: "from-yellow-500 to-amber-500"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Family, Roots & Foundation",
    ruler: "Moon",
    storyTitle: "Texas Foundations",
    content: `Rooted in rural Texas, family farm life taught him seasonal cycles—planting by moon phases, harvest by planetary alignment. This wasn't superstition to young William; it was practical astronomy.

Moving to New York in 1908 didn't erase his grounding in natural rhythms. His foundation was earth-based wisdom: cycles observed in crops became cycles observed in markets.

Did his family carry hidden wisdom? Methodist upbringing mixed with deeper esoteric knowledge? The 4th House holds these ancestral secrets.`,
    keyDate: "1878-1908",
    numerology: "4 = Geometric foundations, structured wisdom from earth",
    color: "from-amber-600 to-yellow-600"
  },
  {
    house: 5,
    name: "House of Creativity",
    icon: Star,
    theme: "Romance, Children & Self-Expression",
    ruler: "Sun",
    storyTitle: "Innovative Methods",
    content: `Creativity birthed his legendary tools: the Square of Nine, the Hexagon Chart, the Master Calculator. These weren't mere technical indicators—they were creative divination tools disguised as mathematics.

His 1909 prediction of the September panic showcased creative risk-taking. Private romances fueled passionate market speculation—love and trading both governed by Venus, both requiring timing.

The 5th House's creative fire manifested as geometric innovation: circles, squares, and angles containing market secrets known only to ancient architects.`,
    keyDate: "1909",
    numerology: "5 = Adventurous innovation, creative geometric mysticism",
    color: "from-pink-500 to-rose-500"
  },
  {
    house: 6,
    name: "House of Service",
    icon: BarChart3,
    theme: "Work, Health & Daily Routine",
    ruler: "Mercury",
    storyTitle: "Daily Charts",
    content: `Meticulous analysis defined his routine—charts drawn by hand, angles measured precisely, planetary positions calculated daily. His work was ritual: wake before dawn, plot the stars, divine the markets.

Health through discipline: vegetarian diet, exercise, longevity through understanding body cycles. He believed astrology governed health as much as markets.

His daily service: teaching select students, warning of market dangers, promoting understanding of natural law. Number 6 demands devoted service through structured routine.`,
    keyDate: "1908-1950s",
    numerology: "6 = Dedicated cycles, service through teaching",
    color: "from-blue-500 to-indigo-500"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Marriage, Allies & Open Enemies",
    ruler: "Venus",
    storyTitle: "Trading Allies",
    content: `Brokers were partners in his methods, skeptics were open enemies ridiculing his "astro-finance." But his true alliances? The stars themselves.

Married to Sadie Hannigan, their partnership grounded his mystical pursuits. But in trading, he walked alone—methods too sacred to share fully, even with allies.

The 7th House asks: Who do you trust with your secrets? Gann trusted the cosmos more than men.`,
    keyDate: "1900s-1950s",
    numerology: "7 = Occult relations, partnerships with the unseen",
    color: "from-purple-500 to-violet-500"
  },
  {
    house: 8,
    name: "House of Death",
    icon: Skull,
    theme: "Transformation, Mystery & Shared Resources",
    ruler: "Pluto / Mars",
    storyTitle: "Final Cycles",
    content: `On June 18, 1955, in Brooklyn, New York, W.D. Gann's earthly cycle ended—did he predict it using his own methods? The date itself: 6+1+8+1+9+5+5 = 35/8, the number of power and transformation.

His papers were sealed, methods scattered. He transformed from man into legend, his techniques becoming occult treasure hunters' obsession.

The 8th House transformation: death of the trader, birth of the myth. His knowledge passed to those who could decode it.`,
    keyDate: "June 18, 1955",
    numerology: "35/8 = Powerful transformation, death into legend",
    color: "from-slate-700 to-gray-900"
  },
  {
    house: 9,
    name: "House of Foreign Lands",
    icon: Globe,
    theme: "Travel, Philosophy & Higher Learning",
    ruler: "Jupiter",
    storyTitle: "Global Trader",
    content: `His 1909 trip to Egypt unlocked pyramid geometry for market applications. Standing before the Great Pyramid, he saw not ancient tombs but eternal mathematical principles—angles and ratios governing time and price.

His philosophy blended finance with occult wisdom: markets as manifestations of universal law, geometry as the language of God. Travel expanded his vision from Texas farms to cosmic cycles.

The 9th House philosopher-trader who saw markets as spiritual battlegrounds where knowledge defeats chaos.`,
    keyDate: "1909",
    numerology: "9 = Worldwide wisdom, universal laws revealed through travel",
    color: "from-teal-500 to-cyan-500"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Crown,
    theme: "Public Image, Legacy & Achievement",
    ruler: "Saturn",
    storyTitle: "Wall Street Prophet",
    content: `Famed for predicting the 1929 crash, his legacy shaped technical analysis forever. He became "The Master Forecaster" - a title both celebrated and suspicious.

His public achievement: proving that markets follow natural law, not random chaos. His courses sold for $5,000 (equivalent to $75,000 today) because students believed he held keys to wealth.

Today, his Square of Nine and methods are studied religiously by traders worldwide. His 10th House legacy: the mystic who legitimized astro-finance.`,
    keyDate: "1929",
    numerology: "10/1 = Public mystic, pioneering market astrology",
    color: "from-amber-500 to-yellow-500"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Users,
    theme: "Groups, Friends & Humanitarian Vision",
    ruler: "Uranus / Saturn",
    storyTitle: "Student Followers",
    content: `Teaching select groups, he shared humanitarian insights through market education. Were secret societies at play? Masonic symbolism appears in his charts.

His 11th House vision: elevate humanity by revealing natural law, protect people from market manipulation by teaching cosmic timing. Master number 11 whispers of spiritual teaching.

His community was small, exclusive—those who could grasp that trading was spiritual warfare, geometry was prayer, and timing was everything.`,
    keyDate: "1920s-1950s",
    numerology: "11 = Master teacher, humanitarian vision through markets",
    color: "from-indigo-500 to-purple-500"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden Enemies, Spirituality & Endings",
    ruler: "Neptune / Jupiter",
    storyTitle: "Veiled Techniques",
    content: `The 12th House rules secrets, and Gann took his deepest ones to the grave. His methods encoded in fiction, hidden in Bible references, obscured in geometric complexity.

"Tunnel Thru the Air" contains the master key—but which page? Which symbol? Students have searched for decades, finding fragments but never the whole.

His spiritual practice: Bible study, numerology, astrology merged into market divination. The 12th House secret: markets are spiritual battlefields, and he was a warrior-priest who left maps only initiates could read.`,
    keyDate: "1955-Present",
    numerology: "12/3 = Karmic cycles, spiritual secrets encoded forever",
    color: "from-violet-600 to-purple-900"
  }
];

export default function HouseHuntGann() {
  return (
    <HouseStoryViewer 
      houses={GANN_HOUSES}
      personName="W.D. Gann"
      lifePath="36/9"
      birthDate="June 6, 1878"
      deathDate="June 18, 1955"
      zodiac="Gemini"
    />
  );
}