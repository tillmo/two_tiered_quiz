import React from "react";
import Typography from "@material-ui/core/Typography";
import { translate } from "react-i18next";

export const HasSessionExpired = () => {
  var loggedInTime = localStorage.getItem("loggedinTime");
  var authToken = localStorage.getItem("token");
  var timeDifference = Date.now() - loggedInTime;
  var diffMins = Math.round(timeDifference / 1000 / 60);
  if (loggedInTime === null && authToken === null) {
    return true;
  }
  if (diffMins > 60) {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedinTime");
    localStorage.removeItem("username");  
    localStorage.removeItem("isStaff");
    return true;
  }
  return false;
};

export const HasAdminSessionExpired = () => {
  var loggedInTime = localStorage.getItem("admloggedinTime");
  var authToken = localStorage.getItem("admtoken");
  var isStaff = localStorage.getItem("isStaff");
  var timeDifference = Date.now() - loggedInTime;
  var diffMins = Math.round(timeDifference / 1000 / 60);
  if (loggedInTime === null || authToken === null || isStaff === null) {
    return true;
  }
  if (diffMins > 60) {
    localStorage.removeItem("admtoken");
    localStorage.removeItem("admloggedinTime");
    localStorage.removeItem("admusername");
    localStorage.removeItem("isStaff");
    return true;
  }
  return false;
};

export const getErrorMessage = (err) => {
  let errorMessage = "";
  if (err.response && err.response.data) {
    if (err.response.status >= 403 && err.response.status < 600) {
      errorMessage = this.props.t("Request cannot be processed");
    } else {
      errorMessage = Object.entries(err.response.data).map(([key, value]) => (
        <Typography>
          {key} - {value}
        </Typography>
      ));
    }
  } else {
    errorMessage = err.message;
  }
  return errorMessage;
};

export default translate("common")({ HasSessionExpired, getErrorMessage });
