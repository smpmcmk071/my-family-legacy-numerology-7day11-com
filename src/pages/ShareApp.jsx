import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Share2, Download } from 'lucide-react';

export default function ShareApp() {
  const appUrl = window.location.origin;
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = '7day11-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Screen-only controls */}
        <div className="no-print mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Share 7day11.com</h1>
          <div className="flex gap-2">
            <Button onClick={handleDownloadQR} variant="outline" className="text-white border-white/20">
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            <Button onClick={handlePrint} className="bg-amber-600 hover:bg-amber-700">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Printable content */}
        <Card className="bg-white print:shadow-none">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
              7day11.com
            </CardTitle>
            <p className="text-xl text-gray-600 mt-2">Numerology & Astrology Family Legacy</p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg border-4 border-purple-600">
                <QRCodeSVG
                  id="qr-code"
                  value={appUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Instructions */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Share2 className="w-5 h-5 text-purple-600" />
                  <p className="text-lg font-semibold">Scan to Visit</p>
                </div>
                <p className="text-gray-600">Point your phone camera at the QR code</p>
              </div>

              {/* URL */}
              <div className="text-center py-4 px-6 bg-gradient-to-r from-purple-50 to-amber-50 rounded-lg w-full">
                <p className="text-sm text-gray-500 mb-1">Or visit directly:</p>
                <p className="text-xl font-mono font-bold text-purple-700">{appUrl}</p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-4 w-full mt-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-purple-900 mb-2">✨ Discover Your Numbers</h3>
                  <p className="text-sm text-gray-700">Life Path, Expression, Soul Urge & more</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-bold text-amber-900 mb-2">🌟 Daily Guidance</h3>
                  <p className="text-sm text-gray-700">Personalized horoscopes & energy forecasts</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-purple-900 mb-2">👨‍👩‍👧‍👦 Family Legacy</h3>
                  <p className="text-sm text-gray-700">Build your numerology family tree</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-bold text-amber-900 mb-2">🎮 Interactive Games</h3>
                  <p className="text-sm text-gray-700">Numerology Battle & Blackjack</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 mt-6 pt-6 border-t w-full">
                <p>© {new Date().getFullYear()} 7day11.com • Your Personal Numerology & Astrology Guide</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Print instructions */}
        <div className="no-print mt-4 text-center text-gray-300 text-sm">
          <p>💡 Tip: Print this page to create physical QR codes for sharing</p>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}