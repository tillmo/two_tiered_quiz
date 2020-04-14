import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL + "/";

export const getLoginService = (userCredentials) => {
  return axios.post(url + "rest-auth/login/", userCredentials);
};

export const getSignUpService = (userDetails) => {
  return axios.post(url + "rest-auth/registration/", userDetails);
};

export const getUserDetailsService = () => {
  return axios.get(url + "rest-auth/user/", {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};

export const getQuizListService = () => {
  return axios.get(url + "api/", {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};

export const getQuizService = (quizId) => {
  return axios.get(url + "api/" + quizId, {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};

export const createReportService = (quizTaker) => {
  return axios.post(url + "api/createreport/", quizTaker, {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};

export const createResponseService = (responses) => {
  return axios.post(url + "api/createresponse/", responses, {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};

export const getquiztakerdetailsService = (quizId, userId) => {
  return axios.get(url + "api/getquiztaker/" + quizId + "/" + userId + "/", {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};

export const getQuizTakerResponsesService = (quizTakerId) => {
  return axios
    .get(url + "api/getresponses/" + quizTakerId, {
      headers: { Authorization: "Token " + localStorage.getItem("token") },
    })
    .then((res) => {
      return res.data;
    });
};

export const updateQuizReportService = (quizTaker, quizTakerId) => {
  return axios.put(url + "api/updatequiztaker/" + quizTakerId, quizTaker, {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};

export const updateResponseService = (responses) => {
  return axios.put(url + "api/updateresponses/", responses, {
    headers: { Authorization: "Token " + localStorage.getItem("token") },
  });
};
