/* eslint-disable react/no-unescaped-entities */
import { compile, run } from "@mdx-js/mdx";
import React from "react";
import * as runtime from "react/jsx-runtime";
import gfm from "remark-gfm";
import cmsComponents from "./components";

class Section extends React.Component {
  state = {
    error: null,
    MdxModule: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    // force re-render when error occur
    if (nextState.error !== null) return true;

    return (
      this.props.content !== nextProps.content ||
      this.state.MdxModule !== nextState.MdxModule
    );
  }

  async componentDidUpdate(prevProps) {
    console.log(this.props.content, prevProps.content);
    if (this.props.content === prevProps.content) return;

    const code = String(
      await compile(this.props.content, {
        outputFormat: "function-body",
        remarkPlugins: [gfm],
        providerImportSource: "@mdx-js/react",
        useDynamicImport: true,
      })
    );

    const MdxModule = await run(code, {
      ...runtime,
      useMDXComponents: () => cmsComponents,
    });

    this.setState((prevState) => ({
      ...prevState,
      MdxModule,
    }));
  }

  // Fired when an error is caught - this is unfortunately necessary because the preview window hangs
  // if a component errors out once. Once it hangs there is no way of recovering - so we need to catch
  // the error and not render the erroring markdown.
  // Errornous md can be "<S " (when the user is starting to type <Skill ... /> )
  componentDidCatch(error, info) {
    const err = {
      message: error.message,
      location: error.location,
      info,
    };
    this.setState((prevState) => ({ ...prevState, error: err }));
  }

  render() {
    // render has been called - this means either there is new text or there is an error
    this.setState((prevState) => ({ ...prevState, error: null }));

    const Content = this.state.MdxModule?.default ?? React.Fragment;

    return this.state.error ? (
      <div>
        <h1>ERROR: {this.state.error.message} </h1>
        {this.state.error.location && (
          <div>
            location: line: {this.state.error.location.start.line}, column:{" "}
            {this.state.error.location.start.column}
          </div>
        )}
        {this?.state?.error?.info?.componentStack && (
          <pre>{String(this?.state?.error?.info?.componentStack)}</pre>
        )}
      </div>
    ) : (
      <Content />
    );
  }
}
export default React.memo(Section);
