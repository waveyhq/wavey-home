(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var nekoEl = document.createElement("div");
  var nekoPosX = 32;
  var nekoPosY = 32;
  var mousePosX = 0;
  var mousePosY = 0;
  var frameCount = 0;
  var idleTime = 0;
  var idleAnimation = null;
  var idleAnimationFrame = 0;
  var petting = false;
  var nekoSpeedPxPerSec = 140;
  var logicTickMs = 100;
  var logicAcc = 0;
  var lastTs = 0;
  var spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]],
    scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]],
    scratchWallW: [[-4, 0], [-4, -1]],
    tired: [[-3, -2]],
    sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S: [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]],
    NW: [[-1, 0], [-1, -1]],
  };

  function setPointer(x, y) {
    mousePosX = x;
    mousePosY = y;
  }

  function setSprite(name, frame) {
    var sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = sprite[0] * 32 + "px " + sprite[1] * 32 + "px";
  }

  function syncDom() {
    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
    nekoEl.style.transform =
      "translate3d(" + (nekoPosX - 16) + "px," + (nekoPosY - 16) + "px,0)";
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
    petting = false;
  }

  function petCat() {
    petting = true;
    idleAnimation = "scratchSelf";
    idleAnimationFrame = 0;
    idleTime = 0;
  }

  function isNearCat(x, y) {
    var dx = x - nekoPosX;
    var dy = y - nekoPosY;
    return dx * dx + dy * dy <= 40 * 40;
  }

  function tickIdleLogic() {
    idleTime += 1;
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) === 0 &&
      idleAnimation == null
    ) {
      var idleChoices = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) idleChoices.push("scratchWallW");
      if (nekoPosY < 32) idleChoices.push("scratchWallN");
      if (nekoPosX > window.innerWidth - 32) idleChoices.push("scratchWallE");
      if (nekoPosY > window.innerHeight - 32) idleChoices.push("scratchWallS");
      idleAnimation = idleChoices[Math.floor(Math.random() * idleChoices.length)];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdleAnimation();
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function tickMove(dt) {
    var diffX = nekoPosX - mousePosX;
    var diffY = nekoPosY - mousePosY;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    var step = nekoSpeedPxPerSec * (dt / 1000);

    if (step >= distance) {
      nekoPosX = mousePosX;
      nekoPosY = mousePosY;
      return;
    }

    nekoPosX -= (diffX / distance) * step;
    nekoPosY -= (diffY / distance) * step;
  }

  function update(dt) {
    if (petting) {
      logicAcc += dt;
      while (logicAcc >= logicTickMs) {
        logicAcc -= logicTickMs;
        tickIdleLogic();
      }
      syncDom();
      return;
    }

    var diffX = nekoPosX - mousePosX;
    var diffY = nekoPosY - mousePosY;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);

    if (distance < 48) {
      logicAcc += dt;
      while (logicAcc >= logicTickMs) {
        logicAcc -= logicTickMs;
        tickIdleLogic();
      }
      syncDom();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    logicAcc += dt;
    while (logicAcc >= logicTickMs) {
      logicAcc -= logicTickMs;
      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7) - 1;
      } else {
        frameCount += 1;
        diffX = nekoPosX - mousePosX;
        diffY = nekoPosY - mousePosY;
        distance = Math.sqrt(diffX * diffX + diffY * diffY);
        if (distance > 0.001) {
          var direction = "";
          if (diffY / distance > 0.5) direction += "N";
          if (diffY / distance < -0.5) direction += "S";
          if (diffX / distance > 0.5) direction += "W";
          if (diffX / distance < -0.5) direction += "E";
          setSprite(direction, frameCount);
        }
      }
    }

    if (idleTime > 1) {
      syncDom();
      return;
    }

    tickMove(dt);
    syncDom();
  }

  function onAnimationFrame(ts) {
    if (!nekoEl.isConnected) return;
    if (!lastTs) lastTs = ts;
    var dt = Math.min(ts - lastTs, 32);
    lastTs = ts;
    update(dt);
    window.requestAnimationFrame(onAnimationFrame);
  }

  var script = document.currentScript;
  var nekoFile = (script && script.dataset.cat) || "/oneko.gif";

  nekoEl.id = "oneko";
  nekoEl.setAttribute("aria-hidden", "true");
  nekoEl.style.cssText =
    "width:32px;height:32px;position:fixed;left:0;top:0;pointer-events:none;" +
    "image-rendering:pixelated;z-index:1100;will-change:transform;" +
    "background-image:url(" +
    nekoFile +
    ")";
  syncDom();
  document.body.appendChild(nekoEl);

  document.addEventListener("mousemove", function (e) {
    setPointer(e.clientX, e.clientY);
  });
  document.addEventListener("mousedown", function (e) {
    if (e.button !== 0 || !isNearCat(e.clientX, e.clientY)) return;
    setPointer(e.clientX, e.clientY);
    petCat();
  });
  document.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  document.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  document.addEventListener(
    "touchend",
    function (e) {
      var t = e.changedTouches[0];
      if (!t || !isNearCat(t.clientX, t.clientY)) return;
      setPointer(t.clientX, t.clientY);
      petCat();
    },
    { passive: true }
  );

  window.requestAnimationFrame(onAnimationFrame);
})();
