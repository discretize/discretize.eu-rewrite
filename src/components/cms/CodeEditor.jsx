import ace from "ace-builds";
import AceEditor from "react-ace";
import React from "react";
import { AUTO_COMPLETIONS } from "./aceEditorOptions";

import "ace-builds/src-noconflict/ext-language_tools"; // needed for autocompletions
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-twilight";

const ACE_PROPS = {
  width: "100%",
  name: "MDEditor",
  showPrintMargin: false,
  tabSize: 2,
  mode: "markdown",
  wrapEnabled: true,
  setOptions: {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: false,
  },
};

class CodeEditor extends React.Component {
  constructor() {
    super();
    const langTools = ace.require("ace/ext/language_tools");
    const autoCompletions = {
      getCompletions: (editor, session, pos, prefix, callback) => {
        callback(null, AUTO_COMPLETIONS);
      },
    };

    langTools.addCompleter(autoCompletions);
  }

  render() {
    return (
      <AceEditor
        theme="twilight"
        value={this.props.value}
        onChange={this.props.onChange}
        maxLines={100}
        {...ACE_PROPS}
      />
    );
  }
}

export default CodeEditor;
