//node bote.js

const puppeteer = require("puppeteer");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function envoyerSMS(message) {
  const accountSid = "code de mon compte twilio";
  const authToken = "mon token twilio";
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: message,
      from: "+12345678910",
      to: "+12345678910",
    })
    .then((message) => console.log(message.sid));
}
async function emploieDuTemps() {
  const brower = await puppeteer.launch({ headless: false });
  const page = await brower.newPage();
  await page.goto("https://0352318e.index-education.net/pronote/eleve.html");
  await sleep(5000);

  await page.type("#id_22", "id");
  await page.type("#id_23", "mdp");
  await page.click("#id_11");
  await sleep(5000);

  var matieres = [];
  const elementsSpan = await page.evaluate(() => {
    // Sélectionner tous les éléments <span> avec la classe "wai_hidden"
    const spans = Array.from(document.querySelectorAll("span.wai_hidden"));
    // Récupérer les textes de tous les éléments <span>
    return spans.map((span) => span.textContent.trim());
  });

  elementsSpan.forEach((texte) => {
    if (texte.startsWith("de")) {
      matieres.push(texte.slice(2));
      //-de 9h30 à 10h30 SCIENCES VIE & TERRE = 9h30 a 10h30 SVT
    }
  });
  matieres = matieres.map(function (value) {
    return "-" + value;
  });
  var m = [];
  for (var i = 0; i < matieres.length; i++) {
    var matieres_ = "";

    matieres_ = matieres[i]
      .replace("PHYSIQUE-CHIMIE", "PC")
      .replace("SCIENCES VIE & TERRE", "SVT")
      .replace("ED.PHYSIQUE & SPORT.", "EPS")
      .replace("Pas de cours", "pause")
      .replace("ESPAGNOL LV2", "LV2")
      .replace("ANGLAIS LV1", "LV1")
      .replace("PHILOSOPHIE", "PHILO")
      .replace("HISTOIRE-GEOGRAPHIE", "H-G")
      .replace("NUMERIQUE SC.INFORM.", "NSI")
      .replace("MATHEMATIQUES", "MATHS")
      .replace("Pause Déjeuner", "Manger");
    console.log(matieres_);
    m.push(matieres_);
  }
  console.log(m);
  envoyerSMS(m.join("\n"));
  sleep(15000);

  await brower.close();
}

emploieDuTemps();
setInterval(emploieDuTemps, 1000 * 30);
