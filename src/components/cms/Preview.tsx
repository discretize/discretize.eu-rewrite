import React from "react";
import { Markup, Markdown } from "astro-remote";
import { components } from "@components/components";

class MDXPreview extends React.Component {
  state = {
    ready: false,
    error: null,
    beginner: true,
  };

  shouldComponentUpdate(nextProps, nextState) {
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

  // Fired when an error is caught - this is unfortunately necessary because the preview window hangs
  // if a component errors out once. Once it hangs there is no way of recovering - so we need to catch
  // the error and not render the erroring markdown.
  // Errornous md can be "<S " (when the user is starting to type <Skill ... /> )
  componentDidCatch(error, _info) {
    const err = {
      message: error.message,
      location: error.location,
    };
    this.setState((prevState) => ({ ...prevState, error: err }));
  }

  render() {
    // console.log('renderMain');
    // render has been called - this means either there is new text or there is an error
    // this.setState({ ...this.state, error: null });

    // Grab the changed text
    const { entry } = this.props;
    const text = entry.getIn(["data", "body"]);
    const profession = entry.getIn(["data", "profession"]);
    const hasBeginner = entry.getIn(["data", "hasBeginner"]);

    let content = null;
    console.log("here");

    if (this.state.error) {
      content = (
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
    } else {
      content = text;
    }

    return (
      <>
        <div data-content={content} />
      </>
    );
  }
}

export default MDXPreview;
