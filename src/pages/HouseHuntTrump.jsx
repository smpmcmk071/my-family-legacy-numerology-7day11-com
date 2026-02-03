import { Coins, Scroll, Home, Star, Briefcase, Users, Skull, Globe, Crown, Eye, Flag } from 'lucide-react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';

const TRUMP_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: Crown,
    theme: "Identity & First Impressions",
    ruler: "Mars",
    storyTitle: "The Queens Prodigy",
    content: `Young Donald stood in Queens' bustling streets at age ten, his eyes fixed on skylines no one else envisioned, mind already negotiating playground deals. Born June 14, 1946, to Fred, a real estate tycoon of German roots, and Mary Anne, a Scottish immigrant homemaker, he navigated a strict family—four siblings forging resilience.

From the start, his identity echoed Gemini's twins: the charismatic showman projecting bold confidence, versus the hidden strategist intuiting power's flows. Sent to New York Military Academy at thirteen for discipline, he excelled, projecting leadership while enduring rigors.

By Wharton in 1968, Donald's persona solidified: the enigmatic builder who projects unassailable drive while the world mistakes it for bravado. His 31/4 life path—the Master Builder—was already manifest: creative force (31) channeling structured ambition (4).`,
    keyDate: "June 14, 1946",
    numerology: "6+1+4+1+9+4+6 = 31/4 - The Master Builder: creative power (31) manifesting through structure (4)",
    color: "from-red-500 to-orange-500"
  },
  {
    house: 2,
    name: "House of Values",
    icon: Coins,
    theme: "Money, Possessions & Self-Worth",
    ruler: "Venus",
    storyTitle: "Market Fortunes",
    content: `Donald Trump graduated Wharton in 1968 with $200,000 from his father and a vision that would forge billions. Manhattan's real estate pulsed differently than Queens' suburbs, but to Donald's eyes, it was the same game: properties as chess pieces in cosmic negotiations.

His early moves were audacious. Taking over Fred's firm in 1971, he rebranded to Trump Organization. Grand Hyatt renovation 1980 netted fortunes, valuing branding over basics.

Number 2 embodies duality, partnerships—merging family legacy with personal empire. It teaches accumulation as harmony, gathering towers to redefine skylines. The 31/4 builder understands: creative vision (31) requires solid foundation (4) to manifest wealth.`,
    keyDate: "1971-1980s",
    numerology: "2 = Balance between inheritance and innovation, the 31/4 builder's dual foundation",
    color: "from-green-500 to-emerald-500"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: Scroll,
    theme: "Speech, Writing & Ideas",
    ruler: "Mercury",
    storyTitle: "Media Mastery",
    content: `House 3 is Mercury's agile domain—for Donald Trump, this house wasn't about speeches; it was about spectacle—tweets as edicts, books as manifestos, with veiled auguries beneath the bravado.

The verbal arsenal built early. In 1987, The Art of the Deal became a bestseller, forecasting negotiation as art. But mastery peaked with Twitter, joined 2009—platform for cryptic declarations: "Make America Great Again" in 2012, presaging political tides.

Number 3 represents expression, creative prophecy—the herald's energy. Mercury adds wit: truth proclaimed boldly, wisdom in soundbites. The 31/4 master builder communicates: creative ideas (31) structured into memorable phrases (4).`,
    keyDate: "1987-2015",
    numerology: "3 = Expression, the 31/4 communicator who builds with words",
    color: "from-yellow-500 to-amber-500"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Family, Roots & Foundation",
    ruler: "Moon",
    storyTitle: "Queens Foundations",
    content: `For Donald Trump, born in Queens to Fred's German-Lutheran discipline and Mary Anne's Scottish warmth, this house wove stability shadowed by expectations: firm foundations propelling empires, yet tinged with familial strains.

Jamaica Estates home was modest grandeur—Fred's self-made ethos instilling work ethic amid five siblings. From 1946-1964, these sanctuaries blended privilege with rigor, military academy forging resilience.

Number 4 signifies structure, quadrate base upholding all. For Donald, Queens' solidity fueled rises—the square's geometry mirroring disciplined origins birthing towering visions. The 31/4 foundation: creative dreams (31) requiring structured roots (4) to build empires.`,
    keyDate: "1946-1968",
    numerology: "4 = Structure, the 31/4 master builder's foundational geometry anchoring towers",
    color: "from-amber-600 to-yellow-600"
  },
  {
    house: 5,
    name: "House of Creativity",
    icon: Star,
    theme: "Romance, Children & Self-Expression",
    ruler: "Sun",
    storyTitle: "The Gambler Who Brands",
    content: `The Fifth House is Leo's radiant forge—creative bursts, daring leaps, romantic fires. For Donald, it blazed in ventures, channeling ardor into legacies.

Atlantic City casinos 1984, risking on glamour. Romances: Ivana (1977-1992), three children; Marla (1993-1999), Tiffany; Melania (2005), Barron. The Apprentice TV 2004, creative risks in reality television.

Number 5 evokes adventure, liberated creation—Leo's blaze in Gemini's wit. Donald wagered brands like stellar bets, showmanship veiling passionate drives. The 31/4 creates: imaginative risks (31) built on calculated structure (4).`,
    keyDate: "1984-2004",
    numerology: "5 = Creative risk, the 31/4 master builder's adventurous gambles",
    color: "from-pink-500 to-rose-500"
  },
  {
    house: 6,
    name: "House of Service",
    icon: Briefcase,
    theme: "Work, Health & Daily Routine",
    ruler: "Mercury",
    storyTitle: "The Ritual of Negotiation",
    content: `House 6 is Virgo's meticulous sanctum—daily rites, service, wellness. Donald's cadence: relentless deals at Trump Org, dissecting opportunities like arcane charts.

The daily routine of business: phone calls by 5 AM, deals structured methodically, health (2020 COVID tested). Service in developments, reshaping skylines, creating jobs through projects.

Number 6 mandates devoted harmony, routines as offerings. His work ethic became legendary—organization and deal-making as daily ritual. The 31/4 serves: creative vision (31) through disciplined work (4).`,
    keyDate: "1970s-2010s",
    numerology: "6 = Service, the 31/4 builder's daily work ethic and structured routine",
    color: "from-blue-500 to-indigo-500"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Marriage, Allies & Open Enemies",
    ruler: "Venus",
    storyTitle: "Mirrors of Power",
    content: `House 7 is Libra's reflective scale—alliances, adversaries. Three marriages: Ivana's partnership, Marla's chapter, Melania's steadiness. Business partners, political allies.

Open enemies: media critics, political opponents, legal challengers. The 7th House asks: Who reflects your energy back? Donald's relationships became battlegrounds and alliances, mirrors of power.

Number 7 whispers mystic ties, intellectual pacts. His partnerships veiled deeper resonances—cooperation and conflict in eternal dance. The 31/4 partners: creative alliances (31) built on structured agreements (4).`,
    keyDate: "1977-Present",
    numerology: "7 = Partnerships, the 31/4 builder's mirrors of power and structured alliances",
    color: "from-purple-500 to-violet-500"
  },
  {
    house: 8,
    name: "House of Death",
    icon: Skull,
    theme: "Transformation, Mystery & Shared Resources",
    ruler: "Pluto / Mars",
    storyTitle: "Bankruptcies and Rebirths",
    content: `The 8th House rules transformation, death, and rebirth. For Donald, it manifested as corporate bankruptcies—casino bankruptcies 1991, 1992, 2004, 2009—not personal death but business deaths, phoenix risings.

Using other people's money (OPM), leveraging debt as transformation tool. Each bankruptcy a death, each restructuring a rebirth. The 8th House alchemist turning crisis into opportunity.

The transformation: from real estate to reality TV to politics. Multiple lives, multiple resurrections. The 31/4 transforms: creative reinvention (31) through structural reorganization (4).`,
    keyDate: "1991-2009",
    numerology: "8 = Transformation, the 31/4 builder's death and rebirth through structured power",
    color: "from-slate-700 to-gray-900"
  },
  {
    house: 9,
    name: "House of Foreign Lands",
    icon: Globe,
    theme: "Travel, Philosophy & Higher Learning",
    ruler: "Jupiter",
    storyTitle: "The Global Brand",
    content: `The 9th House governs foreign lands, philosophy, expansion. Trump properties worldwide: Scotland, Dubai, Philippines, India. The brand as global philosophy—luxury as universal language.

Political philosophy: "America First" as 9th House doctrine, foreign policy as expansion of influence. Travel: campaigns, summits, golf courses spanning continents.

Number 9 represents universal reach, completion. His 9th House expressed through global presence, philosophical polarization, the businessman-turned-president bridging worlds. The 31/4 expands: creative vision (31) building global structures (4).`,
    keyDate: "1980s-Present",
    numerology: "9 = Global expansion, the 31/4 builder's worldwide philosophical structures",
    color: "from-teal-500 to-cyan-500"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Flag,
    theme: "Public Image, Legacy & Achievement",
    ruler: "Saturn",
    storyTitle: "The 45th President",
    content: `The 10th House is our public legacy. For Donald, it's 45th President of the United States (2017-2021), billionaire businessman, media personality, the name that became synonymous with polarization.

His 10th House achievement: reshaping American politics, disrupting establishment norms, creating a movement that outlasted his term. Love him or hate him, indifference is impossible.

Public image as masterwork—branding perfected, every headline amplified. The tower builder who made his name the tower itself. The 31/4 culminates: creative legacy (31) built on structural achievement (4).`,
    keyDate: "2017-2021",
    numerology: "10/1 = Leadership, the 31/4 master builder's pioneering legacy through structured power",
    color: "from-amber-500 to-yellow-500"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Users,
    theme: "Groups, Friends & Humanitarian Vision",
    ruler: "Uranus / Saturn",
    storyTitle: "The Movement",
    content: `The 11th House governs communities, groups, humanitarian vision. For Donald, it's MAGA—a movement that transcended candidacy, becoming cultural force.

Rally crowds, social media following, political base as community. The 11th House vision: restore American greatness, unite forgotten workers, disrupt elite consensus.

Number 11 is master visionary, but inverted: populist rather than spiritual, revolutionary through political upheaval. His humanitarian hope: prosperity for the common American. The 31/4 unites: creative movement (31) built on structural organization (4).`,
    keyDate: "2015-Present",
    numerology: "11 = Master vision, the 31/4 builder's community as structured movement",
    color: "from-indigo-500 to-purple-500"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden Enemies, Spirituality & Endings",
    ruler: "Neptune / Jupiter",
    storyTitle: "Investigations and Mysteries",
    content: `The 12th House rules hidden enemies, secrets, and the unconscious. For Donald, it manifests as investigations: Mueller, impeachments (2019, 2021), Mar-a-Lago documents, legal battles ongoing.

Hidden enemies within government, "deep state" narratives. Spirituality expressed through Norman Vincent Peale's positive thinking, confidence as faith. The unconscious revealed through unfiltered tweets, stream-of-consciousness speeches.

The 12th House keeps secrets still being written. What endings? What mysteries? The final chapter remains unwritten. The 31/4 mysteries: creative power (31) tested by structured systems (4).`,
    keyDate: "2017-Present",
    numerology: "12/3 = Hidden wisdom, the 31/4 builder's spiritual tests and karmic completion",
    color: "from-violet-600 to-purple-900"
  }
];

export default function HouseHuntTrump() {
  return (
    <HouseStoryViewer 
      houses={TRUMP_HOUSES}
      personName="Donald J. Trump"
      lifePath="31/4"
      birthDate="June 14, 1946"
      deathDate={null}
      zodiac="Gemini"
    />
  );
}