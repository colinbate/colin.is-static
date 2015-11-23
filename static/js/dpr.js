(function () {
  'use strict';
  var devicePixelRatioCache = {},
      supportedDprValues = [0.75, 1.0, 1.3, 1.5, 2.0, 3.0],
      checkSrc = /cloudinary\.com.*dpr_auto/;

  function closestAbove(list, value) {
    var i;
    i = list.length - 2;
    while (i >= 0 && list[i] >= value) {
      i--;
    }
    return list[i + 1];
  };

  function getDpr() {
    var dpr, dprString, dprUsed;
    dpr = (typeof window !== "undefined" && window !== null ? window.devicePixelRatio : void 0) || 1;
    dprString = devicePixelRatioCache[dpr];
    if (!dprString) {
      dprUsed = closestAbove(supportedDprValues, dpr);
      dprString = dprUsed.toString();
      if (dprString.match(/^\d+$/)) {
        dprString += '.0';
      }
      devicePixelRatioCache[dpr] = dprString;
    }
    return dprString;
  };

  function setImgSrc() {
    var images = document.querySelectorAll('[data-src]'),
        iLen = images.length,
        ii, curr, cSrc, dpr;
    if (iLen > 0) {
      dpr = 'dpr_' + getDpr();
    }
    for (ii = 0; ii < iLen; ii += 1) {
      curr = images[ii];
      cSrc = curr.getAttribute('data-src');
      if (checkSrc.exec(cSrc)) {
        curr.src = cSrc.replace('dpr_auto', dpr);
      }
    }
  }

  setImgSrc();
}());