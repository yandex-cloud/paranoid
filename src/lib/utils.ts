import FontFaceObserver from "fontfaceobserver";

const fonts = ["YS Text", "YS Display"];

export function loadFonts() {
  return Promise.all(
    fonts.map((font) => {
      return new FontFaceObserver(font).load().catch((error) => {
        console.error(`Wasn't able to load font: ${font}`);
        console.error(error);
      });
    })
  );
}
