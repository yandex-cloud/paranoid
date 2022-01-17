import { fabric } from "fabric";
import { Colors, ParanoidOpts } from "../models";
import { getControllersStyle } from "./utils";

function getButton(text: string, title: string) {
  const button = document.createElement("button");
  button.innerText = text;
  button.className = `paranoid-button paranoid-button_${title}`;

  return button;
}

export const canvasId = "ParanoidC";

function initCanvas(element: HTMLElement, opts: ParanoidOpts) {
  const canv = document.createElement("canvas");
  canv.setAttribute("id", canvasId);
  canv.setAttribute("width", String(element.offsetWidth));
  canv.setAttribute("height", String(element.offsetHeight));
  element.appendChild(canv);
  const colors = opts.colors || {};

  const canvas = new fabric.Canvas(canvasId, {
    selection: false,
    backgroundColor: colors.fill,
    defaultCursor: "grab",
  });

  return canvas;
}

function getControllers(
  plus: HTMLButtonElement,
  minus: HTMLButtonElement,
  zoom: HTMLButtonElement,
  colors: Colors
) {
  const buttons = document.createElement("div");

  buttons.className = "paranoid-controls";

  const style = document.createElement("style");
  style.innerText = getControllersStyle(colors);

  buttons.appendChild(style);
  buttons.appendChild(minus);
  buttons.appendChild(plus);
  buttons.appendChild(zoom);

  return buttons;
}

function initZoom(
  canvas: fabric.Canvas,
  plus: HTMLButtonElement,
  minus: HTMLButtonElement,
  normalZoom: HTMLButtonElement,
  opts: ParanoidOpts
) {
  const minZoom = opts.minZoom || 0.2;
  const zoomStep = opts.zoomStep || 0.2;
  const maxZoom = opts.maxZoom || 2;
  const startZoom = opts.startZoom || 1;

  canvas.setZoom(startZoom);

  minus.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let zoom = canvas.getZoom();

    zoom -= zoomStep;

    if (zoom < minZoom) {
      zoom = minZoom;
    }

    canvas.setZoom(zoom);
  });

  plus.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let zoom = canvas.getZoom();

    zoom += zoomStep;

    if (zoom > maxZoom) {
      zoom = maxZoom;
    }

    canvas.setZoom(zoom);
  });

  normalZoom.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    canvas.setZoom(1);
  });
}

function initPan(canvas: fabric.Canvas) {
  let isDragging = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on("mouse:down", (event) => {
    if (!event.target) {
      canvas.setCursor("grabbing");
      isDragging = true;
      lastPosX = event.pointer!.x;
      lastPosY = event.pointer!.y;
    }
  });

  canvas.on("mouse:move", (event) => {
    if (isDragging) {
      canvas.viewportTransform![4] += event.pointer!.x - lastPosX;
      canvas.viewportTransform![5] += event.pointer!.y - lastPosY;
      canvas.setCursor("grabbing");
      canvas.getObjects().forEach((object) => object.setCoords());
      canvas.requestRenderAll();
      lastPosX = event.pointer!.x;
      lastPosY = event.pointer!.y;
    }
  });

  canvas.on("mouse:up", () => {
    if (isDragging) {
      canvas.setCursor("grab");
      isDragging = false;
    }
  });
}

export function getCanvas(root: string, opts: ParanoidOpts) {
  const elem = document.getElementById(root);

  if (!elem) {
    throw new Error(`Not found element with id ${root}`);
  }

  elem.style.position = "relative";

  const plus = getButton("+", "plus");
  const minus = getButton("-", "minus");
  const normalZoom = getButton("1:1", "normal");

  const canvas = initCanvas(elem, opts);
  const controllers = getControllers(plus, minus, normalZoom, opts.colors);
  elem.appendChild(controllers);

  initZoom(canvas, plus, minus, normalZoom, opts);
  initPan(canvas);

  return canvas;
}
