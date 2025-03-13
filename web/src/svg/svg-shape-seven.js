export const SVGShapeSeven = ({ color_one, color_two }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.25 20.25">
    <line
      class={color_one ? color_one : "text-body"}
      x1="17.75"
      y1="17.28"
      x2="2.5"
      y2="2.97"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="5"
    />
    <line
      class={color_one ? color_one : "text-body"}
      x1="2.97"
      y1="17.75"
      x2="17.28"
      y2="2.5"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="5"
    />
  </svg>
);
