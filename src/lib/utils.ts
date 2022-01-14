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

export function wrapText(container: fabric.Text, maxWidth: number) {
  let width = Math.ceil(container.getLineWidth(0));
  while (width > maxWidth) {
    const text = container.text || "";
    container.set("text", text.slice(0, text.length - 4) + "...");
    width = Math.ceil(container.getLineWidth(0));
  }
}
