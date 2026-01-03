import React from 'react';
import { Crown, Coins, Scroll, Home, Star, Sword, Users, Skull, Globe, Eye } from 'lucide-react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';

const MEAGHER_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: Crown,
    theme: "Identity & First Impressions",
    ruler: "Mars",
    rulerSymbol: "♂",
    storyTitle: "The Young Lion of Ireland",
    content: `Born August 3, 1823 in Waterford, Ireland, Thomas emerged as a natural leader from birth. His 1st House energy was unmistakable - bold, charismatic, impossible to ignore.

Even as a young man, he commanded attention. His presence filled rooms. When he spoke, people listened. This is pure 1st House power - the projection of self into the world.`,
    keyDate: "August 3, 1823",
    numerology: "8+3+1+8+2+3 = 25/7 Life Path - The Seeker of Truth",
    color: "from-red-500 to-orange-500"
  },
  {
    house: 2,
    name: "House of Values",
    icon: Coins,
    theme: "Money, Possessions & Self-Worth",
    ruler: "Venus",
    rulerSymbol: "♀",
    storyTitle: "The Merchant's Son",
    content: `Thomas was born to wealth - his father was a successful merchant and mayor of Waterford. He never wanted for material comfort.

But his 2nd House lesson wasn't about keeping wealth - it was about what he truly valued. He would eventually sacrifice his inheritance, his comfort, and his homeland for his beliefs. His self-worth came not from gold, but from principle.`,
    keyDate: "1823-1843",
    numerology: "Born into a 2 vibration household - partnership, diplomacy",
    color: "from-green-500 to-emerald-500"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: Scroll,
    theme: "Speech, Writing & Ideas",
    ruler: "Mercury",
    rulerSymbol: "☿",
    storyTitle: "Meagher of the Sword",
    content: `This was Thomas's superpower. His 3rd House blazed with fire.

On July 28, 1846, he delivered his legendary "Sword Speech" that earned him his famous nickname. He declared: "The soldier is proof that a nation has not lost its self-respect."

The British called it treason. The Irish called it poetry. It was pure 3rd House mastery - the power to move nations with words.`,
    keyDate: "July 28, 1846",
    numerology: "7+2+8+1+8+4+6 = 36/9 - Universal voice, humanitarian message",
    color: "from-yellow-500 to-amber-500"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Family, Roots & Foundation",
    ruler: "Moon",
    rulerSymbol: "☽",
    storyTitle: "Ireland in His Heart",
    content: `The 4th House represents our roots, our homeland, the foundation of who we are.

For Thomas, Ireland wasn't just where he was born - it was his very identity. His entire life's mission was to free his homeland. Even exiled to the other side of the world, even fighting in American wars, Ireland remained his 4th House anchor.

He would never see home again.`,
    keyDate: "1848 - Exile",
    numerology: "1+8+4+8 = 21/3 - Creative expression through sacrifice",
    color: "from-amber-600 to-yellow-600"
  },
  {
    house: 5,
    name: "House of Creativity",
    icon: Star,
    theme: "Romance, Children & Self-Expression",
    ruler: "Sun",
    rulerSymbol: "☉",
    storyTitle: "Love in Exile",
    content: `In Tasmania, far from everything he knew, Thomas found love. He married Catherine Bennett in 1851, and they had a son.

But 5th House joy often comes with 5th House heartbreak. Catherine died shortly after childbirth. The creative, romantic energy of this house brought him both his greatest personal joy and deepest personal loss.`,
    keyDate: "February 22, 1851",
    numerology: "2+2+2+1+8+5+1 = 21/3 - The Crown of the Magi appears in love",
    color: "from-pink-500 to-rose-500"
  },
  {
    house: 6,
    name: "House of Service",
    icon: Sword,
    theme: "Work, Health & Daily Routine",
    ruler: "Mercury",
    rulerSymbol: "☿",
    storyTitle: "The General",
    content: `When the American Civil War erupted, Thomas found his 6th House calling - service through action.

He formed the famous Irish Brigade of the Union Army, leading men into some of the war's bloodiest battles: Antietam, Fredericksburg, Chancellorsville. His daily work became leading men, his service became sacrifice.

Over 4,000 of his men would fall in battle.`,
    keyDate: "1861-1865",
    numerology: "6 = Responsibility, duty, sacrifice for others",
    color: "from-blue-500 to-indigo-500"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Marriage, Allies & Open Enemies",
    ruler: "Venus",
    rulerSymbol: "♀",
    storyTitle: "Allies and Enemies",
    content: `The 7th House governs our relationships - both allies and open enemies.

Thomas had powerful allies: the Young Irelanders, President Lincoln, his devoted soldiers. But he also had powerful enemies: the British Crown sentenced him to death, Confederate forces tried to kill him, and in Montana, vigilantes despised his presence.

The 7th House asks: Who stands with you? Who against you?`,
    keyDate: "1848-1867",
    numerology: "7 = The Seeker, but also opposition and legal battles",
    color: "from-purple-500 to-violet-500"
  },
  {
    house: 8,
    name: "House of Death",
    icon: Skull,
    theme: "Transformation, Mystery & Other People's Resources",
    ruler: "Pluto / Mars",
    rulerSymbol: "♇",
    storyTitle: "The Final Mystery",
    content: `The 8th House rules death, secrets, and transformation. For Thomas, it would prove hauntingly literal.

On July 1, 1867, Thomas Francis Meagher fell from a steamboat into the Missouri River at Fort Benton, Montana. His body was never recovered.

Was it an accident? Suicide? Murder by vigilantes? The 8th House keeps its secrets.`,
    keyDate: "July 1, 1867",
    numerology: "7+1+1+8+6+7 = 30/3... but also 12/3 - The Sacrifice Number",
    color: "from-slate-700 to-gray-900"
  },
  {
    house: 9,
    name: "House of Foreign Lands",
    icon: Globe,
    theme: "Travel, Philosophy & Higher Learning",
    ruler: "Jupiter",
    rulerSymbol: "♃",
    storyTitle: "Exile Across the World",
    content: `The 9th House governs foreign lands, long journeys, and expansion of consciousness. Thomas lived this house dramatically.

From Ireland to Tasmania (exile), to New York, to the battlefields of Virginia, to the frontier of Montana - his life was one long 9th House journey. Each land transformed him, yet he carried Ireland in his soul across every ocean.`,
    keyDate: "1849-1867",
    numerology: "9 = Completion, universal experience, the worldly soul",
    color: "from-teal-500 to-cyan-500"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Crown,
    theme: "Public Image, Legacy & Achievement",
    ruler: "Saturn",
    rulerSymbol: "♄",
    storyTitle: "Governor of Montana",
    content: `The 10th House is our public legacy - how history remembers us.

Thomas became Acting Governor of Montana Territory in 1866. A revolutionary, an exile, a general - now a statesman. His 10th House achievement placed him among America's most remarkable immigrant stories.

Today, his statue stands in both Ireland and Montana. His legacy endures.`,
    keyDate: "1866",
    numerology: "1+8+6+6 = 21/3 - The Crown of the Magi in public achievement",
    color: "from-amber-500 to-yellow-500"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Users,
    theme: "Groups, Friends & Humanitarian Vision",
    ruler: "Uranus / Saturn",
    rulerSymbol: "♅",
    storyTitle: "The Irish Brigade",
    content: `The 11th House governs groups, communities, and our hopes for humanity.

Thomas's Irish Brigade wasn't just a military unit - it was a community of exiles fighting for their adopted country while dreaming of their homeland. 11 is the master number of vision, and Thomas gave Irish immigrants a vision of belonging.

His humanitarian hope: freedom for all oppressed peoples.`,
    keyDate: "1861",
    numerology: "11 = Master Visionary, illumination, spiritual warrior",
    color: "from-indigo-500 to-purple-500"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden Enemies, Spirituality & Endings",
    ruler: "Neptune / Jupiter",
    rulerSymbol: "♆",
    storyTitle: "Conspiracy and Mystery",
    content: `The 12th House rules hidden enemies, secrets, and the unconscious. It's where our story dissolves into mystery.

Who killed Thomas Meagher? The vigilantes who opposed him? Political enemies? Or was it truly an accident? The 12th House hides the truth.

His body was never found. The Missouri River became his grave, and the 12th House keeps its silence.

Some souls are not meant to have endings - only legends.`,
    keyDate: "July 1, 1867 - 11:30 PM",
    numerology: "12 = The Sacrifice, the martyr, karma completed",
    color: "from-violet-600 to-purple-900"
  }
];

export default function HouseHuntMeagher() {
  return (
    <HouseStoryViewer 
      houses={MEAGHER_HOUSES}
      personName="Thomas Francis Meagher"
      lifePath="25/7"
      birthDate="August 3, 1823"
      deathDate="July 1, 1867"
      zodiac="Leo"
    />
  );
}