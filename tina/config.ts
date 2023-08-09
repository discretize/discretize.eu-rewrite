import { defineConfig } from "tinacms";

export default defineConfig({
  localContentPath: "../discretize-guides",
  branch: "staging",

  clientId: null, // Get this from tina.io
  token: null, // Get this from tina.io

  build: {
    outputFolder: "cms",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "builds",
        label: "Builds",
        path: "builds/",
        format: "mdx",

        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                label: "Boon",
                name: "Boon",
                fields: [
                  {
                    type: "string",
                    name: "name",
                    label: "Name",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
