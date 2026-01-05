import React from 'react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';
import { BookOpen, DollarSign, MessageSquare, Home, Palette, Briefcase, Users, Skull, Globe, Trophy, Network, Eye } from 'lucide-react';

const CRICHTON_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: BookOpen,
    theme: "Identity & Beginnings",
    ruler: "Mars",
    storyTitle: "The Tall Prodigy",
    content: "Born October 23, 1942 in Chicago, Michael Crichton's 1st House towered at 6'9\", a Harvard med student turned author.\n\nIdentity as techno-thriller king. But what drove his diverse pursuits?",
    keyDate: "October 23, 1942",
    numerology: "1+0+2+3+1+9+4+2 = 22/4 - Master builder",
    color: "from-red-500 to-orange-600"
  },
  {
    house: 2,
    name: "House of Values",
    icon: DollarSign,
    theme: "Resources & Worth",
    ruler: "Venus",
    storyTitle: "Intellectual Assets",
    content: "Crichton's 2nd House: Med school funded by writing, Jurassic Park millions.\n\nValued ideas; donated to causes. Hidden investments?",
    keyDate: "1966 First Novel",
    numerology: "2 = Balanced talents",
    color: "from-green-500 to-emerald-600"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: MessageSquare,
    theme: "Expression & Learning",
    ruler: "Mercury",
    storyTitle: "Storytelling Surgeon",
    content: "Crichton's 3rd House: 'The Andromeda Strain' 1969, ER creator.\n\nScripts and books blended science/fiction. Coded warnings?",
    keyDate: "1969",
    numerology: "3 = Creative expression",
    color: "from-yellow-500 to-amber-600"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Roots & Family",
    ruler: "Moon",
    storyTitle: "Chicago Foundations",
    content: "Crichton's 4th House: Journalist father, moved to Roslyn.\n\nMultiple marriages, five children. Roots in curiosity.",
    keyDate: "1942-1960",
    numerology: "4 = Structured intellect",
    color: "from-blue-500 to-cyan-600"
  },
  {
    house: 5,
    name: "House of Pleasure",
    icon: Palette,
    theme: "Creativity & Joy",
    ruler: "Sun",
    storyTitle: "Hollywood Creator",
    content: "Crichton's 5th House: Directed Westworld 1973, thrillers like Congo.\n\nRomantic life: Five wives. Creative risks paid off.",
    keyDate: "1973 Westworld",
    numerology: "5 = Adventurous plots",
    color: "from-purple-500 to-pink-600"
  },
  {
    house: 6,
    name: "House of Health",
    icon: Briefcase,
    theme: "Service & Daily Life",
    ruler: "Mercury",
    storyTitle: "Medical Discipline",
    content: "Crichton's 6th House: MD from Harvard 1969, but chose writing.\n\nHealth-focused themes. Daily routine prolific.",
    keyDate: "1969 MD",
    numerology: "6 = Service through stories",
    color: "from-teal-500 to-green-600"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Relationships & Others",
    ruler: "Venus",
    storyTitle: "Collaborative Ventures",
    content: "Crichton's 7th House: Marriages ended in divorce.\n\nPartnerships with Spielberg on Jurassic 1993. Rivalries mild.",
    keyDate: "1993 Jurassic",
    numerology: "7 = Intellectual alliances",
    color: "from-pink-500 to-rose-600"
  },
  {
    house: 8,
    name: "House of Transformation",
    icon: Skull,
    theme: "Death & Rebirth",
    ruler: "Pluto",
    storyTitle: "Unexpected Exit",
    content: "Crichton's 8th House: Died November 4, 2008 from lymphoma.\n\nPrivate battle. Transformation of works posthumous.",
    keyDate: "November 4, 2008",
    numerology: "1+1+4+2+0+0+8 = 16/7 - Mystic end",
    color: "from-gray-700 to-slate-800"
  },
  {
    house: 9,
    name: "House of Philosophy",
    icon: Globe,
    theme: "Wisdom & Travel",
    ruler: "Jupiter",
    storyTitle: "World Explorer",
    content: "Crichton's 9th House: Traveled for research, like Congo 1979.\n\nPhilosophy on science/tech dangers.",
    keyDate: "1979 Congo",
    numerology: "9 = Global themes",
    color: "from-indigo-500 to-blue-600"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Trophy,
    theme: "Status & Achievement",
    ruler: "Saturn",
    storyTitle: "Bestseller Mogul",
    content: "Crichton's 10th House: 200M books sold, ER Emmy.\n\nLegacy in cautionary tales. Climate views controversial.",
    keyDate: "1994 ER",
    numerology: "10/1 = Public warn-er",
    color: "from-amber-500 to-yellow-600"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Network,
    theme: "Friends & Vision",
    ruler: "Uranus",
    storyTitle: "Creative Network",
    content: "Crichton's 11th House: Hollywood friends, tech visionaries.\n\nHumanitarian through education. Hidden influences?",
    keyDate: "2000s",
    numerology: "11 = Master futurist",
    color: "from-cyan-500 to-teal-600"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden & Spiritual",
    ruler: "Neptune",
    storyTitle: "Veiled Warnings",
    content: "Crichton's 12th House: Themes of hubris in tech.\n\nPrivate life guarded. What unspoken fears in his endings?",
    keyDate: "2008",
    numerology: "12/3 - Karmic caution",
    color: "from-purple-700 to-indigo-800"
  }
];

export default function HouseHuntCrichton() {
  return (
    <HouseStoryViewer
      houses={CRICHTON_HOUSES}
      personName="Michael Crichton"
      lifePath="22/4"
      birthDate="October 23, 1942"
      deathDate="November 4, 2008"
      zodiac="Scorpio"
    />
  );
}