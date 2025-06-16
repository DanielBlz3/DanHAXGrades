
export default function isLight(rgbString, threshold) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    console.log(brightness)
    return brightness >= threshold;  
}