/**
 * Générateur automatique de search-index.json
 * Parcourt tous les fichiers HTML du site et extrait les titres + contenus
 * pour alimenter la recherche plein texte.
 * 
 * 📦 Nécessite : npm install jsdom
 * ▶️ Lancer avec : node generate-index.js
 */

import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const rootDir = "./"; // dossier racine du site
const outputFile = "search-index.json"; // nom du fichier de sortie
const maxLength = 2000; // limite du texte extrait par page

// Fonction principale
async function generateIndex() {
  const files = fs
    .readdirSync(rootDir)
    .filter(
      (f) =>
        f.endsWith(".html") &&
        !["index.html", "template.html"].includes(f) // exclusion de la page d’accueil ou modèle
    );

  const index = [];

  console.log(`🔍 Analyse de ${files.length} pages HTML...`);

  for (const file of files) {
    const html = fs.readFileSync(path.join(rootDir, file), "utf8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const title =
      document.querySelector("title")?.textContent ||
      file.replace(".html", "");

    // Nettoyage du texte
    const text = document.body.textContent
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    index.push({
      title: title,
      url: file,
      content: text.substring(0, maxLength),
    });
  }

  fs.writeFileSync(outputFile, JSON.stringify(index, null, 2), "utf8");
  console.log(`✅ ${outputFile} généré avec ${index.length} pages indexées.`);
}

generateIndex().catch((err) => console.error("Erreur :", err));