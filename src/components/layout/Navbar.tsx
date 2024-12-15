import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Home, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const services = [
  {
    name: 'Tous les Services',
    href: '/services'
  },
  {
    name: 'Immigration',
    subservices: [
      { name: 'Visa Visiteur', href: '/services/visa-visiteur' },
      { name: 'Permis de Travail', href: '/services/permis-de-travail' },
      { name: "Permis d'Études", href: '/services/permis-etudes' },
    ]
  },
  {
    name: 'Résidence & Citoyenneté',
    subservices: [
      { name: 'Résidence Permanente', href: '/services/residence-permanente' },
      { name: 'Naturalisation', href: '/services/naturalisation' },
      { name: 'Super Visa & Regroupement', href: '/services/super-visa-regroupement-familial' },
    ]
  },
  {
    name: 'Autres Services',
    subservices: [
      { name: 'Parrainage', href: '/services/parrainage' },
      { name: 'Renouvellement Documents', href: '/services/renouvellement-documents' },
      { name: 'Services Juridiques', href: '/services/juridique' },
      { name: 'Aide à la Relocalisation', href: '/services/relocation' },
    ]
  }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const location = useLocation();

  // Close dropdown when route changes
  useEffect(() => {
    setShowServices(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white/90 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/cam-can-logo.png" 
                alt="CAM-CAN Immigration Solutions"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
            <Link 
              to="/"
              className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 font-merriweather"
            >
              Accueil
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <div className="flex items-center">
                <Link 
                  to="/services"
                  className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 font-merriweather"
                >
                  Services
                </Link>
                <button
                  onClick={() => setShowServices(!showServices)}
                  className="text-gray-600 hover:text-red-600 p-1 transition-colors duration-200"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                    showServices ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>

              {showServices && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
                >
                  {services.map((service) => (
                    <div key={service.name}>
                      <div 
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer font-merriweather"
                        onClick={() => {
                          if (service.href) {
                            navigate(service.href);
                          } else {
                            setExpandedService(expandedService === service.name ? null : service.name);
                          }
                        }}
                      >
                        {service.name}
                        {service.subservices && (
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform ${
                              expandedService === service.name ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                      {service.subservices && expandedService === service.name && (
                        <div className="bg-gray-50 py-1">
                          {service.subservices.map((subservice) => (
                            <Link
                              key={subservice.href}
                              to={subservice.href}
                              className="block px-6 py-1 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-merriweather"
                            >
                              {subservice.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/evaluation"
              className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 font-merriweather"
            >
              Évaluation
            </Link>

            <Link 
              to="/pages/AssistancePayment"
              className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 font-merriweather"
            >
              Assistance & Paiement
            </Link>

            <Link 
              to="/about-us"
              className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 font-merriweather"
            >
              À Propos
            </Link>

            <Link 
              to="/contact"
              className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 font-merriweather"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <span className="text-gray-700 font-merriweather">{user.firstName}</span>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/client'}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  {user.role === 'admin' ? 'Portal Admin' : 'Portal Client'}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-merriweather"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-red-600 border-2 border-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-50 transition-all duration-200 font-merriweather"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>

            {/* Mobile Services Accordion */}
            <div className="space-y-2">
              <button
                className="flex items-center justify-between w-full text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
                onClick={() => setShowServices(!showServices)}
              >
                Services
                <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${showServices ? 'rotate-180' : ''}`} />
              </button>
              
              {showServices && (
                <div className="pl-4 space-y-2">
                  {services.map((service) => (
                    service.href ? (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
                        onClick={() => setIsOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ) : null
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/evaluation"
              className="block text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
              onClick={() => setIsOpen(false)}
            >
              Évaluation
            </Link>

            <Link
              to="/pages/AssistancePayment"
              className="block text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
              onClick={() => setIsOpen(false)}
            >
              Assistance & Paiement
            </Link>

            <Link
              to="/about-us"
              className="block text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
              onClick={() => setIsOpen(false)}
            >
              À Propos
            </Link>

            <Link
              to="/contact"
              className="block text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>


            {user ? (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700 font-merriweather">{user.firstName}</span>
                </div>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/client'}
                  className="flex items-center w-full text-gray-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
                >
                  <Home className="h-5 w-5 mr-2" />
                  {user.role === 'admin' ? 'Portal Admin' : 'Portal Client'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-red-600 px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-200 font-merriweather"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg text-base font-medium hover:shadow-lg transition-all duration-200 font-merriweather"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center bg-white text-red-600 border-2 border-red-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-red-50 transition-all duration-200 font-merriweather"
                  onClick={() => setIsOpen(false)}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}