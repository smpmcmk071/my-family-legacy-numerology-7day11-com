import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scroll, MapPin, Sword, Ship, Star, Crown, Users, Flag } from 'lucide-react';

export default function MaherHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Scroll className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Maher / Meagher History
          </h1>
          <p className="text-xl text-gray-300 italic">
            Ó Meachair — "Descendants of the Kind & Hospitable"
          </p>
        </div>

        {/* Origins Section */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-400" />
              Ancient Origins
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              <strong className="text-amber-400">Ó Meachair</strong> (anglicised as Mahar, Maher, Mahir, Marr, Meagar, Meagher, Meaher, O'Maher and O'Meagher) is a Gaelic Irish surname meaning <em>"grandson/descendant of the kind, generous, or hospitable one."</em>
            </p>
            <p>
              The Ó Meachair sept was part of the <strong className="text-white">Ely O'Carroll clan</strong> and was concentrated in the areas of <strong className="text-white">Kilkenny</strong> and <strong className="text-white">Tipperary</strong>, notably the Barony of Ikerrin in Ireland.
            </p>
            <p>
              According to historian C. Thomas Cairney, the O'Mahers were one of the chiefly families of the <strong className="text-white">Éile tribe</strong> who came from the Dumnonii or Laigin — the third wave of Celts to settle in Ireland during the <strong className="text-amber-400">first century BC</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Geographic Roots */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <MapPin className="w-6 h-6 text-green-400" />
              Geographic Roots — County Tipperary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Most Meagher/Maher/Mahars have ancestral roots centered in <strong className="text-white">County Tipperary</strong>, Ireland. The surname is so closely tied to this region that it remains one of the most common names there to this day.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-amber-400 font-semibold mb-2">Name Variations</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Maher (most common in Ireland)</li>
                  <li>Meagher (common in America/Australia)</li>
                  <li>O'Meagher / O'Maher (original form)</li>
                  <li>Mahar, Mahir, Marr</li>
                </ul>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-amber-400 font-semibold mb-2">Irish Naming Convention</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Male: Ó Meachair</li>
                  <li>Daughter: Ní Mheachair</li>
                  <li>Wife (Long): Bean Uí Mheachair</li>
                  <li>Wife (Short): Uí Mheachair</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thomas Francis Meagher */}
        <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Sword className="w-6 h-6 text-amber-400" />
              Thomas Francis Meagher — "Meagher of the Sword"
            </CardTitle>
            <p className="text-gray-400 text-sm">August 3, 1823 – July 1, 1867</p>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <p>
                  <strong className="text-amber-400">Thomas Francis Meagher</strong> (pronounced "MAR") was an Irish nationalist, revolutionary, and leader of the <strong className="text-white">Young Irelanders</strong> in the Rebellion of 1848.
                </p>
                <p>
                  Born in <strong className="text-white">Waterford City</strong>, Ireland, he earned the nickname <em>"Meagher of the Sword"</em> for his fiery speeches advocating for Irish independence.
                </p>
                <p>
                  After being convicted of sedition, he was sentenced to death — later commuted to transportation for life to Van Diemen's Land (Tasmania), Australia.
                </p>
              </div>
              <div className="w-full md:w-64 p-4 bg-black/30 rounded-lg">
                <h4 className="text-amber-400 font-semibold mb-2 text-center">Key Facts</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Born: Waterford, Ireland</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-green-400" />
                    <span>Young Irelander Leader</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sword className="w-4 h-4 text-red-400" />
                    <span>Union Brigadier General</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-purple-400" />
                    <span>Montana Acting Governor</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Numerology Profile */}
            <div className="mt-6 p-5 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl border border-purple-500/30">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                The Original Seeker 7 — Numerology Profile
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-black/30 rounded-lg">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl mb-2">7</div>
                  <p className="text-purple-300 text-xs">Life Path</p>
                  <p className="text-white font-semibold">16/7</p>
                  <p className="text-amber-400 text-xs mt-1">Karmic Debt</p>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-lg">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl mb-2">5</div>
                  <p className="text-purple-300 text-xs">Expression</p>
                  <p className="text-white font-semibold">14/5</p>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-lg">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl mb-2">1</div>
                  <p className="text-purple-300 text-xs">Soul Urge</p>
                  <p className="text-white font-semibold">28/1</p>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-lg">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl mb-2">4</div>
                  <p className="text-purple-300 text-xs">Personality</p>
                  <p className="text-white font-semibold">67/4</p>
                </div>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-purple-300 text-xs mb-1">Birthday Vibe</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">3</div>
                    <span className="text-white">August 3rd — The Creator</span>
                  </div>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-purple-300 text-xs mb-1">Karmic Debt Numbers</p>
                  <div className="flex gap-2">
                    {[10, 13, 14, 16].map(num => (
                      <span key={num} className="px-2 py-1 bg-red-600/50 text-red-200 rounded text-sm font-semibold">{num}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-800/30 rounded-lg">
                <p className="text-purple-200 text-sm">
                  <strong className="text-amber-400">The 16/7 Life Path</strong> is known as the "Tower" number — representing someone who builds great things only to see them fall, and must rebuild with spiritual wisdom. Meagher's life perfectly embodies this: rising as Ireland's revolutionary hero, falling through exile, rebuilding in America as a war hero and governor, and his mysterious final fall into the Missouri River.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escape and America */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Ship className="w-6 h-6 text-blue-400" />
              Escape to America & The Irish Brigade
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              In <strong className="text-white">1852</strong>, Meagher escaped from Tasmania and made his way to the United States, settling in <strong className="text-white">New York City</strong>. He studied law, worked as a journalist, and lectured on the Irish cause.
            </p>
            <p>
              At the start of the <strong className="text-amber-400">American Civil War</strong>, Meagher joined the U.S. Army and rose to <strong className="text-white">Brigadier General</strong>. He recruited and led the famous <strong className="text-amber-400">Irish Brigade</strong> (the "Fighting 69th"), one of the most celebrated units of the Union Army.
            </p>
            <div className="p-4 bg-white/5 rounded-lg mt-4">
              <h4 className="text-amber-400 font-semibold mb-2">Major Battles</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <span className="px-2 py-1 bg-red-900/30 rounded">First Battle of Bull Run</span>
                <span className="px-2 py-1 bg-red-900/30 rounded">Peninsula Campaign</span>
                <span className="px-2 py-1 bg-red-900/30 rounded">Battle of Antietam</span>
                <span className="px-2 py-1 bg-red-900/30 rounded">Battle of Fredericksburg</span>
                <span className="px-2 py-1 bg-red-900/30 rounded">Battle of Chancellorsville</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Montana Governor */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Crown className="w-6 h-6 text-purple-400" />
              Governor of Montana Territory
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Following the Civil War, President <strong className="text-white">Andrew Johnson</strong> appointed Meagher as Montana's Territorial Secretary of State. He served as <strong className="text-amber-400">Acting Territorial Governor</strong> from September 1865 to October 1866, and again from December 1866 until his death.
            </p>
            <p>
              On <strong className="text-white">July 1, 1867</strong>, Meagher drowned in the Missouri River after falling from a steamboat at Fort Benton, Montana. His death remains mysterious — theories include illness, intoxication, suicide, and murder by political opponents.
            </p>
          </CardContent>
        </Card>

        {/* The Irish Flag */}
        <Card className="bg-gradient-to-br from-green-900/30 via-white/10 to-orange-900/30 border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Flag className="w-6 h-6 text-green-400" />
              The Irish Tricolour Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Thomas Francis Meagher is credited with introducing the <strong className="text-amber-400">Irish Tricolour flag</strong> (green, white, and orange) to Ireland in 1848. He received it as a gift from French revolutionaries and presented it to the Irish people as a symbol of hope for peace between Catholics and Protestants.
            </p>
            <p className="italic text-gray-400">
              "The white in the centre signifies a lasting truce between Orange and Green."
            </p>
          </CardContent>
        </Card>

        {/* Notable Mahers */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-cyan-400" />
              Notable Mahers & Meaghers in History
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-amber-400 font-semibold mb-2">Sports & Entertainment</h4>
                <ul className="text-sm space-y-1">
                  <li><strong>Johnny Marr</strong> (né John Maher) — The Smiths guitarist</li>
                  <li><strong>Mary T. Meagher</strong> — Olympic swimmer</li>
                  <li><strong>Ray Meagher</strong> — Australian actor</li>
                  <li><strong>Lory Meagher</strong> — Irish hurling legend</li>
                </ul>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-amber-400 font-semibold mb-2">Politics & Military</h4>
                <ul className="text-sm space-y-1">
                  <li><strong>Thomas Meagher (MP)</strong> — Mayor of Waterford</li>
                  <li><strong>John W. Meagher</strong> — Medal of Honor recipient</li>
                  <li><strong>William F. Mahar</strong> — American politician</li>
                  <li><strong>Margaret Meagher</strong> — Canadian diplomat</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sources */}
        <div className="text-center text-gray-500 text-sm">
          <p>Sources: Wikipedia, Irish America Magazine, johngrenham.com, FamilyTreeDNA</p>
        </div>
      </div>
    </div>
  );
}