import fs from "node:fs";
import frontmatter from "frontmatter";

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

const frontmatterReader = async (file: string) => {
  const data = await readFile(file);
  // extract frontmatter from file
  const fm = frontmatter(data);
  return { frontmatter: fm.data, url: file };
};

export default frontmatterReader;
