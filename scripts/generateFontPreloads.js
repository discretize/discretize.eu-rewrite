import fs from "fs";

const PRELOAD = ["raleway-latin-400.", "menomonia"];

let preload = "/*\n  Link: ";
// list files in /dist/_astro
fs.readdir("./dist/_astro", (err, files) => {
  if (err) {
    console.log(err);
    return;
  }

  // filter out files that aren't fonts
  const fonts = files.filter(
    (file) =>
      file.includes(".woff") && PRELOAD.some((pre) => file.includes(pre))
  );

  // generate preload links
  fonts.forEach((font) => {
    const ending = font.split(".").pop();
    const name = `</_astro/${font}>; rel=preload; as=font; type=font/${ending} crossorigin=anonymous; `;
    preload += name;
  });

  fs.writeFileSync("dist/_headers", preload);
});
