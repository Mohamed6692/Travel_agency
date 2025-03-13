export const SVGShapeThree = ({ colorOne, colorTwo }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.47 48.01">
    <rect
      class={colorOne ? colorOne : "text-body"}
      x="2.5"
      y="2.5"
      width="31.65"
      height="31.65"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="5"
    />
    <rect
      class={colorOne ? colorOne : "text-secondary"}
      x="25.32"
      y="15.86"
      width="31.65"
      height="31.65"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
    />
  </svg>
);
