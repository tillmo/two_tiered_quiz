import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL + "/";
const getHeaders = () => {
  var authToken = localStorage.getItem("token");
  return { Authorization: "Token " + authToken };
};

export const getLoginService = (userCredentials) => {
  return axios.post(url + "rest-auth/login/", userCredentials);
};

export const getSignUpService = (userDetails) => {
  return axios.post(url + "rest-auth/registration/", userDetails);
};

export const getUserDetailsService = () => {
  return axios
    .get(url + "rest-auth/user/", { headers: getHeaders() })
    .then((res) => {
      return res.data.pk;
    });
};

export const getQuizListService = () => {
  return axios.get(url + "api/", { headers: getHeaders() });
};

export const getQuizService = (quizId) => {
  return axios.get(url + "api/getquiz/" + quizId, { headers: getHeaders() });
};

export const createReportService = (quizTaker) => {
  return axios.post(url + "api/createreport/", quizTaker, {
    headers: getHeaders(),
  });
};

export const createResponseService = (responses) => {
  return axios.post(url + "api/createresponse/", responses, {
    headers: getHeaders(),
  });
};

export const getquiztakerdetailsService = (userId) => {
  return axios.get(url + "api/getquiztaker/" + userId + "/", {
    headers: getHeaders(),
  });
};

export const getQuizTakerResponsesService = (quizTakerId) => {
  return axios
    .get(url + "api/getresponses/" + quizTakerId, { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const updateQuizReportService = (quizTaker, quizTakerId) => {
  return axios.put(url + "api/updatequiztaker/" + quizTakerId, quizTaker, {
    headers: getHeaders(),
  });
};

export const updateResponseService = (responses) => {
  return axios.put(url + "api/updateresponses/", responses, {
    headers: getHeaders(),
  });
};

export const getQuizDetailService = (quizId) => {
  return axios
    .get(url + "api/" + quizId, { headers: getHeaders() })
    .then((res) => {
      return res.data.question;
    });
};

export const getUserQuizHistoryService = () => {
  return axios
    .get(url + "api/getuserquizhistory/", { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getScoresListService = (user) => {
  return axios
    .get(url + "api/getscorelist/"+user, { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};
