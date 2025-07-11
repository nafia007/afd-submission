import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from "lucide-react";
const Footer = () => {
  return <footer className="bg-muted/30 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">FilmChain</h3>
            <p className="text-sm text-muted-foreground">
              Revolutionizing film financing through blockchain technology. 
              Connect filmmakers with investors and democratize the film industry.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="/dex" className="text-muted-foreground hover:text-primary transition-colors">
                  Trading
                </a>
              </li>
              <li>
                <a href="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="/creator-dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Creator Dashboard
                </a>
              </li>
              <li>
                <a href="/asset-management" className="text-muted-foreground hover:text-primary transition-colors">
                  Asset Management
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@holocenefilms.xyz</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+27 0 64 2785 968</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Cape Town South Africa</span>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Have questions? We'd love to hear from you.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 AFD Submissions. Made by Holocene Films.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Security
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Status
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;