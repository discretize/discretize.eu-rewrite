import axios from "axios";
import fs from "fs";

const MAX_ITEMS_PER_REQUEST = 200;
const MAPPINGS_PATH = "../src/utils/remark/remark-inject-data/mapping/";

function fetchSpecializations() {
  console.log("Fetching specializations...");
  // get item stats (affixes)
  axios.get("https://api.guildwars2.com/v2/specializations").then((res) => {
    axios
      .get(`https://api.guildwars2.com/v2/specializations?ids=${res.data}`)
      .then((response) => {
        const specs = response.data;

        // write to disk
        fs.writeFile(
          `${MAPPINGS_PATH}specializations.json`,
          JSON.stringify(specs),
          { flag: "w+" },
          (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Successfuly wrote specializations.json");
            }
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function fetchTraits() {
  console.log("Fetching traits...");
  // get item stats (affixes)
  axios.get("https://api.guildwars2.com/v2/traits").then((res) => {
    const arrayOfArrays = [];
    for (let i = 0; i < res.data.length; i += MAX_ITEMS_PER_REQUEST) {
      arrayOfArrays.push(res.data.slice(i, i + MAX_ITEMS_PER_REQUEST));
    }

    const requests = arrayOfArrays.map((arr) =>
      axios.get(`https://api.guildwars2.com/v2/traits?ids=${arr}`)
    );
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          const traits = responses.flatMap((r) => r.data);

          // write to disk
          fs.writeFile(
            `${MAPPINGS_PATH}traits.json`,
            JSON.stringify(traits),
            { flag: "w+" },
            (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Successfuly wrote traits.json");
              }
            }
          );
        })
      )
      .catch((error) => {});
  });
}

function fetchSkills() {
  console.log("Fetching skills...");
  // get item stats (affixes)
  axios.get("https://api.guildwars2.com/v2/skills").then((res) => {
    const arrayOfArrays = [];
    for (let i = 0; i < res.data.length; i += MAX_ITEMS_PER_REQUEST) {
      arrayOfArrays.push(res.data.slice(i, i + MAX_ITEMS_PER_REQUEST));
    }

    const requests = arrayOfArrays.map((arr) =>
      axios.get(`https://api.guildwars2.com/v2/skills?ids=${arr}`)
    );
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          const skills = responses.flatMap((r) => r.data);

          // write to disk
          fs.writeFile(
            `${MAPPINGS_PATH}skills.json`,
            JSON.stringify(skills),
            { flag: "w+" },
            (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Successfuly wrote skills.json");
              }
            }
          );
        })
      )
      .catch((error) => {});
  });
}

function fetchItems() {
  console.log("Fetching items...");
  axios
    .get(`https://api.datawars2.ie/gw2/v1/item_data/json`)
    .then((response) => {
      const items = response.data
        .filter((item) => item.id)
        .map(({ id, icon, description, name, rarity }) => ({
          id,
          icon,
          description,
          name,
          rarity,
        }));

      // write to disk
      fs.writeFile(
        `${MAPPINGS_PATH}items.json`,
        JSON.stringify(items),
        { flag: "w+" },
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Successfuly wrote items.json");
          }
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
}
fetchSpecializations();
fetchTraits();
fetchSkills();
fetchItems();

/* fetches the entire skill api
function fetchSkills_Data() {
  console.log('Fetching skills...');
  // get item stats (affixes)
  axios.get('https://api.guildwars2.com/v2/skills').then((res) => {
    console.log(res.data.length);
    const arrayOfArrays = [];
    for (let i = 0; i < res.data.length; i += MAX_ITEMS_PER_REQUEST) {
      arrayOfArrays.push(res.data.slice(i, i + MAX_ITEMS_PER_REQUEST));
    }

    const requests = arrayOfArrays.map((arr) =>
      axios.get(`https://api.guildwars2.com/v2/skills?ids=${arr}`),
    );
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          const skills = responses
            .flatMap((r) => r.data)
            .filter((skill) => normalize(skill.name))
            .filter(
              (skill) => skill.professions && skill.professions.length > 0,
            );

          fs.writeFile(
            `${MAPPINGS_PATH}skills_temp.json`,
            JSON.stringify(skills),
            { flag: 'w+' },
            (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log('Successfuly wrote skills.json');
              }
            },
          );
        }),
      )
      .catch((error) => {});
  });
}
fetchSkills_Data();
*/
