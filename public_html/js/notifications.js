/**
 * Wrapper for the HTML5 Notifications API
 * @namespace notifications
 */
var notifications = (function() {
   var exports = {};

   var PERMISSION_DEFAULT = "default",
           PERMISSION_GRANTED = "granted",
           PERMISSION_DENIED = "denied",
           PERMISSION = [
              PERMISSION_GRANTED,
              PERMISSION_DEFAULT,
              PERMISSION_DENIED];

   /**
    * Get permission to show browser notifications
    */
   exports.getPermission = function() {
      if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
         window.webkitNotifications.requestPermission();
      }
      else if (window.Notification && window.Notification.requestPermission) {
         window.Notification.requestPermission();
      }
   };

   /**
    * See if we have permission to show notifications
    * @returns {String} Whether or not we have permission to post notifications
    */
   exports.checkPermission = function() {
      var permission;
      if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
         permission = PERMISSION[window.webkitNotifications.checkPermission()];
      }
      else if (window.Notification && window.Notification.permission) {
         permission = window.Notification.permission;
      }
      return permission;
   };

   /**
    * Show a notification
    * @param {object} options
    * @config {String} title The title of the notification
    * @config {String} icon The location of the icon to use
    * @config {String} body The body of the notification
    * @config {String} tag The tag of the notification
    * @config {Number} duration How long the message will stay up
    * @returns {Notification} The created notification
    */
   exports.notify = function(options) {
      var notification;
      if (exports.checkPermission() === PERMISSION_GRANTED) {
         if (window.Notification) {
            notification = new window.Notification(
                    options.title || "",
                    {
                       icon: options.icon || "",
                       body: options.body || "",
                       tag: options.tag || ""
                    });
            if (options.duration) {
               setTimeout(function() {
                  console.log("Should close");
                  notification.close();
               }, options.duration);
            }
         }
         else if (window.webkitNotifications) {
            notification = window.webkitNotifications.createNotification(
                    options.icon,
                    options.body);
            notification.show();
            if (options.duration) {
               setTimeout(function() {
                  console.log("Should close");
                  notification.close();
               }, options.duration);
            }
         }
         return notification;
      }
   };

   return exports;
}());