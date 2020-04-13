import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL + "/";
const headers = { Authorization: "Token " + localStorage.getItem("token") };

export const getLoginService = (userCredentials) => {
  return axios.post(url + "rest-auth/login/", userCredentials);
};

export const getSignUpService = (userDetails) => {
  return axios.post(url + "rest-auth/registration/", userDetails);
};

export const getUserDetailsService = () => {
  return axios.get(url + "rest-auth/user/", { headers: headers });
};

export const getQuizListService = () => {
  return axios.get(url + "api/", {headers: headers});
};

export const getQuizService = (quizId) => {
  return axios.get(url + "api/" + quizId, {headers: headers});
};

export const createReportService = (quizTaker) => {
  return axios.post(url + "api/createreport/", quizTaker, {headers: headers});
};

export const createResponseService = (responses) => {
  return axios.post(url + "api/createresponse/", responses, {headers: headers});
};

export const getquiztakerdetailsService = (quizId, userId) => {
  return axios.get(url + "api/getquiztaker/" + quizId + "/" + userId + "/", {headers: headers});
};

export const getQuizTakerResponsesService = (quizTakerId) => {
  return axios.get(url + "api/getresponses/" + quizTakerId, {headers: headers}).then((res) => {
    return res.data;
  });
};

export const updateQuizReportService = (quizTaker, quizTakerId) => {
  return axios.put(url + "api/updatequiztaker/" + quizTakerId, quizTaker, {headers: headers});
};

export const updateResponseService = (responses) => {
  return axios.put(url + "api/updateresponses/", responses, {headers: headers});
};
