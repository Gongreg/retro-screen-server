import * as actionTypes from './action-types';

import ioClient from '../io';
import {parseScreenData} from '../utils';

export function onInit(screenData) {
  return {
    type: actionTypes.ON_INIT,
    screenData: parseScreenData(screenData),
  };
}

export function onDraw({coordinates, color}) {
  ioClient.onDraw({coordinates, color});

  return {
    type: actionTypes.ON_DRAW,
    coordinates,
    color
  };
}

export function afterDraw({coordinates, color}) {
  return {
    type: actionTypes.AFTER_DRAW,
    coordinates,
    color
  };
}

export function onChangeClockColor({number, color}) {
  ioClient.onChangeClockColor({number, color});

  return {
    type: actionTypes.ON_CHANGE_CLOCK_COLOR,
    number,
    color
  };
}

export function onOpenClock() {
  ioClient.onOpenClock();

  return {
    type: actionTypes.DUMMY,
  };
}

export function onNewState(screenData) {
  return {
    type: actionTypes.ON_NEW_STATE,
    screenData: parseScreenData(screenData),
  }
}

export function onUploadImage({file, name}) {
  ioClient.onUploadImage({file, name});

  return {
    type: actionTypes.DUMMY,
  };
};

export function afterBrightness(brightness) {
  return {
    type: actionTypes.AFTER_BRIGHTNESS,
    brightness,
  };
}

export function afterVisualizerEnabled(visualizerEnabled) {
  return {
    type: actionTypes.AFTER_VISUALIZER_ENABLED,
    visualizerEnabled,
  };
}

export function onShutdown() {
  ioClient.onShutdown();

  return {
    type: actionTypes.DUMMY,
  };
}

export function onReset() {
  ioClient.onReset();

  return {
    type: actionTypes.ON_RESET,
  };
};

export function onChangeBrightness(brightness) {
  ioClient.onChangeBrightness(brightness);
  return {
    type: actionTypes.ON_CHANGE_BRIGHTNESS,
    brightness,
  };
};

export function onChangeVisualizerEnabled() {
  ioClient.onChangeVisualizerEnabled();

  return {
    type: actionTypes.ON_CHANGE_VISUALIZER_ENABLED
  };
}