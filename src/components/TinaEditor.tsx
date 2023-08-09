import React from "react";
import { useCMS } from "tinacms";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina } from "tinacms/dist/react";

const QUERY = `query {
  builds(relativePath: "guardian/power-dragonhunter/index.mdx") {
    body
  }
}`;

export default function Page(props) {
  //   const cms = useCMS();

  //   React.useMemo(() => {
  //     cms.flags.set("rich-text-alt", true);
  //   }, [cms]);

  const blub = useTina({
    query: QUERY,
    variables: {},
    data: props.content,
  });

  console.log(blub);

  if (blub.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="prose">
          <TinaMarkdown content={data.content} components={{}} />
        </div>
      </div>
    </div>
  );
}
