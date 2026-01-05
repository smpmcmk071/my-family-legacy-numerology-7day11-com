import React from 'react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';
import { BookOpen, DollarSign, MessageSquare, Home, Palette, Briefcase, Users, Skull, Globe, Trophy, Network, Eye } from 'lucide-react';

const DAHL_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: BookOpen,
    theme: "Identity & Beginnings",
    ruler: "Mars",
    storyTitle: "The Welsh Wonder Kid",
    content: "Born September 13, 1916 in Llandaff, Wales, Roald Dahl's 1st House brimmed with adventurous spirit from Norwegian roots.\n\nA tall tale-spinner who loved pranks. What magical mischief started it all?",
    keyDate: "September 13, 1916",
    numerology: "9+1+3+1+9+1+6 = 30/3 - Creative charmer",
    color: "from-red-500 to-orange-600"
  },
  {
    house: 2,
    name: "House of Values",
    icon: DollarSign,
    theme: "Resources & Worth",
    ruler: "Venus",
    storyTitle: "Treasure of Tall Tales",
    content: "Dahl's 2nd House collected chocolate inspirations and wartime stories for wealth in words.\n\nValued imagination over gold, gifting books to kids. Hidden candy bars?",
    keyDate: "1964 Charlie",
    numerology: "2 = Balanced fantasies",
    color: "from-green-500 to-emerald-600"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: MessageSquare,
    theme: "Expression & Learning",
    ruler: "Mercury",
    storyTitle: "Wordy Wizard Whispers",
    content: "Dahl's 3rd House crafted quirky stories like 'James and the Giant Peach' for children's cheers.\n\nGremlins and giants in print. Secret spells in his sentences?",
    keyDate: "1961 James",
    numerology: "3 = Expressive enchantment",
    color: "from-yellow-500 to-amber-600"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Roots & Family",
    ruler: "Moon",
    storyTitle: "Cozy Cabin Clan",
    content: "Dahl's 4th House: Lost sister and father young, boarding school blues.\n\nBuilt family with five kids. Roots in wonder?",
    keyDate: "1916-1925",
    numerology: "4 = Sturdy story hut",
    color: "from-blue-500 to-cyan-600"
  },
  {
    house: 5,
    name: "House of Pleasure",
    icon: Palette,
    theme: "Creativity & Joy",
    ruler: "Sun",
    storyTitle: "Playful Plot Twists",
    content: "Dahl's 5th House: Fathered fabulous fables and five children with Patricia.\n\nRomantic adventures in two marriages. Creative capers galore!",
    keyDate: "1953 Marriage",
    numerology: "5 = Adventurous antics",
    color: "from-purple-500 to-pink-600"
  },
  {
    house: 6,
    name: "House of Health",
    icon: Briefcase,
    theme: "Service & Daily Life",
    ruler: "Mercury",
    storyTitle: "Daily Dream Duty",
    content: "Dahl's 6th House: RAF pilot in WWII, crashed but created.\n\nHealth battles for family. Routine of rhyming remedies?",
    keyDate: "1939 WWII",
    numerology: "6 = Helpful hijinks",
    color: "from-teal-500 to-green-600"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Relationships & Others",
    ruler: "Venus",
    storyTitle: "Partner Prank Pals",
    content: "Dahl's 7th House: Marriages to Patricia and Felicity, collaborators in chaos.\n\nRivals in reviews, but friends in fantasy. Alliances with illustrators?",
    keyDate: "1983 Second Marriage",
    numerology: "7 = Mystic mates",
    color: "from-pink-500 to-rose-600"
  },
  {
    house: 8,
    name: "House of Transformation",
    icon: Skull,
    theme: "Death & Rebirth",
    ruler: "Pluto",
    storyTitle: "Final Fantastic Fade",
    content: "Dahl's 8th House: Died November 23, 1990 in Oxford.\n\nTransformation into timeless tomes. Secrets in his last scribbles?",
    keyDate: "November 23, 1990",
    numerology: "1+1+2+3+1+9+9+0 = 26/8 - Powerful potion",
    color: "from-gray-700 to-slate-800"
  },
  {
    house: 9,
    name: "House of Philosophy",
    icon: Globe,
    theme: "Wisdom & Travel",
    ruler: "Jupiter",
    storyTitle: "Global Goblin Globetrot",
    content: "Dahl's 9th House: Africa work, WWII travels inspired tales.\n\nPhilosophy of fun fears. Worldwide wonders?",
    keyDate: "1934 Africa",
    numerology: "9 = Universal uproar",
    color: "from-indigo-500 to-blue-600"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Trophy,
    theme: "Status & Achievement",
    ruler: "Saturn",
    storyTitle: "Fable Fame King",
    content: "Dahl's 10th House: Bestsellers, movies like Willy Wonka.\n\nLegacy in laughter. Hidden honors?",
    keyDate: "1971 Wonka",
    numerology: "10/1 = Public prankster",
    color: "from-amber-500 to-yellow-600"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Network,
    theme: "Friends & Vision",
    ruler: "Uranus",
    storyTitle: "Kid Kingdom Crew",
    content: "Dahl's 11th House: Inspired young minds worldwide.\n\nHumanitarian through hospitals. Secret goblin guild?",
    keyDate: "1980s",
    numerology: "11 = Master magic",
    color: "from-cyan-500 to-teal-600"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden & Spiritual",
    ruler: "Neptune",
    storyTitle: "Dreamy Depth Delights",
    content: "Dahl's 12th House: Dark twists in sweet stories.\n\nEndings with eternal enchantment. What whimsical whispers?",
    keyDate: "1990",
    numerology: "12/3 - Karmic chuckles",
    color: "from-purple-700 to-indigo-800"
  }
];

export default function HouseHuntDahl() {
  return (
    <HouseStoryViewer
      houses={DAHL_HOUSES}
      personName="Roald Dahl"
      lifePath="30/3"
      birthDate="September 13, 1916"
      deathDate="November 23, 1990"
      zodiac="Virgo"
    />
  );
}