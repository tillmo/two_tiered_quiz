export const HasSessionExpired = () => {
    var loggedInTime = localStorage.getItem("loggedinTime");
    var authToken = localStorage.getItem("token");
    var timeDifference = Date.now() - loggedInTime;
    var diffMins = Math.round((timeDifference / 1000) / 60);
    if (loggedInTime===null && authToken===null) {
      return true;
    }
    if ( diffMins > 60 ) {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedinTime");
      return true;
    }
    return false;
}

export default HasSessionExpired;