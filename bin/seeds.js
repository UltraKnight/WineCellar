// Iteration #1
require('dotenv').config();
const mongoose = require('mongoose');
const Wine = require('../models/Wine.model');
const User = require('../models/User.model');
require('../configs/db.config');

let wineKeeperId;
let wines;

async function createWineKeeperUser() {
  try {
    const foundUser = await User.findOne({username: 'WineKeeper'});
    if(! foundUser) {
      await User.create({
        username: 'WineKeeper',
        email: 'winekeeper@outlook.com',
        password: process.env.WINE_KEEPER_PASS
      });
      console.log('WineKeeper user created.');
    } else {
      console.log('WineKeeper user already exists.');
    }
  } catch (error) {
    console.log(`Error while creating WineKeeper user: ${error}`);
    return;
  }
}

async function getWineKeeperId() {
  try {
    const user = await User.findOne({username: 'WineKeeper'});
    if(!user) {
      console.log('Could\'nt recover WineKeeper id');
      return;
    }
    wineKeeperId = user.id;
  } catch(error) {
    console.log(`Error retrieving WineKeeper id ${error}`);
    return;
  }
}

function createArray() {
    wines = [
    {
      name: 'Quinta da Vacaria 10 anos',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: null,
      annotations: '',
      type: 'porto',
      blend: '',
      abv: 20,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Casal das Aires Chardonnay',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2018,
      annotations: 'Casal das Aires is a family property in the Tejo wine region, focusing on organic growing and premium wines.',
      type: 'white',
      blend: '',
      abv: 12.5,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Post Scriptum',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2018,
      annotations: 'In November 1998, the Symington family proposed that Bruno Prats should take part in a new project to produce a top quality, non-fortified Dourowine. This proposal took shape in 1999 with the creation of PRATS & SYMINGTON Limitada as an equal partnership between the two families. Experimental production in this first year enabled the best plots and most suitable grape varieties for the project to be selected. The CHRYSEIA 2000 was the first vintage to be released.',
      type: 'red',
      blend: '',
      abv: 14.5,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Niepoort Lagar de Baixo',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2018,
      annotations: "An independent family business since 1842, through five generations. With the position of \"niche player\", Niepoort's mission is to maintain the production of distinctive ports and Dourowines, combining centuries-old tradition with innovation. This combination has come to include throughout our growth wines from two other regions that have contributed to marking out the Douro- Bairrada - Dão triangle. The importance we attach to the need to interpret soils, climates and grape varieties has led us on the path of Biodynamics, giving particular attention to the interrelationship between all the people involved.",
      type: 'red',
      blend: '',
      abv: 12.5,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Quinta do Passadouro Touriga Nacional',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2017,
      annotations: "Quinta do Passadouro is located in the world-renowned DouroValley, on the left bank of the Pinhão River. The owners of this estate are the Bohrmann family in partnership with Jorge Serôdio Borges. Jorge’s underlying philosophy for his wines is to achieve balance, with ripeness being particularly important, and the retention of good levels of acidity. The vines at Passadouro are grafted with indigenous varieties from the Douro, like Touriga Nacional, Touriga Franca, Tinta Roriz, Sousão, Tinta Barroca. Over the last few years, large investments were made to modernize the vineyards and install modern winery equipment in order to produce high quality table wines. The port wines, however, are still 100% \"foot trodden\” in traditional granite \"lagares\”.",
      type: 'red',
      blend: '',
      abv: 14.5,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Vinha do Fojo',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2015,
      annotations: "Depending on the years, the wines produced at the estate are Vinha do Fojo or Fojo. Always and exclusively from the same vineyard, an old vine with mixed varieties. These are long-lasting wines, produced in a traditional way, in foot treading “lagares”. We work with the utmost respect for the vineyard and its product, with no oenological practices that manipulate the end result and that separate the wine from its root – the vine.",
      type: 'red',
      blend: '',
      abv: 14,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Prazo de Roriz',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2017,
      annotations: "",
      type: 'red',
      blend: '',
      abv: 14,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Quinta da Pacheca Dezoito by Maniche',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2018,
      annotations: "Quinta da Pacheca, one of the best known estates in the Douroregion, was also one of the first properties to bottle wine under its own label. It is first mentioned in a document dated April 1738, where is it referred as \“Pacheca’s\”, because it was property of D. Mariana Pacheco Pereira. But it was only in 1903, when Dom José Freire de Serpa Pimentel decided to develop his interest in oenology, that he bought the estate and began to seriously dedicate himself to the risky business of winemaking. Today, a century and many successes later, a brand-new generation of the Serpa Pimentel family is at the head of Quinta da Pacheca: Maria, Catarina and José are the young new faces of this family old company.",
      type: 'red',
      blend: '',
      abv: 14,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Tons de Duorum',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2018,
      annotations: "Two Winemakers who have made history in Portugal over the last few decades, in two regions that the world recognises as being of high quality and having strong personality, the Douroand Alentejo, meet again in a project thought out for the Douro, in the regions of the Cima Corgo and Hight Douro, two exceptional and protected terroirs. Thus, Duorum is born, a project \"from two\", envisaged and brought to life in the age-old vineyards of the Douro. Duorum Wines started in January 2007 as an expression of wishes of João Portugal Ramos and José Maria Soares Franco wishes to join their activities as professional winemakers in one wine production project from Douroregion, with unique characteristics and an international dimension.",
      type: 'red',
      blend: '',
      abv: 13.5,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Rola de Tinto',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2019,
      annotations: 'The philosophy of this project stems from the brand name itself, "ROLA". The goal of Ana Rola is to create wines "that actually have a Source", born in Specific Vineyards, with little or no intervention. True and honest wines of the Douro... but always with elegance, as a background! Associated with her best friend, Helga Rodrigues, architect and from Douro region, Ana and Helga decided to go in search of unique vineyards to make the ultimate goal of creating wines with personality. Quinta de Remostias, owned by Ana Rola, located in Remostias valley between Régua and Santa Marta Penaguião, works like a "True Atelier" for their creations. To a short and Modern Cellar arrive Red and White Grapes from the property, to which are added other, from selected vineyards in the best areas of the Douro.',
      type: 'red',
      blend: '',
      abv: 14,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Duas Margens',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2019,
      annotations: 'Quinta da Vacaria, is one of the oldest farms in the region (first record from 1616), is situated on the banks of Douro River near the town of Régua, in the heart of Douro´s oldest Branded Region. On the quay of the farm use to dock the Rabelo Boats to load the kites filled with Port wine and transport them to Gaia, at the river mouth, where they were sold in bulk to the whole world, leaving behind their identity hidden, since these wooden hulls were not even branded with the producer´s seal. At the destination, the wine was bottled and labeled with the mark of the foreign merchants who acquired it in the meantime, some of them coming to gain considerable prestige.',
      type: 'white',
      blend: '',
      abv: 13,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Herdade do Monte Branco Rafeiro',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2019,
      annotations: 'With 200 years of tradition in wine production, the Monte Branco Estate, located in Alentejo, now reborn into a new phase. Their wines are a reflection of a terroir with maritime influence mingles with the continental force. Variations in temperature and humidity between day and night lead the vines and determine the ripeness of their grapes. The wines created here are like the mirror of the essence of the Alentejo, magnified by relentless dedication of a team. Currently approximately 200 hectares estate is still a privileged area of contact with nature, reserved for users of this space.',
      type: 'white',
      blend: '',
      abv: 13.5,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
    {
      name: 'Herdade do Monte Branco Rafeiro',
      createdBy: wineKeeperId,
      country: 'Portugal',
      year: 2019,
      annotations: 'With 200 years of tradition in wine production, the Monte Branco Estate, located in Alentejo, now reborn into a new phase. Their wines are a reflection of a terroir with maritime influence mingles with the continental force. Variations in temperature and humidity between day and night lead the vines and determine the ripeness of their grapes. The wines created here are like the mirror of the essence of the Alentejo, magnified by relentless dedication of a team. Currently approximately 200 hectares estate is still a privileged area of contact with nature, reserved for users of this space.',
      type: 'white',
      blend: '',
      abv: 13.5,
      drinkUntil: null,
      bottleSize: 750,
      closure: ''
    },
  ];
}

async function createWines() {
    try {
        await Wine.create(wines);
        console.log('Wines inserted!');
        mongoose.connection.close();
    } catch (error) {
        console.log(`Error while inserting wines ${error}`);
    }
}

async function populateDB() {
  try {
    await createWineKeeperUser();
    await getWineKeeperId();
    await createArray();
    await createWines();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

populateDB();