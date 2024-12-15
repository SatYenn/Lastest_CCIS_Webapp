import { useMemo } from 'react';
import { Users, Award, Heart, Target, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const teamValues = [
  {
    icon: Users,
    title: "Expertise Multiculturelle",
    description: "Une équipe multilingue d'experts en immigration avec une connaissance approfondie des lois canadiennes."
  },
  {
    icon: Heart,
    title: "Approche Personnalisée",
    description: "Solutions sur mesure adaptées aux besoins uniques de chaque client."
  },
  {
    icon: Award,
    title: "Excellence & Professionnalisme",
    description: "Engagement envers les plus hauts standards de service et de qualité."
  },
  {
    icon: Target,
    title: "Résultats Prouvés",
    description: "Des années d'expérience couronnées de succès dans la réalisation des rêves d'immigration."
  },
  {
    icon: MessageCircle,
    title: "Communication Claire",
    description: "Transparence totale et accompagnement continu tout au long du processus."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AboutUs() {
  const memoizedTeamValues = useMemo(() => teamValues, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-700 to-red-900 py-16 sm:py-24">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply opacity-20"
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Team collaboration"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-georgia">
              À Propos de Nous
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-red-100 font-merriweather">
              Votre partenaire de confiance pour réaliser vos rêves d'immigration au Canada
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative bg-white py-16 sm:py-24 lg:py-32">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
          <motion.div 
            className="relative sm:py-16 lg:py-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none">
              <div className="relative rounded-2xl shadow-xl overflow-hidden h-96">
                <img
                  className="absolute inset-0 h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Team meeting"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="pt-12 sm:pt-16 lg:pt-20">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl font-georgia">
                Notre Mission
              </h2>
              <div className="mt-6 text-gray-500 space-y-6 font-merriweather leading-relaxed">
                <p className="text-lg">
                  Chez Cam-Can Immigration Solutions, nous croyons que chaque rêve d'immigration mérite d'être réalisé. Fondée avec la passion d'aider les individus et les familles à naviguer dans le complexe paysage de l'immigration canadienne, notre équipe est dédiée à fournir des solutions personnalisées et efficaces.
                </p>
                <p className="text-lg">
                  Nous adoptons une approche centrée sur le client, en écoutant attentivement vos besoins et en vous guidant à chaque étape du processus. Que vous souhaitiez obtenir un visa de visiteur, un permis de travail ou une résidence permanente, nous sommes là pour vous aider à formuler un plan d'action adapté à votre situation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 font-georgia">
              Nos Valeurs
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500 font-merriweather">
              Des principes qui guident chacune de nos actions
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {memoizedTeamValues.map((value) => (
              <motion.div
                key={value.title}
                variants={item}
                className="bg-white rounded-lg shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-md mb-4">
                  <value.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-georgia">
                  {value.title}
                </h3>
                <p className="text-gray-500 font-merriweather leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-red-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-georgia">
              <span className="block">Prêt à commencer votre voyage?</span>
              <span className="block text-red-100 text-xl mt-2 font-merriweather">
                Contactez-nous aujourd'hui pour réaliser vos aspirations canadiennes.
              </span>
            </h2>
          </motion.div>
          <motion.div 
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-red-700 transition-all duration-200"
            >
              Nous Contacter
            </a>
            <a
              href="/evaluation"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-red-700 bg-white hover:bg-red-50 transition-all duration-200"
            >
              Évaluation Gratuite
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 