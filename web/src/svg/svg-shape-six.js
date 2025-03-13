export const SVGShapeSix = ({ color_one, color_two }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.19 16.36">
    <line
      class={color_one ? color_one : "text-body"}
      x1="2.5"
      y1="2.5"
      x2="38.37"
      y2="2.5"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="5"
    />
    <line
      class={color_two ? color_two : "text-secondary"}
      x1="25.32"
      y1="15.86"
      x2="61.19"
      y2="15.86"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
    />
  </svg>
);
