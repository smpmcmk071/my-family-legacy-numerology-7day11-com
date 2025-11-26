import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Users, FileText, MapPin, ExternalLink } from 'lucide-react';
import GenealogyChat from '@/components/genealogy/GenealogyChat';

const resources = [
  { name: "IrishGenealogy.ie", url: "https://www.irishgenealogy.ie", desc: "Free Irish civil records" },
  { name: "National Archives of Ireland", url: "https://www.nationalarchives.ie", desc: "Census & historical records" },
  { name: "Ellis Island Records", url: "https://www.libertyellisfoundation.org", desc: "US immigration records" },
  { name: "FamilySearch", url: "https://www.familysearch.org", desc: "Free global genealogy" }
];

export default function GenealogyResearch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Book className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Genealogy Research Assistant
          </h1>
          <p className="text-gray-400">
            Discover ancestors, decipher documents, and explore your family's history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat - Main Area */}
          <div className="lg:col-span-2">
            <GenealogyChat />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Capabilities */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">What I Can Help With</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Ancestor Suggestions</p>
                    <p className="text-gray-400 text-sm">Find potential ancestors based on your family data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Document Analysis</p>
                    <p className="text-gray-400 text-sm">Decipher old handwriting and records</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Historical Context</p>
                    <p className="text-gray-400 text-sm">Learn about places and time periods</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Research Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {resources.map((r, idx) => (
                  <a
                    key={idx}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{r.name}</p>
                      <p className="text-gray-400 text-xs">{r.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-400" />
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}