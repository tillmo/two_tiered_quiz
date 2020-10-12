import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Button from "@material-ui/core/Button";
import { uploadUserQuizService } from "../Services/AppServices.js";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { translate } from "react-i18next";
import Snackbar from "@material-ui/core/Snackbar";
import { HasAdminSessionExpired } from "../Utils/LoginUtils.js";

export class UploadQuiz extends Component {
  state = {
    file: null,
    message: "",
    fileName: "",
    openSnackBar: false,
    isUserLoggedIn: false,
  };

  componentDidMount() {
    if (HasAdminSessionExpired()) {
      this.props.history.push("/admin");
    }
  }

  onChange = (file) => {
    if (file) {
      this.setState({ fileName: file.name, file: file });
    }
  };

  uploadQuiz = (event) => {
    const data = new FormData();
    if (this.state.fileName === "") {
      this.setState({
        message: this.props.t("Please select a file"),
        openSnackBar: true,
      });
      return;
    }
    data.append("file", this.state.file);
    uploadUserQuizService(data)
      .then((res) => {
        this.setState({ message: res.data, openSnackBar: true });
      })
      .catch((err) => {
        if (err)
          this.setState({ message: err.response.data, openSnackBar: true });
      });
  };

  handleClose = () => {
    this.setState({ openSnackBar: false, errorMessage: "" });
  };

  render() {
    let { fileName, message } = this.state;
    const { openSnackBar } = this.state;
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={10000}
          open={openSnackBar}
          onClose={this.handleClose}
          message={<p style={{ whiteSpace: "pre-line" }}>{message}</p>}
        />
        <Grid container spacing={1} style={{ justify: "space-between" }}>
          <Grid item xs={12} sm={12} md={12}>
            <Breadcrumbs
              style={{
                marginLeft: "8px",
              }}
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Typography variant="subtitle2" color="textPrimary">
                {this.props.t("Upload Quiz")}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Paper style={{ padding: "15px" }}>
          <Grid container spacing={1} style={{ justify: "space-between" }}>
            <Grid item xs={12} sm={12} md={12}>
              <input
                id="contained-button-file"
                multiple
                type="file"
                accept="text/plain"
                style={{ display: "none" }}
                onChange={(e) => {
                  this.onChange(e.currentTarget.files[0]);
                }}
              />
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={fileName}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  style={{ marginLeft: "10px" }}
                >
                  {this.props.t("Choose File")}
                </Button>
              </label>
              <Button
                variant="contained"
                color="primary"
                component="span"
                style={{ marginLeft: "10px" }}
                onClick={this.uploadQuiz}
              >
                {this.props.t("Upload")}
              </Button>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ whiteSpace: "pre-line", padding: "10px" }}
              >
                {"# some sample quiz skeleton\n" +
                  "# use itas a template to create your own quiz\n" +
                  "# read it in with:\n" +
                  "quiz:Name of quiz\n" +
                  "d:Description\n" +
                  "q:Question 1\n" +
                  "a:Answer 1*\n" +
                  "# correct answers are marked with an asterisk* \n" +
                  "j:Justification 1\n" +
                  "e:Explanation 1\n" +
                  "j:Justification 2\n" +
                  "e:Explanation 2\n" +
                  "j:Justification 3*\n" +
                  "# correct justifications are marked with an asterisk* \n" +
                  "# correct justifications do not have an explanation\n" +
                  "a:Answer 2\n" +
                  "j:Justification 4\n" +
                  "e:Explanation 4\n" +
                  "j:Justification 5\n" +
                  "e:Explanation 5\n" +
                  "j:Justification 6\n" +
                  "e:Explanation 6"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default translate("common")(UploadQuiz);
