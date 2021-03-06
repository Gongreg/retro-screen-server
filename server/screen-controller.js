const ws281x = require('rpi-ws281x-native');
const spotify = require('./spotify/spotify');
const { serialize, clearTimeouts: clearTimeoutsHelper } = require('./utils');

const sctrl = {};

function init({ leds, resolution, maxBrightness, defaultBrightness, fps, alarms }) {

  const timeout = 1000 / fps;

  const initialState = {
    screenData: {
      leds,
      resolution,
      pixelData: new Uint32Array(leds),
      brightness: defaultBrightness,
      maxBrightness,
      clockColors: [0x4A90E2, 0xD0021B, 0xF8E71C],
      textColors: [0xFFFFFF, 0x000000],
      text: '',
      textSpeed: 100,
      visualizerEnabled: false,
      alarms,
    },
    rerender: true,
    fps,
    timeout,
    nextRender: +new Date,
    renderTimeout: null,
    timeouts: {},
  };

  sctrl.initialState = Object.assign({}, initialState);
  sctrl.state = initialState;

  ws281x.init(sctrl.state.screenData.leds, {dmaNum: 9});

  render();
}

function setState(state, rerender = true) {
  sctrl.state = Object.assign(
    {},
    sctrl.state,
    state,
    { rerender }
  );
}

function setScreenState(screenData, rerender = true) {

  sctrl.state.screenData = Object.assign(
    {},
    sctrl.state.screenData,
    screenData
  );

  sctrl.state.rerender = rerender;
}

function render() {
  if (sctrl.state.rerender) {
    sctrl.state.rerender = false;

    ws281x.setBrightness(sctrl.state.screenData.brightness);
    ws281x.render(sctrl.state.screenData.pixelData);
  }

  const now = +new Date;
  const late = now > sctrl.state.nextRender ? now - sctrl.state.nextRender : 0;
  const nextRender = sctrl.state.timeout - late;

  sctrl.state.nextRender = now + nextRender;
  sctrl.state.renderTimeout = setTimeout(render, nextRender);
}

function exit() {
  clearTimeout(sctrl.state.renderTimeout);
  clearTimeouts();
  ws281x.reset();
}

function getScreenData() {
  return sctrl.state.screenData;
}

function getSerializedScreenData() {
  return serialize(sctrl.state.screenData);
}

function clearTimeouts() {
  clearTimeoutsHelper(sctrl.state.timeouts);
}

function reset({resetBrightness} = {resetBrightness: true}) {
  clearTimeouts(sctrl.state.timeouts);

  spotify.stop();
  
  setState({
    screenData: Object.assign(
      {}, sctrl.initialState.screenData, { pixelData: new Uint32Array(sctrl.initialState.screenData.leds) },
      resetBrightness ? {} : {brightness: sctrl.state.screenData.brightness}
    ),
    timeouts: {},
  });
}

function addTimeout(name, timeout) {
  sctrl.state.timeouts[name] = timeout;
}

function getFps() {
  return {
    fps: sctrl.state.fps,
    timeout: sctrl.state.timeout,
  };
}

module.exports = {
  init,
  render,
  reset,
  exit,
  getSerializedScreenData,
  getScreenData,
  clearTimeouts,
  setState,
  setScreenState,
  setTimeout: addTimeout,
  getFps,
};
