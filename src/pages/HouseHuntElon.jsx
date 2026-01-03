import React from 'react';
import { Rocket, Coins, Scroll, Home, Star, Briefcase, Users, Skull, Globe, Crown, Heart, Eye } from 'lucide-react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';

const ELON_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: Rocket,
    theme: "Identity & First Impressions",
    ruler: "Mars",
    storyTitle: "The Pretoria Prodigy",
    content: `Young Elon stood in Pretoria's dusty yards at age ten, his mind racing faster than the games he coded on his Commodore VIC-20, eyes fixed on horizons no one else glimpsed. Born to Errol, an electromechanical engineer with emerald mine stakes, and Maye, a model and dietitian of Canadian roots, he navigated a fractured family—divorce at nine imprinting resilience.

From the start, his identity mirrored Cancer's crab: the intuitive protector shelling bold visions, versus the hidden dreamer intuiting future waves. He sold his first game, Blastar, at twelve for $500, projecting precocious genius while enduring bullying for his introversion.

By Stanford in 1995 (briefly, before dropping out), Elon's persona crystallized: the visionary entrepreneur who projects audacious confidence while the world mistakes it for madness.`,
    keyDate: "June 28, 1971",
    numerology: "6+2+8+1+9+7+1 = 34/7 - The Intuitive Seeker",
    color: "from-red-500 to-orange-500"
  },
  {
    house: 2,
    name: "House of Values",
    icon: Coins,
    theme: "Money, Possessions & Self-Worth",
    ruler: "Venus",
    storyTitle: "Market Fortunes",
    content: `Elon Musk landed in California in 1995 with $2,000 and a vision that would forge billions. Silicon Valley's tech scene thrummed differently than Pretoria's mines, but to Elon's eyes, it was the same opportunity: digital frontiers ripe for conquest.

His early ventures were bold. Zip2, founded 1995, sold for $307 million in 1999. He valued disruption over comfort, reinvesting into X.com, merging into PayPal—sold to eBay in 2002 for $1.5 billion.

For Elon, this wasn't greed—it was fuel. If innovation drove progress, then wealth was the rocket propellant, proving ideas through scale.`,
    keyDate: "1999-2002",
    numerology: "2 = Duality, partnerships - merging ventures into PayPal's harmony",
    color: "from-green-500 to-emerald-500"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: Scroll,
    theme: "Speech, Writing & Ideas",
    ruler: "Mercury",
    storyTitle: "Coded Forecasts",
    content: `House 3 is Mercury's swift realm—communication, intellect, transmission. For Elon Musk, this house wasn't about chit-chat; it was about ignition—tweets as sparks, interviews as oracles, with veiled prophecies beneath the memes.

In 2000, amid PayPal battles, he communicated vision crisply, forecasting online finance's rise. But mastery came with Twitter (now X), acquired 2022—a platform for cryptic pronouncements: "Doge to the moon?" in 2021, spiking crypto.

Number 3 represents expression, creative prophecy—the messenger's spark. Mercury adds agility: truth tweeted slant, wisdom in memes.`,
    keyDate: "2021-2022",
    numerology: "3 = Expression, the herald who disrupts with words",
    color: "from-yellow-500 to-amber-500"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Family, Roots & Foundation",
    ruler: "Moon",
    storyTitle: "Pretoria Foundations",
    content: `The Fourth House is the moon's veiled sanctum—private essence, ancestral whispers. For Elon Musk, uprooted from Pretoria to global stages, this house held paradox: turbulent foundations birthing boundless drive, yet shadowed by familial rifts.

Errol's engineering legacy and Maye's resilience formed modest altars, divorce at nine instilling self-reliance. From 1971-1989, these havens blended adventure with strife, South African ties echoing in bold risks.

Cancer's shell protected visionary core. The square's geometry mirrored disciplined origins birthing infinite orbits.`,
    keyDate: "1971-1989",
    numerology: "4 = Structure, the quadrate base fueling expansion",
    color: "from-amber-600 to-yellow-600"
  },
  {
    house: 5,
    name: "House of Creativity",
    icon: Star,
    theme: "Romance, Children & Self-Expression",
    ruler: "Sun",
    storyTitle: "Innovative Methods",
    content: `The Fifth House is Leo's forge—creative flames, daring gambles, romantic passions. For Elon, it roared in inventions, channeling ardor into empires.

Founded X.com 1999, risking all on digital finance. Romances: First marriage 2000, six children total blending joy with complexity. Tesla CEO 2008, electric visions as alchemical risks.

Number 5 evokes adventure, liberated creation—Leo's blaze in Cancer's shell. Elon wagered ideas like stellar bets, rationality veiling passionate fires.`,
    keyDate: "1999-2008",
    numerology: "5 = Adventure, creative risk, the gambler who dreams",
    color: "from-pink-500 to-rose-500"
  },
  {
    house: 6,
    name: "House of Service",
    icon: Briefcase,
    theme: "Work, Health & Daily Routine",
    ruler: "Mercury",
    storyTitle: "Daily Charts",
    content: `House 6 is Virgo's workshop—daily rites, service, wellness. Elon's cadence: relentless hours at Tesla/SpaceX, dissecting problems like arcane puzzles.

The 100-hour work weeks. Sleeping on factory floors. Health scares: 2017 exhaustion. Service in innovations, illuminating humanity's path through sustainable energy and space exploration.

Number 6 mandates devoted harmony, routines as offerings. His daily grind became a ritual of disruption, serving the future.`,
    keyDate: "2008-2020",
    numerology: "6 = Service, duty, work as sacred ritual",
    color: "from-blue-500 to-indigo-500"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Marriage, Allies & Open Enemies",
    ruler: "Venus",
    storyTitle: "Allies and Rivals",
    content: `House 7 is Libra's scale—alliances, adversaries. Marriages: Talulah Riley twice, Grimes. Partners like JB Straubel at Tesla, Gwynne Shotwell at SpaceX.

Rivals: Legacy auto giants, short-sellers, media critics. But fruitful tensions—competition as fuel for innovation.

Number 7 whispers mystic ties, intellectual pacts. His partnerships reflected duality: collaboration and controversy, allies who mirror his vision.`,
    keyDate: "2000-Present",
    numerology: "7 = Partnerships as mirrors, allies and adversaries",
    color: "from-purple-500 to-violet-500"
  },
  {
    house: 8,
    name: "House of Death",
    icon: Skull,
    theme: "Transformation, Mystery & Shared Resources",
    ruler: "Pluto / Mars",
    storyTitle: "Transforming Systems",
    content: `The 8th House rules death, transformation, and rebirth. For Elon, it manifests not as physical death but as the death of old systems.

Bankruptcy brushes: Tesla near-death 2008, SpaceX's three failed launches before the fourth succeeded. Each near-death birthed resurrection. Funding through investor capital, government contracts—other people's resources fueling revolutionary transformations.

The 8th House transformation: killing fossil fuel dependency, traditional space industry, old Twitter. Phoenix rising from ashes, repeatedly.`,
    keyDate: "2008",
    numerology: "8 = Transformation, death and rebirth of industries",
    color: "from-slate-700 to-gray-900"
  },
  {
    house: 9,
    name: "House of Foreign Lands",
    icon: Globe,
    theme: "Travel, Philosophy & Higher Learning",
    ruler: "Jupiter",
    storyTitle: "Multi-Planetary Philosophy",
    content: `The 9th House governs foreign lands, philosophy, and expansion. For Elon, it's literal: making humanity multi-planetary.

From South Africa to Canada to America to Mars (aspirationally)—his philosophy transcends borders. SpaceX missions, Starship development, Mars colonization plans. The 9th House philosopher-king who believes life must expand beyond one planet.

Higher learning through first principles thinking. Foreign lands become foreign worlds. The ultimate 9th House expression.`,
    keyDate: "2002-Present",
    numerology: "9 = Universal expansion, wisdom, foreign horizons",
    color: "from-teal-500 to-cyan-500"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Crown,
    theme: "Public Image, Legacy & Achievement",
    ruler: "Saturn",
    storyTitle: "The Public Disruptor",
    content: `The 10th House is our public legacy—how history remembers us. For Elon, it's the billionaire innovator, the controversial genius, the meme lord CEO.

CEO of Tesla, SpaceX, owner of X (Twitter). His 10th House achievement: reshaping multiple industries simultaneously while maintaining maximum visibility. Time Person of the Year 2021. Most followed account on his own platform.

His public image is polarizing by design—Cancer's protective shell versus Gemini's verbal sparring. But legacy is undeniable: electric cars mainstream, private space travel real, global conversations owned.`,
    keyDate: "2008-Present",
    numerology: "10/1 = New beginnings, pioneering, leadership through disruption",
    color: "from-amber-500 to-yellow-500"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden Enemies, Spirituality & Endings",
    ruler: "Neptune / Jupiter",
    storyTitle: "The Hidden Seeker",
    content: `The 12th House rules secrets, hidden enemies, and the spiritual. For Elon, it whispers in encrypted communications, AI concerns, simulation theories.

Hidden enemies: regulators, competitors, media. But also hidden spirituality: "We're probably in a simulation" philosophy, DMT experiences mentioned, the 7 Life Path's mystical seeking behind the engineer's mask.

The 12th House secret: beneath the rockets and memes lies a seeker questioning reality's source code, a Cancer intuitive masking existential wonder with technological ambition.`,
    keyDate: "Present",
    numerology: "12/3 = The sacrifice, hidden wisdom, spiritual completion",
    color: "from-violet-600 to-purple-900"
  }
];

export default function HouseHuntElon() {
  return (
    <HouseStoryViewer 
      houses={ELON_HOUSES}
      personName="Elon Musk"
      lifePath="34/7"
      birthDate="June 28, 1971"
      deathDate={null}
      zodiac="Cancer"
    />
  );
}