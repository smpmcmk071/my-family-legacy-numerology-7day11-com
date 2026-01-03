import React from 'react';
import { Zap, Coins, Scroll, Home, Star, Heart, Users, Skull, Globe, Crown, Eye, Trophy } from 'lucide-react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';

const KOBE_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: Zap,
    theme: "Identity & First Impressions",
    ruler: "Mars",
    storyTitle: "The Philadelphia Prodigy",
    content: `Young Kobe dribbled on Philadelphia courts at age three, his eyes locked on rims others couldn't reach, mind already envisioning glory. Born August 23, 1978, to Joe "Jellybean" Bryant, an NBA journeyman, and Pamela, he navigated a mobile family—moving to Italy at six for Joe's career.

From the start, his identity flowed like Aquarius's bearer: the innovative phenom projecting fierce confidence, versus the hidden introspect intuiting game's deeper flows. Mastered Italian hoops by thirteen, returning to Lower Merion High, projecting stardom while enduring cultural readjustment.

By NBA draft 1996, Kobe's persona solidified: the enigmatic Mamba who projects transcendent will while the world mistakes it for arrogance.`,
    keyDate: "August 23, 1978",
    numerology: "8+2+3+1+9+7+8 = 38/11 - The Master Illuminator",
    color: "from-red-500 to-orange-500"
  },
  {
    house: 2,
    name: "House of Values",
    icon: Coins,
    theme: "Money, Possessions & Self-Worth",
    ruler: "Venus",
    storyTitle: "Lakers Rise",
    content: `Kobe Bryant entered the NBA in 1996 drafted 13th by Charlotte, traded to Lakers, with raw talent and a vision that would forge endorsements. Los Angeles' glamour differed from Philly streets, but to Kobe's eyes, it was the same pursuit: championships as ultimate assets.

For Kobe, this wasn't fame—it was excellence. If practice built mastery, then wealth was the byproduct, proving dedication through rings and riches. Rookie year averaged 7.6 points, building to All-Star 1998. Endorsements with Adidas 1996, then Nike 2003, netting millions.

Number 2 embodies duality, partnerships—merging individual brilliance with team success. It teaches accumulation as harmony.`,
    keyDate: "1996-2000s",
    numerology: "2 = Balance between earnings and excellence",
    color: "from-green-500 to-emerald-500"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: Scroll,
    theme: "Speech, Writing & Ideas",
    ruler: "Mercury",
    storyTitle: "Media and Mentality",
    content: `House 3 is Mercury's agile domain. For Kobe Bryant, this house wasn't about talk; it was about mantra—interviews as insights, books as blueprints, prophecies beneath motivation.

The verbal legacy built early. In 1996 draft, he declared Lakers intent, forecasting dominance. But mastery came with "Mamba Mentality" coined 2000s, a philosophy shared in 2018 book—mindset as oracle for success.

The 2006 81-Point game vs. Toronto was peak performance augury. Speeches and podcasts blended wisdom with foresight. Number 3 represents expression, creative prophecy.`,
    keyDate: "2006-2018",
    numerology: "3 = Expression, the herald who inspires",
    color: "from-yellow-500 to-amber-500"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Family, Roots & Foundation",
    ruler: "Moon",
    storyTitle: "Philly Foundations",
    content: `For Kobe Bryant, born in Philadelphia to Joe's basketball legacy and Pamela's supportive warmth, this house wove family shadowed by moves: firm foundations enabling rises, yet tinged with relocation's karmic undercurrents.

Lower Merion home was nurturing nexus—siblings as early teammates. From 1978-1996, these sanctuaries blended American roots with Italian influences, high school stardom forging resilience.

Wed Vanessa 2001, four daughters. Roots in family, Aquarius's innovation nurturing bonds. Number 4 signifies structure—Philly's solidity fueled ascents.`,
    keyDate: "1978-1996",
    numerology: "4 = Foundation, the roots that drive greatness",
    color: "from-amber-600 to-yellow-600"
  },
  {
    house: 5,
    name: "House of Creativity",
    icon: Star,
    theme: "Romance, Children & Self-Expression",
    ruler: "Sun",
    storyTitle: "The Creator Who Evolves",
    content: `The Fifth House is Leo's radiant forge—creative bursts, daring leaps, romantic fires. For Kobe, it blazed in plays, channeling ardor into legacies, subtle enchantments beneath dunks.

Drafted 1996, risked straight from high school. Romances: Wed Vanessa 2001, four daughters blending joy with scrutiny—2003 Colorado incident, charges dropped. First championships 2000-02, creative risks in Shaq partnership.

Number 5 evokes adventure, liberated creation—Leo's blaze in Aquarius's air. Kobe wagered legacy like stellar bets, innovation veiling passionate drives.`,
    keyDate: "1996-2002",
    numerology: "5 = Creative risk, romantic passion, the bold gambler",
    color: "from-pink-500 to-rose-500"
  },
  {
    house: 6,
    name: "House of Service",
    icon: Trophy,
    theme: "Work, Health & Daily Routine",
    ruler: "Mercury",
    storyTitle: "The Ritual of Mastery",
    content: `House 6 is Virgo's meticulous sanctum—daily rites, service, wellness. Kobe's cadence: endless workouts, dissecting games like arcane plays. The legendary 4 AM practices, training as meditation.

Injuries: Achilles 2013, testing structure. Service to Lakers spanning two decades, mentoring youth, detail obsession as sacred duty.

Number 6 mandates devoted harmony, routines as offerings. The Mamba work ethic became mythology—discipline as divinity.`,
    keyDate: "1996-2016",
    numerology: "6 = Service through relentless work, duty as devotion",
    color: "from-blue-500 to-indigo-500"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Marriage, Allies & Open Enemies",
    ruler: "Venus",
    storyTitle: "Teammates and Rivals",
    content: `House 7 is Libra's reflective scale—alliances, adversaries. Marriage to Vanessa enduring trials, repair after 2003. Partners like Shaq (2000-04 rings, tension and triumph), Pau Gasol (2009-10, perfect harmony).

Rivals: Spurs, Celtics—2008 Finals loss resetting resolve. The mirror showing strengths and flaws. Every opponent a teacher.

Number 7 whispers mystic ties, intellectual pacts. His partnerships reflected growth—learning when to lead, when to trust.`,
    keyDate: "2000-2010",
    numerology: "7 = Partnerships as mirrors, competition as growth",
    color: "from-purple-500 to-violet-500"
  },
  {
    house: 8,
    name: "House of Death",
    icon: Skull,
    theme: "Transformation, Mystery & Shared Resources",
    ruler: "Pluto / Mars",
    storyTitle: "The Eternal Transformation",
    content: `The 8th House rules death, transformation, rebirth. For Kobe, it's the Achilles tear 2013—death of invincibility, rebirth as mentor. Transformation from player to legend.

Then January 26, 2020: the helicopter crash in Calabasas. Nine souls, including daughter Gianna. The 8th House's ultimate mystery—why that day? 1+2+6+2+0+2+0 = 13/4, karmic debt.

Death transformed him into immortality. Mamba forever—the 8th House's final alchemy.`,
    keyDate: "January 26, 2020",
    numerology: "8 = Transformation, death birthing eternal legacy",
    color: "from-slate-700 to-gray-900"
  },
  {
    house: 9,
    name: "House of Foreign Lands",
    icon: Globe,
    theme: "Travel, Philosophy & Higher Learning",
    ruler: "Jupiter",
    storyTitle: "Global Mamba",
    content: `The 9th House governs foreign lands, philosophy, expansion. Kobe's childhood in Italy (1984-1991) planted seeds—fluent Italian, European basketball influence, global mindset.

Philosophy: Mamba Mentality as exported wisdom—books translated worldwide, camps across continents, basketball as universal language. China tours, global fanbase transcending borders.

Number 9 represents universal reach, higher learning. His 9th House philosophy: greatness has no nationality.`,
    keyDate: "1984-2020",
    numerology: "9 = Universal philosophy, foreign expansion",
    color: "from-teal-500 to-cyan-500"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Crown,
    theme: "Public Image, Legacy & Achievement",
    ruler: "Saturn",
    storyTitle: "Five Rings, One Legacy",
    content: `The 10th House is public legacy. For Kobe: 5 NBA championships, 18 All-Star selections, 81-point game, 2 Finals MVPs, Olympic gold medals, Oscar (Dear Basketball, 2018).

His 10th House achievement: transforming basketball work ethic, inspiring generations globally, proving high school-to-NBA greatness possible. The Black Mamba persona—public image as fearless competitor.

Legacy carved in Lakers' rafters: both #8 and #24 retired. The only player with two numbers honored—symbolic of complete mastery.`,
    keyDate: "2000-2020",
    numerology: "10/1 = Leadership, the pioneer's career pinnacle",
    color: "from-amber-500 to-yellow-500"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Heart,
    theme: "Groups, Friends & Humanitarian Vision",
    ruler: "Uranus / Saturn",
    storyTitle: "Mamba Mentality Movement",
    content: `The 11th House governs communities, humanitarian vision. Kobe's Mamba Sports Academy, youth coaching clinics, storytelling through Granity Studios—building community through inspiration.

The movement: Mamba Mentality as collective philosophy, inspiring athletes worldwide. Friends and teammates as chosen family, the Lakers brotherhood spanning decades.

Number 11 is master illuminator. His humanitarian hope: elevate the next generation, teach relentless pursuit of excellence as path to self-actualization.`,
    keyDate: "2016-2020",
    numerology: "11 = Master vision, community through inspiration",
    color: "from-indigo-500 to-purple-500"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden Enemies, Spirituality & Endings",
    ruler: "Neptune / Jupiter",
    storyTitle: "The Spiritual Warrior",
    content: `The 12th House rules secrets, spirituality, hidden realms. For Kobe, it's meditation practices, visualization techniques, the mental game beyond the physical. Studies of psychology, philosophy—the hidden preparation.

Spirituality through competition—basketball as meditation, flow states as transcendence. The secret: his greatness came from unseen hours, private struggles, spiritual discipline masked by public bravado.

Ending: January 26, 2020. The 12th House mystery—why? The fog, the crash. But also: the ending that secured eternity. Some souls transcend death through legacy.`,
    keyDate: "2020",
    numerology: "12/3 = Spiritual sacrifice, hidden wisdom, eternal completion",
    color: "from-violet-600 to-purple-900"
  }
];

export default function HouseHuntKobe() {
  return (
    <HouseStoryViewer 
      houses={KOBE_HOUSES}
      personName="Kobe Bryant"
      lifePath="38/11"
      birthDate="August 23, 1978"
      deathDate="January 26, 2020"
      zodiac="Leo"
    />
  );
}