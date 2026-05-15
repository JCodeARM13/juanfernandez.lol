"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Linkedin, ArrowUpRight } from "lucide-react";
import { EasterEgg } from "./easter-egg";

// Datos editables. Actualizar handles reales cuando estén disponibles.
const FOOTER = {
  name: "Juan Fernández",
  tagline: "Operations Lead. Mobility · CX · Growth.",
  location: "Tlalnepantla, MX",
  email: "jvancipn@gmail.com",
  whatsapp: {
    label: "+52 55 4886 9123",
    href: "https://wa.me/525548869123",
  },
  linkedin: {
    label: "/in/Juancfernandezvg",
    href: "https://www.linkedin.com/in/Juancfernandezvg",
  },
  nav: [
    { label: "Hero", href: "#hero" },
    { label: "Manifiesto", href: "#manifesto" },
    { label: "Proyectos", href: "#proyectos" },
    { label: "Blog", href: "#blog" },
    { label: "Carta", href: "/carta" },
    { label: "Contacto", href: "#contacto" },
  ],
};

// Frases que rotan semanalmente. Filosofía + ciencia + tech + un toque de humor.
type Quote = { text: string; author: string; source?: string };

const QUOTES: Quote[] = [
  // Filosofía clásica
  { text: "Sólo sé que no sé nada.", author: "Sócrates" },
  { text: "El comienzo es la parte más importante del trabajo.", author: "Platón" },
  { text: "Somos lo que hacemos repetidamente. La excelencia no es un acto, es un hábito.", author: "Aristóteles" },
  { text: "Ningún hombre se baña dos veces en el mismo río.", author: "Heráclito" },
  { text: "Apártate, que me tapas el sol.", author: "Diógenes de Sinope", source: "a Alejandro Magno" },
  { text: "El obstáculo es el camino.", author: "Marco Aurelio", source: "Meditaciones" },
  { text: "No hay viento favorable para quien no sabe a dónde va.", author: "Séneca" },
  { text: "No son las cosas las que perturban a los hombres, sino la opinión que tienen sobre ellas.", author: "Epicteto" },
  { text: "El hombre que mueve montañas comienza moviendo pequeñas piedras.", author: "Confucio" },
  { text: "Un viaje de mil millas comienza con un solo paso.", author: "Lao Tzu" },

  // Maestros espirituales
  { text: "El que esté libre de pecado, que tire la primera piedra.", author: "Jesús de Nazaret", source: "Juan 8:7" },
  { text: "Todo lo que somos es el resultado de lo que hemos pensado.", author: "Buda", source: "Dhammapada" },
  { text: "Tu peor enemigo no puede dañarte tanto como tus propios pensamientos no vigilados.", author: "Siddhartha Gautama" },

  // Filosofía moderna
  { text: "Es mejor ser temido que amado, si no se puede ser ambos.", author: "Nicolás Maquiavelo", source: "El Príncipe" },
  { text: "Quien tiene un porqué para vivir, puede soportar casi cualquier cómo.", author: "Friedrich Nietzsche" },
  { text: "El talento alcanza un blanco que nadie más puede alcanzar. El genio alcanza un blanco que nadie más puede ver.", author: "Arthur Schopenhauer" },
  { text: "Atrévete a saber.", author: "Immanuel Kant" },
  { text: "La vida sólo puede ser comprendida mirando hacia atrás, pero ha de ser vivida mirando hacia adelante.", author: "Søren Kierkegaard" },
  { text: "Los límites de mi lenguaje son los límites de mi mundo.", author: "Ludwig Wittgenstein" },
  { text: "En medio del invierno aprendí, por fin, que había en mí un verano invencible.", author: "Albert Camus" },
  { text: "Toda la infelicidad del hombre proviene de una sola cosa: no saber estar quieto en una habitación.", author: "Blaise Pascal" },
  { text: "Lo perfecto es enemigo de lo bueno.", author: "Voltaire" },
  { text: "Lo que los hombres realmente quieren no es conocimiento, sino certeza.", author: "Bertrand Russell" },

  // Ciencia
  { text: "Lo importante es no dejar de hacerse preguntas.", author: "Albert Einstein" },
  { text: "Un experto es alguien que ha cometido todos los errores posibles en un campo muy reducido.", author: "Niels Bohr" },
  { text: "El primer principio es que no debes engañarte a ti mismo, y tú eres la persona más fácil de engañar.", author: "Richard Feynman" },
  { text: "En algún lugar, algo increíble está esperando ser conocido.", author: "Carl Sagan" },
  { text: "Nada en la vida debe ser temido, sólo entendido.", author: "Marie Curie" },
  { text: "El presente es suyo; el futuro, por el que realmente he trabajado, es mío.", author: "Nikola Tesla" },
  { text: "Si he visto más lejos, es porque estoy parado sobre los hombros de gigantes.", author: "Isaac Newton" },
  { text: "No es la especie más fuerte la que sobrevive, ni la más inteligente, sino la que mejor se adapta al cambio.", author: "Charles Darwin" },
  { text: "Y sin embargo, se mueve.", author: "Galileo Galilei" },
  { text: "No observamos la naturaleza misma, sino la naturaleza expuesta a nuestro método de interrogación.", author: "Werner Heisenberg" },
  { text: "Una nueva verdad científica no triunfa convenciendo a sus oponentes, sino porque sus oponentes mueren.", author: "Max Planck" },
  { text: "A veces son las personas de las que nadie se imagina nada quienes hacen las cosas que nadie puede imaginar.", author: "Alan Turing" },
  { text: "La imaginación es la facultad descubridora, ante todo. Es lo que penetra en mundos invisibles.", author: "Ada Lovelace" },
  { text: "La parte más triste de la vida ahora mismo es que la ciencia gana conocimiento más rápido que la sociedad sabiduría.", author: "Isaac Asimov" },

  // Tech
  { text: "Mantente hambriento. Mantente insensato.", author: "Steve Jobs", source: "Stanford, 2005" },
  { text: "Hagas lo que hagas, hazlo lo mejor que puedas.", author: "Tim Cook" },
  { text: "Nunca confíes en una computadora que no puedas tirar por la ventana.", author: "Steve Wozniak" },
  { text: "Mis clientes más insatisfechos son mi mayor fuente de aprendizaje.", author: "Bill Gates" },
  { text: "Hablar es barato. Muéstrame el código.", author: "Linus Torvalds" },

  // Pensadores / arte
  { text: "La simplicidad es la máxima sofisticación.", author: "Leonardo da Vinci" },
  { text: "No cambias las cosas luchando contra la realidad existente. Para cambiar algo, construye un nuevo modelo que haga obsoleto al anterior.", author: "Buckminster Fuller" },
  { text: "El triste hecho es que la mayor parte del mal lo hace gente que nunca decidió ser buena ni mala.", author: "Hannah Arendt" },

  // Cine
  { text: "No fui a la escuela de cine. Fui al cine.", author: "Quentin Tarantino" },
  { text: "Amo a los monstruos del modo en que otros adoran imágenes sagradas.", author: "Guillermo del Toro" },

  // Cultura pop / ficción
  { text: "A veces empiezo una oración y ni siquiera sé a dónde va. Espero encontrarme con la respuesta en el camino.", author: "Michael Scott", source: "The Office" },
  { text: "¿Qué hay de nuevo, viejo?", author: "Bugs Bunny" },
  { text: "¡Eres despreciable!", author: "Pato Lucas" },
  { text: "Hay un bien y un mal en el universo, y la distinción no es difícil de hacer.", author: "Superman", source: "Action Comics #775" },
  { text: "Cada elección tiene una consecuencia.", author: "Clark Kent", source: "Smallville · Tom Welling" },
  { text: "El poder no se da. Se toma.", author: "Lex Luthor", source: "Smallville" },
  { text: "Un gran poder conlleva una gran responsabilidad.", author: "Spider-Man", source: "Tío Ben" },
  { text: "No es quien soy debajo, sino lo que hago, lo que me define.", author: "Batman", source: "Batman Begins" },
  { text: "Mi nombre es Barry Allen y soy el hombre más rápido del mundo.", author: "The Flash" },
  { text: "¡Muerde mi brillante trasero metálico!", author: "Bender", source: "Futurama" },
  { text: "¡Cállate y toma mi dinero!", author: "Philip J. Fry", source: "Futurama" },
  { text: "¡Buenas noticias a todos!", author: "Profesor Farnsworth", source: "Futurama" },
];

