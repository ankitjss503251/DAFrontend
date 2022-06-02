// import NotificationManager from "react-notifications/lib/NotificationManager";

export const slowRefresh = (time) => {
  setTimeout(() => window.location.reload(), time);
};
