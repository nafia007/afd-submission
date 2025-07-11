import ThreeDScene from "@/components/ThreeDScene";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Film, Wallet, Users, Play, Info, BookText, ChartBar } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import HeroBackground from "@/components/HeroBackground";
const Index = () => {
  return <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Hero section with cinematic background */}
      <HeroBackground />
      
      <div className="container mx-auto px-4 pt-20 md:pt-32 pb-16 relative z-10">
        <div className="max-w-5xl mx-auto mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
              African Film DAO
            </span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-amber-400 font-semibold mb-6">
            Financing the Future of African Cinema
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
            Revolutionising the African film industry using Polygon blockchain technology to tokenize IP assets & democratise funding. Join us in this groundbreaking journey!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Link to="/afd">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 text-lg px-8 py-6 rounded flex items-center gap-2">
                <Film className="w-5 h-5" />
                Submit Your Project
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-amber-400/40 hover:bg-amber-400/10 hover:border-amber-400/60 transition-all duration-300 rounded flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Explore Tokenized Films
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Challenges and Solutions */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Challenges Facing African Filmmakers
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {challenges.map((challenge, index) => <Card key={index} className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-lg border-purple-600/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-amber-400 mb-4 flex justify-center">
                        {challenge.icon}
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-3 text-white">{challenge.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            <div className="bg-gradient-to-r from-purple-800/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-8 mb-16">
              <h3 className="font-heading text-2xl font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  The African Film DAO Solution
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutions.map((solution, index) => <div key={index} className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{solution.title}</h4>
                      <p className="text-gray-300 text-sm">{solution.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards with Netflix-like styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {features.map((feature, index) => <Card key={index} className="bg-black/60 backdrop-blur-lg border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 text-red-500">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>)}
        </div>

        {/* Stats with Netflix-like styling */}
        <div className="mt-24 mb-16">
          <h2 className="font-heading text-4xl font-bold mb-12 text-center">Join the Future</h2>
          
        </div>
        
        {/* Featured content section */}
        
      </div>

      {/* Market Overview Section */}
      

      <ChatInterface />
    </div>;
};
const features = [{
  icon: <Film className="w-12 h-12" />,
  title: "Tokenized Film IP",
  description: "Transform film intellectual property into tradeable digital assets, enabling fractional ownership and investment opportunities."
}, {
  icon: <Wallet className="w-12 h-12" />,
  title: "Decentralized Exchange",
  description: "Trade film tokens seamlessly using our built-in DEX, powered by secure smart contracts and lightning-fast transactions."
}, {
  icon: <Users className="w-12 h-12" />,
  title: "Community Driven",
  description: "Join a vibrant community of filmmakers, investors, and enthusiasts shaping the future of film financing together."
}];
const stats = [{
  value: "$10M+",
  label: "Total Volume"
}, {
  value: "1000+",
  label: "Active Users"
}, {
  value: "500+",
  label: "Film IPs Listed"
}];
const featuredFilms = [{
  title: "The Digital Frontier",
  category: "Sci-Fi",
  poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80"
}, {
  title: "Blockchain Revolution",
  category: "Documentary",
  poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80"
}, {
  title: "Future of Finance",
  category: "Drama",
  poster: "https://images.unsplash.com/photo-1559583109-3e7968136c99?auto=format&fit=crop&q=80"
}, {
  title: "Crypto Dreams",
  category: "Thriller",
  poster: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80"
}];
const challenges = [{
  icon: <Wallet className="w-8 h-8" />,
  title: "Funding Difficulties",
  description: "African filmmakers often struggle to acquire funding to support their films."
}, {
  icon: <Film className="w-8 h-8" />,
  title: "Limited Distribution",
  description: "The film industry in Africa faces obstacles including lack of infrastructure and limited distribution networks."
}, {
  icon: <ChartBar className="w-8 h-8" />,
  title: "Low Budgets",
  description: "With limited funding, filmmakers have to work with smaller budgets, which can impact film quality."
}];
const solutions = [{
  title: "Tokenization of IP Assets",
  description: "We tokenize IP assets and allow investors to purchase them on the open market."
}, {
  title: "Access NFT",
  description: "Membership NFT which allows access to our festival, pitch forum and token release."
}, {
  title: "Transparent Democratic Voting",
  description: "We use a democratic voting system where token holders choose which projects will get funding."
}, {
  title: "Polygon Blockchain Technology",
  description: "Polygon Blockchain technology ensures transparency and security in the voting process."
}];
const regulatoryPoints = ["Compliant with securities regulations for tokenized assets", "KYC/AML procedures for investor verification", "Smart contracts audited by leading security firms", "Transparent revenue distribution mechanisms", "Regular reporting and disclosure requirements"];
const marketMetrics = [{
  icon: <Film className="w-8 h-8" />,
  title: "Total Films Tokenized",
  value: "500+",
  description: "Growing catalogue of tokenized film IP assets"
}, {
  icon: <Wallet className="w-8 h-8" />,
  title: "Trading Volume",
  value: "$10M+",
  description: "Monthly trading volume on our DEX"
}, {
  icon: <Users className="w-8 h-8" />,
  title: "Active Investors",
  value: "10,000+",
  description: "Global community of film IP investors"
}];
export default Index;