// Semana del año — base para rotar la quote sin dependencias externas.
function getWeekOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return Math.floor((days + start.getDay()) / 7);
}

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const quote = QUOTES[getWeekOfYear(new Date()) % QUOTES.length];

  return (
    <footer
      className="relative w-full"
      style={{ background: "#070b13", color: "#f5f5f5" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5"
          >
            <h3
              className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight font-normal italic"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {FOOTER.name}.
            </h3>
            <p className="mt-4 text-sm md:text-base text-white/70 max-w-md leading-relaxed">
              {FOOTER.tagline}
            </p>
            <p className="mt-6 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/50">
              {FOOTER.location}
            </p>
          </motion.div>

          {/* Navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-3"
          >
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/50 mb-5">
              Navegación
            </p>
            <ul className="space-y-3">
              {FOOTER.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-base md:text-lg text-white/85 hover:text-white transition-colors"
                  >
                    <span className="border-b border-transparent group-hover:border-white/40 transition-colors">
                      {item.label}
                    </span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 -rotate-45 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-4"
          >
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/50 mb-5">
              Contacto
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${FOOTER.email}`}
                  className="group inline-flex items-center gap-3 text-sm md:text-base text-white/85 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-mono">{FOOTER.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={FOOTER.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-sm md:text-base text-white/85 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-mono">{FOOTER.whatsapp.label}</span>
                </a>
              </li>
              <li>
                <a
                  href={FOOTER.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-sm md:text-base text-white/85 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-mono">{FOOTER.linkedin.label}</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Frase de la semana — rota cada semana del año */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 md:mt-20 max-w-2xl"
        >
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/50 mb-4">
            Frase de la semana
          </p>
          <p
            className="text-xl md:text-2xl lg:text-3xl text-white/70 leading-snug italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            “{quote.text}”
          </p>
          <p className="mt-4 text-sm text-white/50 font-mono">
            — {quote.author}
            {quote.source && (
              <span className="text-white/30">, {quote.source}</span>
            )}
          </p>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-14 md:mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-white/40">
            © {year} Juan Fernández · juanfernandez.lol
          </p>
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-white/40">
            <EasterEgg />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
