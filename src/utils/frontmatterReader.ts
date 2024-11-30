import fs from "node:fs";
import frontmatter from "frontmatter";

interface FrontmatterOutput {
  frontmatter: Record<string, any>;
  url: string;
}

async function readFile(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(
      path,
      "utf8",
      function (err: NodeJS.ErrnoException | null, data: string) {
        if (err) {
          reject(err);
        }
        resolve(data);
      },
    );
  });
}

const frontmatterReader = async (file: string): Promise<FrontmatterOutput> => {
  const data = await readFile(file);
  // extract frontmatter from file
  const fm = frontmatter(data);
  return { frontmatter: fm.data, url: file };
};

export default frontmatterReader;
