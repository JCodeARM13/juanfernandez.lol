import type { Metadata } from "next";

import PapeleriaTool from "./papeleria-tool";

export const metadata: Metadata = {
  title: "Papelería · Juan Fernández",
  description:
    "Genera e imprime cualquier hoja —cuadrícula, pentagrama, planner, milimétrico, Cornell, isométrico— a tamaño exacto (A4, Carta, A5…). 100% en tu navegador.",
  alternates: { canonical: "https://juanfernandez.lol/papeleria" },
};

export default function PapeleriaPage() {
  return <PapeleriaTool />;
}
