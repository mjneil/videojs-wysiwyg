import videojs from 'video.js';
import {version as VERSION} from '../package.json';

// Default options for the plugin.
const defaults = {};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function wysiwyg
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const wysiwyg = function(options) {
  let c = document.getElementById('videojs-wysiwyg-canvas');

  if (c === null) {
    // create and attach canvas
    c = document.createElement('canvas');
    c.id = 'videojs-wysiwyg-canvas';
    c.style.position = 'absolute';
    c.style.left = '-9999px';
    c.style.top = '-9999px';
    document.body.appendChild(c);
  }

  const video = this.tech_ && this.tech_.el();

  if (!video) {
    return;
  }

  const ctx = c.getContext('2d');
  const vcs = getComputedStyle(video);
  const width = parseInt(vcs.width, 10);
  const height = parseInt(vcs.height, 10);

  c.width = width;
  c.height = height;

  ctx.drawImage(video, 0, 0);

  let image;

  if (options.base64) {
    image = c.toDataURL('image/jpeg');
  } else {
    image = ctx.getImageData(0, 0, width, height);
  }

  return {
    image,
    width,
    height,
    time: this.currentTime()
  };
};

// Register the plugin with video.js.
registerPlugin('wysiwyg', wysiwyg);

// Include the version number.
wysiwyg.VERSION = VERSION;

export default wysiwyg;
