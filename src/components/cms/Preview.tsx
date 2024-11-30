import "@discretize/typeface-menomonia";
import "@gw2-ui/default_style.css";
import React, { type ErrorInfo } from "react";
import "typeface-muli";
import "typeface-raleway";
import MemoizedSection from "./MemoizedSection";

interface Props {
  entry: {
    getIn: (path: string[]) => any;
  };
}

interface State {
  ready: boolean;
  error: { message: string; location?: any } | null;
  beginner: boolean;
}

class MDXPreview extends React.Component<Props, State> {
  state: State = {
    ready: false,
    error: null,
    beginner: true,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // force re-render when error occur
    if (nextState.error !== null) return true;

    // Only skip the render if the component has loaded at least one time
    if (!this.state.ready) return true;

    const titleOld = this.props.entry.getIn(["data", "title"]);
    const titleNew = nextProps.entry.getIn(["data", "title"]);
    const dateOld = this.props.entry.getIn(["data", "date"]);
    const dateNew = nextProps.entry.getIn(["data", "date"]);
    const ratingOld = this.props.entry.getIn(["data", "rating"]);
    const ratingNew = nextProps.entry.getIn(["data", "rating"]);
    const roleOld = this.props.entry.getIn(["data", "role"]);
    const roleNew = nextProps.entry.getIn(["data", "role"]);
    const authorOld = this.props.entry.getIn(["data", "author"]);
    const authorNew = nextProps.entry.getIn(["data", "author"]);
    const conditionsOld = this.props.entry.getIn(["data", "conditions"]);
    const conditionsNew = nextProps.entry.getIn(["data", "conditions"]);
    const boonsOld = this.props.entry.getIn(["data", "boons"]);
    const boonsNew = nextProps.entry.getIn(["data", "boons"]);
    const codeOld = this.props.entry.getIn(["data", "code"]);
    const codeNew = nextProps.entry.getIn(["data", "code"]);
    const professionOld = this.props.entry.getIn(["data", "profession"]);
    const professionNew = nextProps.entry.getIn(["data", "profession"]);
    if (
      titleOld !== titleNew ||
      dateOld !== dateNew ||
      ratingOld !== ratingNew ||
      roleOld !== roleNew ||
      authorOld !== authorNew ||
      conditionsOld !== conditionsNew ||
      boonsOld !== boonsNew ||
      codeOld !== codeNew ||
      professionOld !== professionNew
    ) {
      return false;
    }

    return true;
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    const err = {
      message: error.message,
      location: (error as any).location,
    };
    this.setState((prevState) => ({ ...prevState, error: err }));
  }

  render() {
    const { entry } = this.props;
    const text = entry.getIn(["data", "body"]);
    const profession = entry.getIn(["data", "profession"]);

    const content = text;

    if (this.state.error) {
      return (
        <div>
          <h1>ERROR: {this.state.error.message} </h1>
          {this.state.error.location && (
            <div>
              location: line: {this.state.error.location.start.line}, column:{" "}
              {this.state.error.location.start.column}
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <MemoizedSection content={content} profession={profession} />
      </>
    );
  }
}

export default MDXPreview;
