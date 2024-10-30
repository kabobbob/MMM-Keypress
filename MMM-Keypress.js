Module.register("MMM-Keypress", {
  defaults: {
  },

  start () {
    // Log module start
    Log.info(`Starting module: ${this.name}`);

    // Add event listeners for both "keydown" and "scroll wheel" events
    document.addEventListener("keydown", this.handleKeyEvent.bind(this));
    document.addEventListener("wheel", this.handleWheelEvent.bind(this));
    document.addEventListener("touchstart", this.touchStartHandler.bind(this));
    document.addEventListener("touchend", this.touchEndHandler.bind(this));
  },

  getDom () {
    // Create a wrapper div element
    const wrapper = document.createElement("div");
    return wrapper;
  },

  handleKeyEvent (event) {
    // Extract key information from the event
    const key = event.key.toUpperCase();
    const {keyCode} = event;
    const {code} = event;

    // Find a matching notification based on the pressed key
    const matchingNotification = this.config.notifications.find((notification) => notification.key === keyCode || notification.key === key || notification.key === code);

    // Send notification to other modules if there is a match
    if (matchingNotification) {
      this.sendNotification(matchingNotification.notification, matchingNotification.payload);
    }
  },

  handleWheelEvent (event) {
    // Determine the direction of the mouse scroll
    const scrollDirection = event.deltaY > 0 ? "MOUSE_SCROLL_DOWN" : "MOUSE_SCROLL_UP";

    // Find a matching notification based on the scroll direction
    const matchingNotification = this.config.notifications.find((notification) => notification.key === scrollDirection);

    // Send notification to other modules if there is a match
    if (matchingNotification) {
      this.sendNotification(matchingNotification.notification, matchingNotification.payload);
    }
  },

  touchStartX: 0,
  touchEndX: 0,

  touchStartHandler (event) {
    this.touchStartX = event.changedTouches[0].screenX;
  },

  touchEndHandler (event) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeEvent();
  },

  handleSwipeEvent () {
    var difference = this.touchEndX - this.touchStartX;
    var threshold = 50;  // You can adjust the threshold as required
    let key;

    if (difference > threshold) {
      key = "ARROWLEFT";
    } else if (difference < -threshold) {
      key = "ARROWRIGHT";
    }

    const matchingNotification = this.config.notifications.find((notification) => notification.key === key);
    if (matchingNotification) {
      let curWeekIndex, weeksInView,
      newWeekIndex;

      this.sendNotification('CX3_GET_CONFIG', {
        callback (current) {
          curWeekIndex = current.weekIndex;
          weeksInView  = current.weeksInView;
        }
      })

      if (matchingNotification.notification == "CALENDAR_ADVANCE") {
        newWeekIndex = curWeekIndex + weeksInView;
      } else if (matchingNotification.notification == "CALENDAR_REWIND") {
        newWeekIndex = curWeekIndex - weeksInView;
      }

      this.sendNotification('CX3_SET_CONFIG', { weekIndex: newWeekIndex });
    }
  },

});

