export const SVGShapeFive = ({ color_one, color_two }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.23 48.04">
    <path
      class={color_one ? color_one : "text-body"}
      d="M18.41,34.18a15.84,15.84,0,1,1,0-31.68"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="5"
    />
    <path
      class={color_two ? color_two : "text-secondary"}
      d="M41.23,47.54a15.84,15.84,0,1,1,0-31.68"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
    />
  </svg>
);
