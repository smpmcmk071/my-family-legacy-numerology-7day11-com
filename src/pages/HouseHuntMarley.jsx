import React from 'react';
import HouseStoryViewer from '../components/househunt/HouseStoryViewer';
import { Music, Heart, Home, Globe, Zap, Crown, Users, Flame, Mountain, Star, Wind, Sparkles } from 'lucide-react';

const MARLEY_HOUSES = [
  {
    house: 1,
    name: "1st House: Self & Identity",
    icon: Crown,
    theme: "The Natural Mystic",
    ruler: "Mars (Aries)",
    storyTitle: "The Natural Mystic",
    content: "Born February 6, 1945 in Nine Mile, Jamaica, Robert Nesta Marley's 1st House radiated revolutionary Aquarian energy.\n\nMixed-race child in colonial Jamaica, he projected defiant pride. Aquarius duality: outsider who became universal voice. Numerology 27/9: humanitarian vessel channeling divine music.\n\n🔮 Tarot: The Star (hope, universal love) • Astrology: Aquarius Sun (revolutionary humanitarian), Saturn/Uranus (discipline meets rebellion)",
    keyDate: "February 6, 1945",
    numerology: "2+6+1+9+4+5 = 27/9 - Universal humanitarian • Birth Number 6, Destiny 9",
    color: "from-green-500 via-yellow-500 to-red-600"
  },
  {
    house: 2,
    name: "2nd House: Values & Resources",
    icon: Heart,
    theme: "One Love Philosophy",
    ruler: "Venus (Taurus)",
    storyTitle: "One Love Philosophy",
    content: "Marley's 2nd House: From Trenchtown poverty to global wealth, but money never owned him.\n\nValued Rastafari truth over riches. Gave freely to the suffering. Numerology 2: duality—material poverty/spiritual wealth. 'Exodus' album (1977 = 24/6) brought financial freedom but he stayed humble.\n\n🔮 Tarot: The Hermit (inner wealth) • Rastafari Code: Jah provides, Babylon tempts. Refused $1M Jamaican peace concert payment.",
    keyDate: "1963 First Recording",
    numerology: "2 = Balance of material/spiritual • 1963 = 19/1 (new beginning)",
    color: "from-yellow-500 via-green-500 to-amber-600"
  },
  {
    house: 3,
    name: "3rd House: Communication",
    icon: Music,
    theme: "Prophet's Voice",
    ruler: "Mercury (Gemini)",
    storyTitle: "Prophet's Voice",
    content: "Marley's 3rd House transformed reggae into universal language.\n\n'No Woman, No Cry' (1974 = 21/3: creative expression). 'Redemption Song' acoustic truth. Lyrics prophesied: 'Emancipate yourselves from mental slavery.' Words became scripture.\n\n🔮 Tarot: The Magician (words manifest worlds) • Mercury retrograde theme: songs took years to reach full recognition. 'Get Up, Stand Up' = revolution anthem.",
    keyDate: "1974 No Woman No Cry",
    numerology: "3 = Prophecy through music • 'Redemption Song' = consciousness awakening",
    color: "from-red-500 via-orange-500 to-yellow-600"
  },
  {
    house: 4,
    name: "4th House: Home & Roots",
    icon: Home,
    theme: "Trenchtown to Africa",
    ruler: "Moon (Cancer)",
    storyTitle: "Trenchtown to Africa",
    content: "Marley's 4th House: Nine Mile birthplace, Trenchtown ghetto shaped soul.\n\nMother Cedella raised him; white father Captain Norval absent (abandonment = karmic wound). Ethiopia pilgrimage 1978 (3+3=6: family/roots). Home was Africa, though born Jamaica. Moon = ancestral pain transformed to healing.\n\n🔮 1966 Ethiopia visit = spiritual rebirth • Nine Mile = sacred numerology 9 (completion). Buried there May 21, 1981.",
    keyDate: "1966 Ethiopia Visit",
    numerology: "4 = Foundation in roots • 1966 = 22/4 (master builder of culture)",
    color: "from-green-600 via-teal-500 to-blue-600"
  },
  {
    house: 5,
    name: "5th House: Creativity & Romance",
    icon: Flame,
    theme: "Fire on the Mountain",
    ruler: "Sun (Leo)",
    storyTitle: "Fire on the Mountain",
    content: "Marley's 5th House blazed with creative fire and passionate love.\n\nRita Marley (married 1966 = 4: stable foundation), but many children (11 acknowledged = master number). Soccer player, performer—joy through movement. Creativity as spiritual practice: cannabis sacrament, music as prayer.\n\n🔮 Tarot: The Sun (creative radiance) • 11 children = 11 (master number illumination passing to next generation)",
    keyDate: "1966 Married Rita",
    numerology: "5 = Freedom through creation • 11 children = illumination lineage",
    color: "from-orange-500 via-red-600 to-pink-600"
  },
  {
    house: 6,
    name: "6th House: Work & Service",
    icon: Users,
    theme: "Servant of Jah",
    ruler: "Mercury (Virgo)",
    storyTitle: "Servant of Jah",
    content: "Marley's 6th House devoted to serving humanity through music.\n\nDaily ganja meditation, rehearsals, concerts. Health neglected (melanoma toe 1977 = 6: health karma). Refused amputation—Rastafari body sacred. Worked until death: Final concert September 23, 1980 (5 = freedom ends).\n\n🔮 Health Karma: Melanoma = 7 letters = 7 (mystical test). Refused Western medicine, trusted Jah—fate sealed.",
    keyDate: "1977 Toe Cancer",
    numerology: "6 = Service/health lessons • 1977 = 24/6 (karmic health test)",
    color: "from-green-500 via-emerald-500 to-teal-600"
  },
  {
    house: 7,
    name: "7th House: Partnerships",
    icon: Heart,
    theme: "Wailers Unity",
    ruler: "Venus (Libra)",
    storyTitle: "Wailers Unity",
    content: "Marley's 7th House: The Wailers trinity—Bob, Peter Tosh, Bunny Wailer.\n\nPartnership fractured 1974 (2+1=3: separation). Rita Marley partnership endured despite complexity. One Love Peace Concert 1978: united warring politicians (Manley/Seaga handshake = Venus diplomacy).\n\n🔮 Tarot: Justice (balance through partnership) • 1978 Peace Concert = 25/7 (spiritual diplomacy)",
    keyDate: "1978 Peace Concert",
    numerology: "7 = Spiritual partnerships • Wailers split 1974 = 21/3 (creative separation)",
    color: "from-pink-500 via-red-500 to-purple-600"
  },
  {
    house: 8,
    name: "8th House: Transformation & Death",
    icon: Sparkles,
    theme: "Exodus Movement",
    ruler: "Pluto (Scorpio)",
    storyTitle: "Exodus Movement",
    content: "Marley's 8th House: Assassination attempt December 3, 1976 (3+3=6: service under attack).\n\nShot by political forces—survived, performed at Smile Jamaica Concert 2 days later. Exile to London: 'Exodus' album born from near-death. Died May 11, 1981 (8: karmic completion). Last words: 'Money can't buy life.'\n\n🔮 Tarot: Death (transformation, not end) • Death date 5/11/1981 = 26/8 (power completes, legacy begins)",
    keyDate: "May 11, 1981",
    numerology: "8 = Death/rebirth • 36 years old = 3+6 = 9 (mission complete)",
    color: "from-purple-600 via-indigo-600 to-slate-800"
  },
  {
    house: 9,
    name: "9th House: Philosophy & Travel",
    icon: Globe,
    theme: "Rastafari Prophet",
    ruler: "Jupiter (Sagittarius)",
    storyTitle: "Rastafari Prophet",
    content: "Marley's 9th House spread Rastafari philosophy globally.\n\nHaile Selassie = Jah incarnate. Ethiopia = promised land. World tours: Europe, Africa, Americas—universal message. Zimbabwe independence concert 1980 (9: freedom completion). Philosophy: Babylon system falls, Zion rises.\n\n🔮 Tarot: The Hierophant (spiritual teacher) • Zimbabwe 1980 = 18/9 (universal liberation prophesied)",
    keyDate: "1980 Zimbabwe",
    numerology: "9 = Universal philosophy • Rastafari = consciousness expansion",
    color: "from-yellow-500 via-amber-500 to-green-600"
  },
  {
    house: 10,
    name: "10th House: Legacy & Fame",
    icon: Mountain,
    theme: "King of Reggae",
    ruler: "Saturn (Capricorn)",
    storyTitle: "King of Reggae",
    content: "Marley's 10th House built immortal legacy.\n\n'Legend' album (1984 = 18/9) became best-selling reggae album ever. Inducted Rock & Roll Hall of Fame 1994. UN's 'One Love' named Song of Millennium. Saturn rewards: Global icon, voice of oppressed, eternal king.\n\n🔮 Tarot: The World (completion, global recognition) • Legend album = universal anthem collection",
    keyDate: "1984 Legend Album",
    numerology: "10/1 = New era begins • Legacy = timeless consciousness",
    color: "from-amber-600 via-yellow-500 to-gold"
  },
  {
    house: 11,
    name: "11th House: Community & Vision",
    icon: Star,
    theme: "One Love Vision",
    ruler: "Uranus (Aquarius)",
    storyTitle: "One Love Vision",
    content: "Marley's 11th House: Vision of unified humanity.\n\nOne Love, One Heart philosophy. Music as revolution—not violence. Friends with revolutionaries, politicians, outcasts. Aquarius vision: borders dissolve, races unite, Jah consciousness reigns. 11 = master number illumination realized.\n\n🔮 Tarot: The Star (hope for humanity) • 'One Love' = 7+5+3+6+4+5 = 30/3 (creative unity)",
    keyDate: "One Love Movement",
    numerology: "11 = Master illumination • Aquarius vision fulfilled",
    color: "from-cyan-500 via-blue-500 to-indigo-600"
  },
  {
    house: 12,
    name: "12th House: Spirituality & Endings",
    icon: Wind,
    theme: "Natural Mystic Blowing",
    ruler: "Neptune (Pisces)",
    storyTitle: "Natural Mystic Blowing",
    content: "Marley's 12th House dissolved boundaries between life/death, physical/spiritual.\n\n'There's a natural mystic blowing through the air'—Neptune prophecy. Cancer spread = body releasing spirit. Final months: Miami, Germany treatments failed. Returned to Jamaica soil (12 = completion, endings). Spirit lives eternal in music.\n\n🔮 Tarot: The Hanged Man (sacrifice for higher truth) • Natural Mystic = prophetic final warning. Death age 36 = 3+6 = 9 (mission fulfilled).",
    keyDate: "1980 Natural Mystic",
    numerology: "12 = Spiritual completion • Death = physical ends, consciousness eternal",
    color: "from-purple-700 via-indigo-800 to-slate-900"
  }
];

export default function HouseHuntMarley() {
  return (
    <HouseStoryViewer
      houses={MARLEY_HOUSES}
      personName="Bob Marley"
      lifePath="27/9 - The Universal Humanitarian"
      birthDate="February 6, 1945"
      deathDate="May 11, 1981"
      zodiac="Aquarius"
    />
  );
}