import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL + "/";
const getHeaders = () => {
  var authToken = localStorage.getItem("token");
  return { Authorization: "Token " + authToken };
};

const getAdmHeaders = () => {
  var authToken = localStorage.getItem("admtoken");
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
    .get(url + "api/getscorelist/" + user, { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getAllUserScoreChartData = () => {
  return axios
    .get(url + "api/getscorechartdata/", { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getUserScoreDetailsService = (user) => {
  return axios
    .get(url + "api/userscoredetails/" + user, { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getUserProgressService = (user) => {
  return axios
    .get(url + "api/userprogresschartdata/" + user, { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getAllUserProgressService = () => {
  return axios
    .get(url + "api/alluserprogresschartdata/", { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getAvgQuestionsSolvedService = () => {
  return axios
    .get(url + "api/avgquessolvedbyuser/", { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getAllQuestionAttemptsChartData = () => {
  return axios
    .get(url + "api/getoverallquizzesattempts/", { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getTotalParticipants = () => {
  return axios
    .get(url + "api/gettotalparticipants/", { headers: getHeaders() })
    .then((res) => {
      return res.data;
    });
};

export const getUserDetailsServiceAdm = (user) => {
  return axios
    .get(url + "api/checkadmincredentials/" + user, { headers: getAdmHeaders() })
    .then((res) => {
      return res.data.is_staff;
    });
};

export const uploadUserQuizService = (data) => {
  return axios.post(url + "api/uploaduserquiz/", data, {
    headers: getAdmHeaders(),
  });
};

export const getUserDetailsServiceAdmId = () => {
  return axios
    .get(url + "rest-auth/user/", { headers: getAdmHeaders() })
    .then((res) => {
      return res.data.pk;
    });
};