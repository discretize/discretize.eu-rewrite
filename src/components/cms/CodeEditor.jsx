import ace from "ace-builds";
import AceEditor from "react-ace";
import { ACE_PROPS, AUTO_COMPLETIONS } from "./aceEditorOptions";
import React from "react";

import "ace-builds/src-noconflict/ext-language_tools"; // needed for autocompletions
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-twilight";

const CodeEditor = ({ value, onChange }) => {
  React.useEffect(() => {
    const langTools = ace.require("ace/ext/language_tools");
    const autoCompletions = {
      getCompletions: (editor, session, pos, prefix, callback) => {
        callback(null, AUTO_COMPLETIONS);
      },
    };
    langTools.addCompleter(autoCompletions);
  }, []);

  return (
    <AceEditor
      theme="twilight"
      value={value}
      onChange={onChange}
      maxLines={100}
      {...ACE_PROPS}
    />
  );
};

export default CodeEditor;
