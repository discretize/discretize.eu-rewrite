import fs from "fs";

const toRemove = "if (typeof navigator === 'undefined') ";
const target = "discretize-ui/gw2-ui/src/i18n/index.ts";

fs.readFile(target, "utf8", (err, data) => {
  if (err) {
    return console.log(err);
  }

  const result = data.replace(toRemove, "");

  fs.writeFile(target, result, "utf8", (err) => {
    if (err) return console.log(err);
  });
});
