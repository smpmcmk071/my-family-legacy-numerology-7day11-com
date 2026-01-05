import React from 'react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';
import { BookOpen, DollarSign, MessageSquare, Home, Palette, Briefcase, Users, Skull, Globe, Trophy, Network, Eye } from 'lucide-react';

const SEUSS_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: BookOpen,
    theme: "Identity & Beginnings",
    ruler: "Mars",
    storyTitle: "The Springfield Sprout",
    content: "Born March 2, 1904 in Springfield, Massachusetts, Dr. Seuss's 1st House sparkled with silly imagination from a young age, drawing doodles and dreaming up nonsense.\n\nA tall tale-teller who turned 'Seuss' into magic. But what wacky wonder sparked his first rhyme?",
    keyDate: "March 2, 1904",
    numerology: "3+2+1+9+0+4 = 19/10/1 - Independent imaginer",
    color: "from-red-500 to-orange-600"
  },
  {
    house: 2,
    name: "House of Values",
    icon: DollarSign,
    theme: "Resources & Worth",
    ruler: "Venus",
    storyTitle: "Treasure of Tales",
    content: "Dr. Seuss's 2nd House held heaps of humorous books, earning smiles and sales from 'Cat in the Hat' onwards.\n\nHe valued fun over fortune, sharing stories with kids everywhere. Hidden giggles in his piggy bank?",
    keyDate: "1957 Cat in the Hat",
    numerology: "2 = Balanced whimsy",
    color: "from-green-500 to-emerald-600"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: MessageSquare,
    theme: "Expression & Learning",
    ruler: "Mercury",
    storyTitle: "Rhyme Time Chatter",
    content: "Dr. Seuss's 3rd House bubbled with bouncy words, writing 'Green Eggs and Ham' with just 50 words!\n\nCartoons and books chatted to children. Secret silly messages in his verses?",
    keyDate: "1960 Green Eggs",
    numerology: "3 = Playful expression",
    color: "from-yellow-500 to-amber-600"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Roots & Family",
    ruler: "Moon",
    storyTitle: "Cozy Family Nook",
    content: "Dr. Seuss's 4th House rooted in a brewery family, but Prohibition turned it to fun tales instead.\n\nNo kids of his own, but a home full of imagination. Family fun in every page?",
    keyDate: "1904-1921",
    numerology: "4 = Sturdy story base",
    color: "from-blue-500 to-cyan-600"
  },
  {
    house: 5,
    name: "House of Pleasure",
    icon: Palette,
    theme: "Creativity & Joy",
    ruler: "Sun",
    storyTitle: "Playful Pencil Adventures",
    content: "Dr. Seuss's 5th House created colorful characters like Horton and the Grinch for kids' delight.\n\nRomantic rhymes with Helen, then Audrey. Creative capers in every book!",
    keyDate: "1927 Marriage",
    numerology: "5 = Fun-filled creativity",
    color: "from-purple-500 to-pink-600"
  },
  {
    house: 6,
    name: "House of Health",
    icon: Briefcase,
    theme: "Service & Daily Life",
    ruler: "Mercury",
    storyTitle: "Daily Doodle Duty",
    content: "Dr. Seuss's 6th House involved army cartoons in WWII and health messages in books.\n\nRoutine of rhyming for reading help. Whimsical work for little learners?",
    keyDate: "1940s WWII",
    numerology: "6 = Helpful hilarity",
    color: "from-teal-500 to-green-600"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Relationships & Others",
    ruler: "Venus",
    storyTitle: "Partner Playmates",
    content: "Dr. Seuss's 7th House: Marriages to Helen and Audrey, collaborators in creativity.\n\nFew foes, but fun with friends in publishing. Alliances in absurdity?",
    keyDate: "1968 Second Marriage",
    numerology: "7 = Mystic mates",
    color: "from-pink-500 to-rose-600"
  },
  {
    house: 8,
    name: "House of Transformation",
    icon: Skull,
    theme: "Death & Rebirth",
    ruler: "Pluto",
    storyTitle: "Final Funny Flip",
    content: "Dr. Seuss's 8th House: Passed September 24, 1991 in La Jolla.\n\nTransformation into timeless tales. Secrets in his last laughs?",
    keyDate: "September 24, 1991",
    numerology: "9+2+4+1+9+9+1 = 35/8 - Powerful punchline",
    color: "from-gray-700 to-slate-800"
  },
  {
    house: 9,
    name: "House of Philosophy",
    icon: Globe,
    theme: "Wisdom & Travel",
    ruler: "Jupiter",
    storyTitle: "Worldwide Wacky Wanders",
    content: "Dr. Seuss's 9th House: Traveled ideas to kids globally, with morals like environmentalism in 'The Lorax'.\n\nPhilosophy of fun learning. Universal giggles?",
    keyDate: "1971 Lorax",
    numerology: "9 = Global goofiness",
    color: "from-indigo-500 to-blue-600"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Trophy,
    theme: "Status & Achievement",
    ruler: "Saturn",
    storyTitle: "Story Star Supreme",
    content: "Dr. Seuss's 10th House: Pulitzer Prize 1984, millions of books sold.\n\nLegacy in literacy. Hidden honors?",
    keyDate: "1984 Pulitzer",
    numerology: "10/1 = Public prankster",
    color: "from-amber-500 to-yellow-600"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Network,
    theme: "Friends & Vision",
    ruler: "Uranus",
    storyTitle: "Kid Crew Companions",
    content: "Dr. Seuss's 11th House: Inspired generations of readers and writers.\n\nHumanitarian through education. Secret society of sillies?",
    keyDate: "1950s-1980s",
    numerology: "11 = Master mischief",
    color: "from-cyan-500 to-teal-600"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden & Spiritual",
    ruler: "Neptune",
    storyTitle: "Dreamy Doodle Depths",
    content: "Dr. Seuss's 12th House: Private paintings and unpublished works.\n\nEndings with eternal fun. What whimsical wonders within?",
    keyDate: "1991",
    numerology: "12/3 - Karmic chuckles",
    color: "from-purple-700 to-indigo-800"
  }
];

export default function HouseHuntSeuss() {
  return (
    <HouseStoryViewer
      houses={SEUSS_HOUSES}
      personName="Dr. Seuss"
      lifePath="19/10/1"
      birthDate="March 2, 1904"
      deathDate="September 24, 1991"
      zodiac="Pisces"
    />
  );
}