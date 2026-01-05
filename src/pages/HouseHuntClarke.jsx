import React from 'react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';
import { BookOpen, DollarSign, MessageSquare, Home, Palette, Briefcase, Users, Skull, Globe, Trophy, Network, Eye } from 'lucide-react';

const CLARKE_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: BookOpen,
    theme: "Identity & Beginnings",
    ruler: "Mars",
    storyTitle: "The Farm Boy Dreamer",
    content: "Born December 16, 1917 in Minehead, England, Arthur C. Clarke's 1st House envisioned space from rural fields.\n\nRadar pioneer in WWII. Sagittarius vision + Jupiter expansion = cosmic scope. Identity as sci-fi prophet—what celestial calling?\n\n🔮 Tarot: The Magician (manifest possibilities) • Astrology: Sagittarius Sun (archer aiming at stars), Jupiter (expansion)",
    keyDate: "December 16, 1917",
    numerology: "1+2+1+6+1+9+1+7 = 28/10/1 - Independent visionary • Birth Number 7, Destiny 1",
    color: "from-red-500 to-orange-600"
  },
  {
    house: 2,
    name: "House of Values",
    icon: DollarSign,
    theme: "Resources & Worth",
    ruler: "Venus",
    storyTitle: "Idea Collector",
    content: "Clarke's 2nd House: Modest means, but rich in concepts like geostationary satellites 1945.\n\nValued exploration. Royalties funded Sri Lanka home. Satellite paper predicted orbit at 22,236 miles—synchronous with Earth's 24-hour sacred cycle.\n\n🔮 Tarot: The Hermit (valuable solitude) • Prediction: Geostationary orbit became reality (prophecy = 19/1)",
    keyDate: "1945 Satellite Paper",
    numerology: "2 = Visionary ideas create wealth • 1945 = 19/1 (prophecy becomes reality)",
    color: "from-green-500 to-emerald-600"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: MessageSquare,
    theme: "Expression & Learning",
    ruler: "Mercury",
    storyTitle: "Prophetic Pen",
    content: "Clarke's 3rd House: 'Childhood's End' 1953, predicted tech.\n\nScripts for 2001: A Space Odyssey 1968. Words from future?",
    keyDate: "1968 2001",
    numerology: "3 = Imaginative expression",
    color: "from-yellow-500 to-amber-600"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Roots & Family",
    ruler: "Moon",
    storyTitle: "Somerset Roots",
    content: "Clarke's 4th House: Farm family, moved to London 1936.\n\nSettled in Sri Lanka 1956. Foundations in stars.",
    keyDate: "1917-1936",
    numerology: "4 = Global home",
    color: "from-blue-500 to-cyan-600"
  },
  {
    house: 5,
    name: "House of Pleasure",
    icon: Palette,
    theme: "Creativity & Joy",
    ruler: "Sun",
    storyTitle: "Creative Cosmos",
    content: "Clarke's 5th House: No children, but fathered ideas like space elevators.\n\nRomantic life private. Playful in underwater explorations.",
    keyDate: "1979 Fountains",
    numerology: "5 = Adventurous creativity",
    color: "from-purple-500 to-pink-600"
  },
  {
    house: 6,
    name: "House of Health",
    icon: Briefcase,
    theme: "Service & Daily Life",
    ruler: "Mercury",
    storyTitle: "Technical Servant",
    content: "Clarke's 6th House: RAF radar work WWII.\n\nHealth: Post-polio from 1962. Daily writing routine.",
    keyDate: "1940s WWII",
    numerology: "6 = Dedicated futurism",
    color: "from-teal-500 to-green-600"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Relationships & Others",
    ruler: "Venus",
    storyTitle: "Collaborative Stars",
    content: "Clarke's 7th House: Marriage to Marilyn 1953-1964.\n\nPartnership with Kubrick on 2001. Alliances across oceans.",
    keyDate: "1964 Divorce",
    numerology: "7 = Mystic bonds",
    color: "from-pink-500 to-rose-600"
  },
  {
    house: 8,
    name: "House of Transformation",
    icon: Skull,
    theme: "Death & Rebirth",
    ruler: "Pluto",
    storyTitle: "Serene Departure",
    content: "Clarke's 8th House: Died March 19, 2008 in Sri Lanka.\n\nTransformation: Knighted 1998. Secrets in unpublished works?",
    keyDate: "March 19, 2008",
    numerology: "3+1+9+2+0+0+8 = 23/5 - Liberated end",
    color: "from-gray-700 to-slate-800"
  },
  {
    house: 9,
    name: "House of Philosophy",
    icon: Globe,
    theme: "Wisdom & Travel",
    ruler: "Jupiter",
    storyTitle: "Island Exile",
    content: "Clarke's 9th House: Moved to Sri Lanka 1956 (5+6=11 master number)—cosmic retreat for wisdom.\n\nPhilosophy: Clarke's Three Laws encode numerology: 1=New vision, 2=Gradual acceptance, 3=Indistinguishable from magic. Survived 2004 tsunami (age 87=15/6).\n\n🔮 Three Laws: Technology prophecy hidden in sacred triad",
    keyDate: "1956 Sri Lanka",
    numerology: "9 = Universal explorer • 1956 = 21/3 (creative expression)",
    color: "from-indigo-500 to-blue-600"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Trophy,
    theme: "Status & Achievement",
    ruler: "Saturn",
    storyTitle: "Sci-Fi Sage",
    content: "Clarke's 10th House: CBE 1989, asteroid named after him.\n\nLegacy: Predicted internet, GPS.",
    keyDate: "1989 CBE",
    numerology: "10/1 = Public prophet",
    color: "from-amber-500 to-yellow-600"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Network,
    theme: "Friends & Vision",
    ruler: "Uranus",
    storyTitle: "Space Advocates",
    content: "Clarke's 11th House: British Interplanetary Society.\n\nHumanitarian space vision. Hidden networks?",
    keyDate: "1930s BIS",
    numerology: "11 = Master futurist",
    color: "from-cyan-500 to-teal-600"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden & Spiritual",
    ruler: "Neptune",
    storyTitle: "Cosmic Mysteries",
    content: "Clarke's 12th House: Atheist with wonder, tsunami survivor 2004.\n\nEndings peaceful. What infinite secrets?",
    keyDate: "2008",
    numerology: "12/3 - Karmic wonder",
    color: "from-purple-700 to-indigo-800"
  }
];

export default function HouseHuntClarke() {
  return (
    <HouseStoryViewer
      houses={CLARKE_HOUSES}
      personName="Arthur C. Clarke"
      lifePath="28/10/1"
      birthDate="December 16, 1917"
      deathDate="March 19, 2008"
      zodiac="Sagittarius"
    />
  );
}