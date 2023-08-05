self.onmessage = (e) => {
  console.log("Message received from main script");
  console.log(e.data);
  const result = calculate(e.data);

  postMessage(result);
};

const MIST_ATTUNEMENTS = [
  {
    id: 299,
    name: "Mist Attunement 1",
    title: "Fractal Savant",
    relics: 25000,
    pristines: 0,
    matrices: 75,
    journals: 8,
  },
  {
    id: 297,
    name: "Mist Attunement 2",
    title: "Fractal Prodigy",
    relics: 35000,
    pristines: 1200,
    matrices: 150,
  },
  {
    id: 296,
    name: "Mist Attunement 3",
    title: "Fractal Champion",
    relics: 45000,
    pristines: 0,
    matrices: 225,
    journals: 16,
  },
  {
    id: 298,
    name: "Mist Attunement 4",
    title: "Fractal God",
    relics: 55000,
    pristines: 2000,
    matrices: 300,
  },
];

const calculate = ({
  relics,
  pristines,
  matrices,
  augment: rawAugment,
  journals,
  pages,
  cm100,
  cm99,
  cm98,
  cm97,
  t4s,
  recs,
  weekly,
  convertPots,
  extraRelicsEnable,
  extraRelicsValue,
}) => {
  const augment = parseInt(rawAugment, 10);

  let relicsPerDay = 0;
  let pristinesPerDay = 0;
  let matricesPerDay = 0;
  let pagesPerDay = 0;

  if (cm100) {
    relicsPerDay += 80 + 19 + augment * 5;
    pristinesPerDay += 2;
    matricesPerDay += 1;
  }

  if (cm99) {
    relicsPerDay += 80 + 19 + augment * 5;
    pristinesPerDay += 2;
    matricesPerDay += 1;
  }

  if (cm98) {
    // 20 per boss + 80 on completion relics
    relicsPerDay += 140 + 19 + augment * 5;
    pristinesPerDay += 2;
    matricesPerDay += 1;
    pagesPerDay += 1;
  }

  if (cm97) {
    relicsPerDay += 140 + 19 + augment * 5;
    pristinesPerDay += 2;
    matricesPerDay += 1;
    pagesPerDay += 1;
  }

  if (t4s) {
    relicsPerDay += 3 * 18.2 + 3 * augment * 5;
    pristinesPerDay += 12;

    if (cm100) {
      relicsPerDay -= (2 * (19 + augment * 5)) / 15; // 100 is 2 times daily per 15 days
    }

    if (cm99) {
      relicsPerDay -= (3 * (19 + augment * 5)) / 15; // 99 is 3 times daily per 15 days
    }
  }

  if (recs) {
    relicsPerDay +=
      15.8 + // T3 Fractal
      augment * 5 + // T3 Fractal Bag
      12 + // T2 Fractal
      augment * 3 + // T2 Fractal Bag
      7 + // T1 Fractal
      augment * 3; // T1 Fractal Bag

    pristinesPerDay += 3;
    pagesPerDay += 3;

    if (convertPots) {
      relicsPerDay += 48;
    }
  }

  if (weekly) {
    relicsPerDay += 48 / 7;
  }

  if (extraRelicsEnable) {
    console.log(Number(extraRelicsValue));
    relicsPerDay += Number(extraRelicsValue);
  }

  const buyableMistAttunements = MIST_ATTUNEMENTS.filter(
    (value, index) => index + 1 > augment
  ).reduce((result, value, index) => {
    const {
      relics: relicsCost = 0,
      pristines: pristinesCost = 0,
      matrices: matricesCost = 0,
      journals: journalsCost = 0,
    } = value;
    const {
      total: {
        relics: previousRelicsCost = 0,
        pristines: previousPristinesCost = 0,
        matrices: previousMatricesCost = 0,
        journals: previousJournalsCost = 0,
      },
    } = result[index - 1] || { total: {} };

    result.push({
      ...value,
      total: {
        relics: relicsCost + previousRelicsCost,
        pristines: pristinesCost + previousPristinesCost,
        matrices: matricesCost + previousMatricesCost,
        journals: journalsCost + previousJournalsCost,
      },
    });
    return result;
  }, []);

  const mistAttunements = buyableMistAttunements.map((value) => {
    const {
      total: {
        relics: rawRelicsCost,
        pristines: rawPristinesCost,
        matrices: rawMatricesCost,
        journals: rawJournalsCost,
      },
    } = value;
    let newRelics = parseInt(relics, 10);
    let newPristines = parseInt(pristines, 10);
    let newMatrices = parseInt(matrices, 10);
    let newJournals = parseInt(journals, 10);
    let newPages = parseInt(pages, 10);

    let pristinesToRelics = 0;
    if (
      newPristines > rawPristinesCost &&
      (newRelics < rawRelicsCost || newMatrices < rawMatricesCost)
    ) {
      pristinesToRelics = Math.min(
        (newRelics < rawRelicsCost ? (rawRelicsCost - newRelics) / 15 : 0) +
          (newMatrices < rawMatricesCost
            ? (rawMatricesCost - newMatrices) * 15
            : 0),
        newPristines - rawPristinesCost
      );
      newRelics += pristinesToRelics * 15;
      newPristines -= pristinesToRelics;
    }

    let relicsToMatrices = 0;
    // console.log('--------1---------');
    // console.log('rawrelics: ' + rawRelicsCost);
    // console.log("newRelics: " + newRelics);
    // console.log('rawMatrices: ' + rawRelicsCost);
    // console.log('newMatrices: ' + newMatrices);
    if (newRelics - rawRelicsCost >= 15 && newMatrices < rawMatricesCost) {
      // console.log('inside');
      relicsToMatrices = Math.min(
        (rawMatricesCost - newMatrices) * 15,
        Math.abs(newRelics - rawRelicsCost)
      );

      // if relics are the bottleneck, you gotta take into account the amount of relics you make while filling up that bottleneck
      newRelics -= relicsToMatrices;
      newMatrices += relicsToMatrices / 15;
    }
    // console.log('--------2---------');
    // console.log('rawrelics: ' + rawRelicsCost);
    // console.log("newRelics: " + newRelics);
    // console.log('rawMatrices: ' + rawRelicsCost);
    // console.log('newMatrices: ' + newMatrices);

    const totalPagesCost = rawJournalsCost * 28;
    const totalPagesCurrent = newJournals * 28 + newPages;

    const relicsCost = rawRelicsCost - newRelics;
    const pristinesCost = rawPristinesCost - newPristines;
    const matricesCost = rawMatricesCost - newMatrices;
    const pagesCost = Math.max(totalPagesCost - totalPagesCurrent, 0);

    let idealRelicsPerDay = relicsPerDay;
    let idealPristinesPerDay = pristinesPerDay;
    let idealMatricesPerDay = matricesPerDay;

    const daysForRelics = Math.max(relicsCost / idealRelicsPerDay, 0);
    const daysForPristines = Math.max(pristinesCost / idealPristinesPerDay, 0);
    const daysForMatrices = Math.max(matricesCost / idealMatricesPerDay, 0);
    const daysForJournals = pagesCost / pagesPerDay || 0;

    // console.log('--------3---------');
    // console.log('daysForRelics: ' + daysForRelics);
    // console.log("daysForPristines: " + daysForPristines);
    // console.log('daysForMatrices' + daysForMatrices);

    let days;
    if (daysForRelics > daysForPristines || daysForMatrices > daysForRelics) {
      // console.log('inside');
      days = Math.max(
        (15 * (pristinesCost + matricesCost) + relicsCost) /
          (15 * (idealPristinesPerDay + idealMatricesPerDay) +
            idealRelicsPerDay),
        daysForJournals
      );
      // console.log(days)

      idealRelicsPerDay = relicsCost / days;
      idealPristinesPerDay = pristinesCost / days;
      idealMatricesPerDay = matricesCost / days;
      // console.log('idealMatrices' + idealMatricesPerDay);
      // console.log('one: ' + (newMatrices > matricesCost) + ' two: ' + (idealMatricesPerDay < matricesPerDay));
      // console.log('--------3.5---------');
      // console.log('matricesCost: ' + matricesCost);
      // console.log('newMatrices: ' + newMatrices);
      let invalidMatrices = false;
      if (idealMatricesPerDay < matricesPerDay) {
        invalidMatrices = true;
        days = Math.max(
          (15 * pristinesCost + relicsCost) /
            (15 * pristinesPerDay + relicsPerDay),
          daysForMatrices,
          daysForJournals
        );
        // console.log('days: ' + days);

        idealRelicsPerDay = relicsCost / days;
        idealPristinesPerDay = pristinesCost / days;
        idealMatricesPerDay = matricesPerDay;

        // console.log('--------4---------');
        // console.log('idealMatrices' + idealMatricesPerDay)
        // console.log('idealPristines' + idealPristinesPerDay)
      }

      let invalidPristines = false;
      if (pristinesPerDay < idealPristinesPerDay) {
        invalidPristines = true;
        days = Math.max(
          (days =
            (15 * matricesCost + relicsCost) /
            (15 * matricesPerDay + relicsPerDay)),
          daysForPristines,
          daysForJournals
        );

        idealRelicsPerDay = relicsCost / days;
        idealPristinesPerDay = pristinesPerDay;
        idealMatricesPerDay = matricesCost / days;
      }

      if (invalidMatrices && invalidPristines) {
        // Sad, have to reset :(
        days = Math.max(
          daysForRelics,
          daysForPristines,
          daysForMatrices,
          daysForJournals
        );

        idealRelicsPerDay = relicsPerDay;
        idealPristinesPerDay = pristinesPerDay;
        idealMatricesPerDay = matricesPerDay;
      }
    } else {
      days = Math.max(
        daysForRelics,
        daysForPristines,
        daysForMatrices,
        daysForJournals
      );
    }

    return {
      ...value,
      days,
      standard: {
        daysForRelics,
        daysForPristines,
        daysForMatrices,
        daysForJournals,
      },
      convert: {
        pristinesToRelics:
          pristinesToRelics + (pristinesPerDay - idealPristinesPerDay) * days,
        relicsToMatrices:
          relicsToMatrices + (idealMatricesPerDay - matricesPerDay) * days * 15,
        pagesToJournals: (rawJournalsCost - newJournals) * 28,
      },
    };
  });

  return {
    daily: {
      relics: relicsPerDay,
      pristines: pristinesPerDay,
      matrices: matricesPerDay,
      pages: pagesPerDay,
    },
    mistAttunements: mistAttunements.reverse(),
  };
};
