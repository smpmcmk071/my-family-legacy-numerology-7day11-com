import React from 'react';
import { BookOpen, Coins, Scroll, Home, Star, Briefcase, Users, Skull, Globe, Crown, Eye, Sparkles } from 'lucide-react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';

const ASIMOV_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: BookOpen,
    theme: "Identity & First Impressions",
    ruler: "Mars",
    storyTitle: "The Prodigy Immigrant",
    content: `Young Isaac perched on a stool in the family's Brooklyn candy store at age three, his eyes devouring words while customers haggled over sweets. Born January 2, 1920, in Petrovichi, Russia, amid Bolshevik turmoil, he emigrated in 1923 with parents Judah and Anna Rachel—fleeing poverty for America's promise.

From the start, his identity fractured like Capricorn's sea-goat: the disciplined climber scaling knowledge's peaks, versus the hidden dreamer plumbing imagination's depths. He taught himself reading by five, skipped grades relentlessly, entered Boys High School at twelve.

By Columbia University in 1935, Isaac's persona solidified: the brilliant polymath who projected unassailable rationality. But early agoraphobia hinted at inner shadows—a fear of open spaces mirroring a deeper dread of unbound wonder.`,
    keyDate: "January 2, 1920",
    numerology: "1+2+1+9+2+0 = 15/6 - Responsible healer through knowledge",
    color: "from-red-500 to-orange-500"
  },
  {
    house: 2,
    name: "House of Values",
    icon: Coins,
    theme: "Money, Possessions & Self-Worth",
    ruler: "Venus",
    storyTitle: "Knowledge Hoarder",
    content: `Isaac Asimov arrived in Brooklyn in 1923 with little but his family's resolve, but in the candy stores his parents operated, he unearthed his true fortune: knowledge, hoarded like arcane relics amid the mundane gleam of gumdrops and newspapers.

From childhood, he toiled at the counter, but his real harvest was the pulp magazines he devoured in stolen moments. By 1938, his first published story earned a modest $64, but it seeded the 500+ books that would sustain him—royalties as proof that knowledge transmutes into sustenance.

His wealth measured not in banknotes but in bridged chasms—science demystified for the masses, fiction veiling deeper truths.`,
    keyDate: "1923-1945",
    numerology: "2 = Duality, balance between material and intellectual wealth",
    color: "from-green-500 to-emerald-500"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: Scroll,
    theme: "Speech, Writing & Ideas",
    ruler: "Mercury",
    storyTitle: "Master Wordsmith",
    content: `House 3 is Mercury's mercurial domain. For Isaac Asimov, this wasn't merely about speaking—it was about channeling, translating the universe's vast symphony into accessible notes.

His 1941 story "Nightfall" imagined a planet with multiple suns plunging into darkness—gripping sci-fi on the surface, but deeper: a coded oracle on humanity's blindness to cosmic rhythms. The Foundation series (1951) embedded psychohistory mirroring Vedic yugas, cyclical civilizations in prophetic arcs.

Over 500 books explaining science, history, Shakespeare, the Bible—all through crystal clarity. Number 3 embodies expression, divine insight's conveyance. Mercury lends linguistic mastery but also elusive wisdom: truth angled obliquely.`,
    keyDate: "1941-1951",
    numerology: "3 = Expression, prophecy through accessible communication",
    color: "from-yellow-500 to-amber-500"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Family, Roots & Foundation",
    ruler: "Moon",
    storyTitle: "Brooklyn Roots",
    content: `For Isaac, transplanted from Russian soil to Brooklyn's concrete, this house wove stability shadowed by unseen currents. The family's chain of candy stores were modest altars—Judah presiding, Anna orchestrating domestic harmonies amid immigrant strife.

From 1923 to 1939, these havens instilled order in chaos, Jewish traditions mingling with Russian folklore in subtle ways Isaac seldom voiced. Agoraphobia in adulthood confined him to NYC and Boston—Saturnian wards guarding against boundless voids.

Wed Gertrude in 1942, birthing David (1951) and Robyn (1955). Roots in resilience, Capricorn's ascent from humble origins.`,
    keyDate: "1923-1939",
    numerology: "4 = Structure, foundation, ancestral wisdom in humble places",
    color: "from-amber-600 to-yellow-600"
  },
  {
    house: 5,
    name: "House of Creativity",
    icon: Star,
    theme: "Romance, Children & Self-Expression",
    ruler: "Sun",
    storyTitle: "Fictional Worlds",
    content: `The Fifth House is Leo's radiant forge. For Isaac, it blazed in world-building: Foundation's Galactic Empire, Robot ethics, Lucky Starr adventures. Each creation a universe unto itself.

First marriage 1942 to Gertrude, two children. Second marriage 1973 to Janet, his romantic chapter rewritten. But his greatest love affair? With ideas themselves—passionate relationships with concepts, characters, civilizations spanning millennia.

Creative risks: Foundation series dared to map future history. I, Robot dared to give machines souls. Brave gambles rewarded with literary immortality.`,
    keyDate: "1942-1973",
    numerology: "5 = Creative adventure, passionate world-building",
    color: "from-pink-500 to-rose-500"
  },
  {
    house: 6,
    name: "House of Service",
    icon: Briefcase,
    theme: "Work, Health & Daily Routine",
    ruler: "Mercury",
    storyTitle: "The Writing Ritual",
    content: `House 6 is Virgo's meticulous workshop. Isaac's routine was legendary: wake early, write for hours, break for lunch, write more, repeat. Daily discipline producing 90,000 words monthly.

Health challenges: heart attacks in 1977 and 1983, HIV from transfusion (kept secret until death). Yet he worked through it all—service through explanation, healing humanity's ignorance one essay at a time.

His daily work became sacred ritual: organizing all knowledge into digestible pieces, serving as humanity's librarian. Virgo energy perfected in literary service.`,
    keyDate: "1950s-1990s",
    numerology: "6 = Service, daily ritual, healing through knowledge",
    color: "from-blue-500 to-indigo-500"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Marriage, Allies & Open Enemies",
    ruler: "Venus",
    storyTitle: "Allies in Science",
    content: `House 7 reflects our partnerships. Two marriages: Gertrude Blugerman (1942-1973, divorce), Janet Jeppson (1973-1992, until death). The second marriage brought deeper understanding—Janet shared his intellectual world.

Allies: Carl Sagan, Arthur C. Clarke, fellow sci-fi visionaries. Enemies: anti-science movements, those who rejected evolution or rationality. His partnerships reflected his mission: clarity against confusion.

Number 7 whispers intellectual bonds. His relationships mirrored his values—seeking partners who honored reason and wonder together.`,
    keyDate: "1942-1992",
    numerology: "7 = Intellectual partnerships, allies in reason",
    color: "from-purple-500 to-violet-500"
  },
  {
    house: 8,
    name: "House of Death",
    icon: Skull,
    theme: "Transformation, Mystery & Shared Resources",
    ruler: "Pluto / Mars",
    storyTitle: "The Hidden Ending",
    content: `The 8th House rules death, secrets, transformation. Isaac's end came April 6, 1992—but the cause was hidden for years. HIV from a 1983 transfusion, kept secret by family until 2002.

Death transformed him into immortality: Foundation prequels and sequels written, influence spreading through generations. His ideas—Three Laws of Robotics, psychohistory—became shared resources for future writers.

The mystery: what unpublished works remained? What final insights died with him? The 8th House guards its secrets still.`,
    keyDate: "April 6, 1992",
    numerology: "8 = Transformation, death birthing eternal influence",
    color: "from-slate-700 to-gray-900"
  },
  {
    house: 9,
    name: "House of Foreign Lands",
    icon: Globe,
    theme: "Travel, Philosophy & Higher Learning",
    ruler: "Jupiter",
    storyTitle: "Universal Educator",
    content: `The 9th House governs philosophy and expansion. Isaac's agoraphobia limited physical travel, but his mind traversed galaxies. Books translated into dozens of languages, philosophies exported worldwide.

His higher learning philosophy: science as democratic knowledge, accessible to all. Education as salvation from ignorance. "The most exciting phrase in science isn't 'Eureka!' but 'That's funny...'"

Foundation's psychohistory was his 9th House masterwork: predicting civilization's cycles through mathematics, universal laws governing human behavior across millennia.`,
    keyDate: "1950s-1990s",
    numerology: "9 = Universal philosophy, cosmic education",
    color: "from-teal-500 to-cyan-500"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Crown,
    theme: "Public Image, Legacy & Achievement",
    ruler: "Saturn",
    storyTitle: "The Prolific Explainer",
    content: `The 10th House is public legacy. For Isaac: over 500 books published, SFWA Grand Master 1987, multiple Hugo Awards, the name synonymous with science popularization.

His career achievement: making knowledge accessible without dumbing it down. From astronomy to biochemistry to history—all explained with clarity and wonder.

Public image as the friendly professor, the secular humanist, the rational voice. Yet beneath? Perhaps a mystic who chose reason as his spiritual path. His legacy endures in every science writer who follows.`,
    keyDate: "1941-1992",
    numerology: "10/1 = Leadership in education, pioneering clarity",
    color: "from-amber-500 to-yellow-500"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Sparkles,
    theme: "Groups, Friends & Humanitarian Vision",
    ruler: "Uranus / Saturn",
    storyTitle: "The Humanist Vision",
    content: `The 11th House governs humanitarian hopes. Isaac's: a future where reason defeats superstition, where science literacy prevents disaster, where humanity reaches the stars through knowledge.

His community: Mensa membership, science fiction conventions, humanist organizations. He believed in collective intelligence, that educated masses could solve any problem.

Master number 11 vision: enlighten all humanity through accessible science. His hope—Star Trek's optimistic future made real through education and compassion.`,
    keyDate: "1960s-1992",
    numerology: "11 = Master vision, humanitarian education",
    color: "from-indigo-500 to-purple-500"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden Enemies, Spirituality & Endings",
    ruler: "Neptune / Jupiter",
    storyTitle: "The Rational Mystic",
    content: `The 12th House rules hidden realms and spirituality. Isaac publicly rejected mysticism, yet his fiction explored consciousness, time, cosmic purpose—deeply spiritual themes cloaked in rational language.

Hidden enemies: his own fears (agoraphobia, claustrophobia, flight phobia). Secret spirituality: his awe at existence itself, wonder at the universe masked as scientific curiosity. Was his atheism a veil over pantheistic reverence?

The 12th House mystery: beneath 500 books of reason lay a soul asking the ultimate questions—Why existence? Why consciousness? His rationality was his spirituality, science his prayer. Some seek God through temples; Isaac sought through telescopes.`,
    keyDate: "1920-1992",
    numerology: "12/3 = Hidden wisdom, spiritual seeking through reason",
    color: "from-violet-600 to-purple-900"
  }
];

export default function HouseHuntAsimov() {
  return (
    <HouseStoryViewer 
      houses={ASIMOV_HOUSES}
      personName="Isaac Asimov"
      lifePath="15/6"
      birthDate="January 2, 1920"
      deathDate="April 6, 1992"
      zodiac="Capricorn"
    />
  );
}