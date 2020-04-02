export const HasSessionExpired = () => {
    var loggedInTime = localStorage.getItem("loggedinTime");
    var timeDifference = Date.now() - loggedInTime;
    var diffMins = Math.round(((timeDifference % 86400000) % 3600000) / 60000);
    if (loggedInTime===null) {
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