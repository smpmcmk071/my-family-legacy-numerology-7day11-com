import React from 'react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';
import { BookOpen, DollarSign, MessageSquare, Home, Palette, Briefcase, Users, Skull, Globe, Trophy, Network, Eye } from 'lucide-react';

const ROWLING_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: BookOpen,
    theme: "Identity & Beginnings",
    ruler: "Mars",
    storyTitle: "The Yate Young Dreamer",
    content: "Born July 31, 1965 in Yate, England, J.K. Rowling's 1st House glowed with storytelling spark from age 6.\n\nLeo creativity + numerology 32/5 (freedom through adventure). SYNCHRONICITY: Harry Potter born same day (7/31/1980)! Karmic soul connection—author and character share birthday.\n\n🔮 Tarot: The Sun (enlightenment, creative power) • Astrology: Leo Sun (royal), 5th House dominant (creativity, children)",
    keyDate: "July 31, 1965",
    numerology: "7+3+1+1+9+6+5 = 32/5 - Adventurous liberator • Birth Number 4, Destiny 5",
    color: "from-red-500 to-orange-600"
  },
  {
    house: 2,
    name: "House of Values",
    icon: DollarSign,
    theme: "Resources & Worth",
    ruler: "Venus",
    storyTitle: "Magic Manuscript Treasures",
    content: "Rowling's 2nd House: From welfare to wizard wealth with Potter sales.\n\nMother's death (December 30, 1990 = 23/5: freedom through loss) triggered Harry creation. Mirror of trauma into fiction. $1B+ but gives to charity.\n\n🔮 Tarot: Wheel of Fortune (destiny fulfilled) • Mother's Death Code: 1990 = 10/1 (new beginning from grief)",
    keyDate: "1997 Philosopher's Stone",
    numerology: "2 = Transformation: rags to riches • 1997 = 26/8 (material foundations)",
    color: "from-green-500 to-emerald-600"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: MessageSquare,
    theme: "Expression & Learning",
    ruler: "Mercury",
    storyTitle: "Spellbinding Scribbles",
    content: "Rowling's 3rd House: Wrote Harry on train (Mercury moment!), series of seven books.\n\n7 = spiritual completion cycle. 7 Horcruxes = 7 chakras inverted—Voldemort's fear of death = root chakra obsession. Platform 9¾ = 9.75 (sacred irrational: transcendence).\n\n🔮 Tarot: The Magician (words manifest worlds) • Seven Sacred: 7 books, 7 years, 7 Horcruxes = Hermetic perfection",
    keyDate: "1990 Idea",
    numerology: "3 = Creative expression • 7 books = sacred completion",
    color: "from-yellow-500 to-amber-600"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Roots & Family",
    ruler: "Moon",
    storyTitle: "Homey Hogwarts Haven",
    content: "Rowling's 4th House: Mother's death inspired themes, family of three kids.\n\nRoots in resilience. Cozy castle foundations?",
    keyDate: "1990 Mother Dies",
    numerology: "4 = Sturdy spells",
    color: "from-blue-500 to-cyan-600"
  },
  {
    house: 5,
    name: "House of Pleasure",
    icon: Palette,
    theme: "Creativity & Joy",
    ruler: "Sun",
    storyTitle: "Creative Cauldron Bubbles",
    content: "Rowling's 5th House: Motherhood to Jessica, David, Mackenzie; Potter kids' adventures.\n\nRomantic restarts. Playful potions in plots!",
    keyDate: "1993 Daughter Born",
    numerology: "5 = Fun-filled fantasies",
    color: "from-purple-500 to-pink-600"
  },
  {
    house: 6,
    name: "House of Health",
    icon: Briefcase,
    theme: "Service & Daily Life",
    ruler: "Mercury",
    storyTitle: "Daily Wand Work",
    content: "Rowling's 6th House: Teacher in Portugal, disciplined drafting.\n\nHealth and help through writing. Routine of runes?",
    keyDate: "1992 Marriage",
    numerology: "6 = Helpful hexes",
    color: "from-teal-500 to-green-600"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Relationships & Others",
    ruler: "Venus",
    storyTitle: "Ally Auror Allies",
    content: "Rowling's 7th House: Two marriages, partnerships with publishers.\n\nControversies as foes. Bonds with bookworms?",
    keyDate: "2001 Second Marriage",
    numerology: "7 = Mystic marriages",
    color: "from-pink-500 to-rose-600"
  },
  {
    house: 8,
    name: "House of Transformation",
    icon: Skull,
    theme: "Death & Rebirth",
    ruler: "Pluto",
    storyTitle: "Transforming Tales",
    content: "Rowling's 8th House: Themes of death in Potter mirror personal losses.\n\nMother's death 1990 → Depression era → Harry born from darkness (1990-1997 = 7 years of gestation). Depression inspired dementors. Transformation to billionaire through shadow work.\n\n🔮 Deathly Hallows: Master of Death = acceptance, not avoidance. Phoenix rises from ashes.",
    keyDate: "2007 Deathly Hallows",
    numerology: "8 = Powerful phoenix • Transformation through grief",
    color: "from-gray-700 to-slate-800"
  },
  {
    house: 9,
    name: "House of Philosophy",
    icon: Globe,
    theme: "Wisdom & Travel",
    ruler: "Jupiter",
    storyTitle: "Global Gryffindor Journeys",
    content: "Rowling's 9th House: Studied in Exeter, travels in tales.\n\nPhilosophy of friendship and courage. Worldwide wands?",
    keyDate: "1986 Graduation",
    numerology: "9 = Universal unicorns",
    color: "from-indigo-500 to-blue-600"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Trophy,
    theme: "Status & Achievement",
    ruler: "Saturn",
    storyTitle: "Potion Master Public",
    content: "Rowling's 10th House: OBE, richest author, Strike series.\n\nLegacy in literacy. Hidden honors?",
    keyDate: "2013 Strike",
    numerology: "10/1 = Public patronus",
    color: "from-amber-500 to-yellow-600"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Network,
    theme: "Friends & Vision",
    ruler: "Uranus",
    storyTitle: "Fan Fellowship Friends",
    content: "Rowling's 11th House: Lumos charity, fan communities.\n\nVision for equality. Secret sorting hats?",
    keyDate: "2000s Charities",
    numerology: "11 = Master muggles",
    color: "from-cyan-500 to-teal-600"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden & Spiritual",
    ruler: "Neptune",
    storyTitle: "Hidden Hallows Mysteries",
    content: "Rowling's 12th House: Depression inspired dementors.\n\nPrivate potions. What wizardly whispers within?",
    keyDate: "Ongoing",
    numerology: "12/3 - Karmic quills",
    color: "from-purple-700 to-indigo-800"
  }
];

export default function HouseHuntRowling() {
  return (
    <HouseStoryViewer
      houses={ROWLING_HOUSES}
      personName="J.K. Rowling"
      lifePath="32/5"
      birthDate="July 31, 1965"
      zodiac="Leo"
    />
  );
}