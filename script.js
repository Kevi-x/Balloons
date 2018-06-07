let balloonData = (function() {
  
  let Balloon = function(id, x, y, yVelocity, color, height, width) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.yVelocity = yVelocity;
    this.color = color;
    this.height = height;
    this.width = width;
  };

  const balloonProps = {
    size: {
      min: 5,
      max: 150
    },

    velocity: {
      min: 1.0,
      max: 3
    },

    position: {
      min: 0,
      max: window.innerWidth
    },

    colors: [
      "#eb4d4b",
      "#badc58",
      "#c7ecee",
      "#f0932b",
      "#7ed6df",
      "#f6e58d",
      "#30336b",
      "#130f40"
    ]
  };

  let data = [];

  return {
    // Adds balloon object to the data array
    addBalloon: function(x, y, yVelocity, color, height, width) {
      let balloon, ID;
     
      if (data.length === 0) {
        ID = 0;
      } else {
        ID = data[data.length - 1].id + 1;
      }
      balloon = new Balloon(ID, x, y, yVelocity, color, height, width);
      data.push(balloon);
      return balloon;
    },

    // Deletes balloon object from the data array
    deleteBalloon: function(id) {
      let ID = -1;
      // Searches an object with the specific 'id'
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          ID = i;
          break;
        }
      }
      // If an object with 'id' exists, delete it from the array
      if (ID !== -1) {
        data.splice(ID, 1);
      }
    },

    // Returns object with balloon min and max sizes
    getBalloonSizes: function() {
      return balloonProps.size;
    },

    // Returns object with balloon's min and max positions
    getBalloonPositions: function() {
      return balloonProps.position;
    },

    // Returns object with balloon's min and max velocity
    getBalloonVelocity: function() {
      return balloonProps.velocity;
    },

    // Returns object with balloon's colors
    getBalloonColors: function() {
      return balloonProps.colors;
    },

    // Changes the y value by yVelocity, so that balloon can fall
    move: function(obj) {
      obj.y += obj.yVelocity;
    },

    
    getData: function() {
      return data;
    },

    testeroni: function() {
      console.log(data.length);
    }
  };
})();

// Controller used to share functions used for UI manipulation
let UIController = (function() {
  return {
    // Adds balloon object to the HTML container
    addBalloonNode: function(obj, container) {
      let balloon;

      balloon = document.createElement("div");
      balloon.style.transform =
        `translate3d(${obj.x}px, ${obj.y}px,0px)`; // ES6 template literals
      balloon.style.backgroundColor = obj.color;
      balloon.style.width = obj.width + "px";
      balloon.style.height = obj.height + "px";
      balloon.id = `balloons-${obj.id}`;
      balloon.classList.add("balloon");
      container.appendChild(balloon);
    },
    
    // Updates position of the balloon 
    updateDisplaying: function(obj, index) {
      const balloons = document.querySelectorAll(".balloon");
      balloons[index].style.transform =
        `translate3d(${obj.x}px, ${obj.y}px, 0px)`; // ES6 template literals
    },
    
    // Removes the balloon from HTML container
    deleteBalloon: function(itemID, container) {
      container.removeChild(document.querySelector(`#${itemID}`));
    }
  };
})();


// Controller to connect the two others controllers
let controller = (function(blnData, UICont) {
  let container;

  // Init function to setup Event Listeners
  let setupEventListeners = function() {
    container = document.querySelector("#baloonFlyingZone");

    container.addEventListener("click", function(e) {
      if (e.target.classList.contains("balloon")) 
          deleteBalloon(e.target);
    });

  };
  let i = 0;

  let getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  let deleteBalloon = function(item) {
    let splitID, itemID;
    if (isNaN(item)) {
      itemID = item.id;
    } else {
      itemID = `balloons-${item}`;
    }
    if (itemID) {
      splitID = itemID.split("-")[1];
      UICont.deleteBalloon(itemID, container);
      blnData.deleteBalloon(parseInt(splitID));
    }
  };

  let addNewBalloon = function() {
    let newBalloon;

    // 1. add balloon to the array
    // a. get Random x value
    let x = getRandom(
      blnData.getBalloonPositions().min,
      blnData.getBalloonPositions().max
    );
    // b. get Random yVelocity value
    let velocity = getRandom(
      blnData.getBalloonVelocity().min,
      blnData.getBalloonVelocity().max
    );
    // c. get Random height and width value
    let size = getRandom(
      blnData.getBalloonSizes().min,
      blnData.getBalloonSizes().max
    );
    // d. get Random color
    let colorsArray = blnData.getBalloonColors();
    let color = colorsArray[Math.round(getRandom(0, colorsArray.length - 1))];
    // e. y should be Top value translated about the height of the ball towards 0
    newBalloon = blnData.addBalloon(x, -size, velocity, color, size, size);
    // 2. add balloon to the UI
    UICont.addBalloonNode(newBalloon, container);
  };

  // Main animation loop of the app
  let loop = function() {
    if (i % 10 === 0) addNewBalloon();
    blnData.getData().forEach(function(item, index) {
      UICont.updateDisplaying(item, index);
      blnData.move(item);
      if (item.y > window.innerHeight) {
        deleteBalloon(item.id);
      }
    });

    i++;
    window.requestAnimationFrame(loop);
  };

  return {
    init: function() {
      setupEventListeners();
      loop();
    }
  };
})(balloonData, UIController);

window.addEventListener("DOMContentLoaded", function() {
  controller.init();
});
