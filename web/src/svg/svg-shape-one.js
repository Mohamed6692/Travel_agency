export const SVGShapeOne = ({ colorOne, colorTwo }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.95 50.74">
    <path
      class={colorTwo ? colorTwo : "text-secondary"}
      d="M55.45,34.33A15.92,15.92,0,1,1,39.54,18.41,15.91,15.91,0,0,1,55.45,34.33Z"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
    />
    <path
      class={colorOne ? colorOne : "text-primary"}
      d="M34.33,18.41A15.92,15.92,0,1,1,18.41,2.5,15.92,15.92,0,0,1,34.33,18.41Z"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="5"
    />
  </svg>
);
