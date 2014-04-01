/**
 * Wrapper for the HTML5 Notifications API
 * @namespace notifications
 */
var notifications = (function() {
   var
           exports = {},
           PERMISSION_DEFAULT = "default",
           PERMISSION_GRANTED = "granted",
           PERMISSION_DENIED = "denied",
           PERMISSION = [
              PERMISSION_GRANTED,
              PERMISSION_DEFAULT,
              PERMISSION_DENIED],
           /**
            * Where to display notifications in case HTML5 notifications aren't supported
            * @type type
            */
           notificationFallbackFunction,
           showNotifyFallback = false;

   /**
    * Set what function to call in case HTML5 notifications aren't supported
    * @param {Function} func The function to call and pass notification options
    */
   exports.setFallbackFunction = function(func) {
      notificationFallbackFunction = func;
   };

   /**
    * Whether or not to show the fallback regardless of HTML5 notification API
    * @param {Boolean} show Whether to show the fallback
    */
   exports.setShowNotifyFallback = function(show) {
      showNotifyFallback = show;
   };

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
      var permission = exports.checkPermission(),
              notification;

      // TODO: Figure out how to delay notification until user grants permission

      // If we don't have permission, ask for it
      if (permission === PERMISSION_DEFAULT) {
         exports.getPermission();
         permission = exports.checkPermission();
      }

      // If we do, start a notification
      if (permission === PERMISSION_GRANTED) {
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
                  notification.close();
               }, options.duration);
            }
         }
         return notification;
      }
      
      // If we don't have permission, let the user know that this doesn't work without it
      else {
         console.log("Need permission or fallback");
         exports.setShowNotifyFallback(true);
      }

      // If we don't have permission, let the user know that this doesn't work without it
      if (notificationFallbackFunction && showNotifyFallback) {
         notificationFallbackFunction(options);
      }
   };

   return exports;
}());