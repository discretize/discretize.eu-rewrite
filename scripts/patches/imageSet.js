import fs from "fs";
import sharp from "sharp";

const rootDir = "./discretize-ui/gw2-ui/src/";
const cssFiles = [
  "Attribute/Attribute.module.css",
  "Effect/Effect.module.css",
  "Profession/Profession.module.css",
  "Race/Race.module.css",
  "Error/Error.module.css",
  "Icon/Icon.module.css",
  "TooltipContainer/TooltipContainer.module.css",
  "TraitLine/TraitLine.module.css",
];

const callback = (err, info) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Image resized successfully:", info);
  }
};

for (const cssFile of cssFiles) {
  const css = fs.readFileSync(rootDir + "components/" + cssFile, "utf-8");

  if (css.indexOf("image-set") !== -1) {
    console.log("Skipping", cssFile);
    continue;
  }

  const regex = /url\(([^)]+)\)/g;

  const newCss = css.replace(regex, (match, p1) => {
    const url = p1.replace(/["']/g, "");

    const filename = url.split("/").pop();
    const baseFileName = filename.split(".")[0];

    const targetFile = url.replace("../../", rootDir);
    const outputFile = targetFile.replace(filename, baseFileName);

    if (!fs.existsSync(targetFile)) {
      console.error("File not found:", targetFile);
      return match;
    }

    console.log("Processing:", targetFile, "to", outputFile);

    // optimize with sharp
    sharp(targetFile).toFile(outputFile + ".webp", callback);
    sharp(targetFile).toFile(outputFile + ".avif", callback);

    const newUrl = `url("${url.replace(".png", "")}`;
    const imageSet = `image-set(${newUrl}.avif") type("image/avif"), ${newUrl}.webp") type("image/webp"))`;

    // keep original image as background
    return newUrl + '.png");\n  background-image: ' + imageSet;
  });

  console.log(newCss);

  fs.writeFileSync(rootDir + "components/" + cssFile, newCss);
}
