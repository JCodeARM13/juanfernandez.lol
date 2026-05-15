"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

export const LetterContent: React.FC = () => {
  return (
    <article className="carta">
      <motion.header className="carta-header" {...fadeIn}>
        <h1 className="carta-title">Farewell Letter</h1>
        <p className="carta-greeting">
          To my friends and colleagues at{" "}
          <span className="carta-lyft">Lyft</span>:
        </p>
        <p className="carta-date">Abril 2026 · Tlalnepantla, MX</p>
      </motion.header>

      <div className="carta-glass">
        <motion.section className="carta-intro" {...fadeIn}>
          <p>
            We don&apos;t always get to choose when something ends. But we do
            get to choose how we close it and what we carry with us.
          </p>
          <p>
            After some well-deserved time off, I&apos;ve decided to sit down
            and write this before April closes out. I&apos;m no longer part of
            the Lyft team as Vendor Lead, and I didn&apos;t want to let this
            chapter end without thanking the people who made it what it was.
          </p>
        </motion.section>

        <motion.section className="carta-body" {...fadeIn}>
          <p>
            <strong>Allison Kupers</strong>, thank you for believing in me and
            giving me this opportunity. You are an extraordinary manager with
            a rare ability to execute and bring projects to life. I wish I had
            more time to keep learning from you.
          </p>
          <p>
            <strong>Lindsay Schilling</strong>, you taught me something
            I&apos;ll carry forever: don&apos;t put band-aids on problems.
            Find the root cause, close things properly, and build solutions
            that last. That lesson is engraved in me.
          </p>
          <p>
            To <strong>Chris</strong>, <strong>Bianca</strong>, and{" "}
            <strong>Caleb</strong>, I always knew I could come to you with any
            question and you&apos;d have my back. To <strong>Naiomi</strong>{" "}
            and <strong>Diana Dorantes</strong>, thank you for training me and
            helping me so much during onboarding, and for being such wonderful
            people. To <strong>Angela Chang</strong> and{" "}
            <strong>Nick Adkins</strong>, you were always there delivering
            important updates and steady support for all teams. That
            doesn&apos;t go unnoticed.
          </p>
          <p>
            <strong>Tommy</strong>, Aristotle once said:{" "}
            <em>
              &ldquo;We are what we repeatedly do. Excellence, then, is not an
              act, but a habit.&rdquo;
            </em>{" "}
            That reminds me of you. I&apos;m sure your big moment is coming
            soon, because you are a star. And if you ever want to start
            collecting vintage stuff or vinyl records, give me a call.
          </p>
          <p>
            <strong>Will</strong>, thank you for always raising the bar, for
            pushing from every angle, for never settling. You are an example.{" "}
            <strong>Marcus</strong>, see you later, bro. I hope your son and
            your wife are doing great, I just wish you an amazing year
            alongside your whole family. <strong>Jessica</strong>, thank you
            for being there during my first days at Lyft Business and for
            teaching me so many things. <strong>Corisha</strong>, you were my
            quasi learning partner while Tommy onboarded us. Watching you grow
            little by little alongside me, and seeing everything you
            accomplished after, was really something.
          </p>
          <p>
            <strong>Masha Scott</strong>, thank you for always being difficult,
            for asking questions I didn&apos;t have answers to, for never
            settling for a simple response. You have an unusually cool mind.
          </p>
          <p>
            <strong>Andrés Castelán</strong>, as I told you before, I think
            you&apos;re a pro athlete at what you do. You truly care about
            what happens to people, and that&apos;s not something you see
            often in a People team.
          </p>
          <p>
            <strong>Daniela Trujillo</strong>, Dani, even though you&apos;re
            no longer at Lyft, you had to be part of this. You are just as
            important as everyone else here. Thank you for always creating the
            best environment and the warmest welcomes.
          </p>
          <p>
            <strong>Christian Uriel</strong>, watching your growth during this
            year and change was incredible. Seeing how happy you were while
            achieving everything you did. Keep being the most diva diva in all
            of Lyft Mexico.
          </p>
          <p>
            <strong>Mauricio Zavala</strong> and <strong>Elena</strong>, thank
            you for always supporting me and helping me. I hope I was equally
            reciprocal to both of you. <strong>Karime</strong>, thank you for
            being not only incredibly capable but also for having a huge
            heart, especially for social causes, the ones society often
            ignores the most. Always keep that drive to help others.
          </p>
          <p>
            <strong>Miguel Berbeyer</strong>, the coolest dude in the office.
            When I grow up, I want to be like you.{" "}
            <strong>Gaby Saucedo</strong>, I can say it here publicly: I
            believe you are the best Workspace Manager Lyft could have in the
            entire company.
          </p>
          <p>
            To the Ibex team: <strong>Dulce</strong>, <strong>Gil</strong>,{" "}
            <strong>Paula Gómez</strong>,{" "}
            <strong>Chester Lance Claro</strong>, <strong>Karylle</strong>,{" "}
            <strong>Fernando</strong>, and <strong>She</strong>. You are
            incredible. The dedication, the energy, the willingness to always
            show up and deliver. Keep pushing forward and know that the work
            you do matters more than you think.
          </p>
          <p>
            And to <strong>Laura García</strong>,{" "}
            <strong>Courtney Osborn</strong>, <strong>David López</strong>,
            and everyone else I haven&apos;t mentioned by name but who shared
            the trenches with me: thank you. The list is longer than this
            letter.
          </p>
        </motion.section>

        <motion.div className="carta-divider" {...fadeIn}>
          <em>
            Now, for the sole purpose of being able to express my emotions in
            the best way possible and to put my heart where my words are, the
            following lines will be in Spanish.
          </em>
        </motion.div>

        <motion.section className="carta-spanish" {...fadeIn}>
          <p>
            <strong>Samantha Flores</strong>, mi querida Sam. No solamente te
            considero una gran compañera, también una amiga. Durante todo este
            tiempo demostraste algo muy importante que muchas veces no se
            dice, pero siempre está ahí haciéndose. Eres el ejemplo perfecto
            de que las cosas que se combinan mejoran muchísimo. No es que te
            sintiera como una hermana mexicana con una gran pronunciación del
            español y un estilo muy cool. Eres una gran persona, Sam, y
            tienes una gran carrera por delante. Siempre vas a llevar un
            lugar especial en mi corazón, porque siempre estuviste ahí para
            apoyarme y, cuando algo pasaba, siempre estabas ahí para echarme
            una mano. Cuando vengas a México, te invito unos tequilas y unos
            tacos veganos.
          </p>
          <p>
            <strong>Larissa Borne</strong>, gracias por enseñarme tantas
            cosas. Eres una persona increíble. Como te lo dije hace mucho
            tiempo: no somos personas racionales siendo emocionales; somos
            personas emocionales siendo racionales. Nunca despersonalices tu
            humanidad y tu corazón de tu trabajo, porque cuando sigues ambos
            es cuando encuentras las mayores satisfacciones de tu vida. No
            solamente en lo que haces, sino en las personas a las que tocas
            con la forma en la que trabajas. Sé que lo haces y lo haces muy
            bien. Gracias por siempre estar ahí con una cálida sonrisa y
            aprecio. Te llevo en mi corazón.
          </p>
        </motion.section>

        <motion.footer className="carta-footer" {...fadeIn}>
          <p className="carta-cierre">
            Bueno, ya. Antes de que esto se ponga más cursi de lo que ya está:
            cuídense.
          </p>
          <p className="carta-firma">— Juan</p>
        </motion.footer>

        <motion.section className="carta-downloads" {...fadeIn}>
          <a
            href="/letters/farewell-letter.pdf"
            download
            className="carta-download-link"
          >
            <Download className="w-3 h-3" />
            <span>PDF original</span>
          </a>
          <span className="carta-download-sep" aria-hidden>
            ·
          </span>
          <a
            href="/letters/farewell-letter-combined.png"
            download
            className="carta-download-link"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Imagen para LinkedIn</span>
          </a>
        </motion.section>
      </div>
    </article>
  );
};

export default LetterContent;
