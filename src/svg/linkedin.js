import * as React from "react";
import Svg, { G, Path } from "react-native-svg";

function SvgLinkedin(props) {
  return (
    <Svg height={60} width={60} {...props}>
      <G
        stroke="#000"
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      >
        <Path d="M52 34.69V50h-9.854V35.75c0-3.73-1.54-6.273-4.929-6.273-2.594 0-4.038 1.717-4.706 3.37-.254.597-.213 1.423-.213 2.253V50h-9.763s.127-25.24 0-27.535h9.763v4.322c.577-1.89 3.698-4.585 8.673-4.585C47.147 22.202 52 26.16 52 34.69h0zM8.543 50h8.688V22.466H8.543zM17.782 14.38c0 2.418-1.848 4.335-4.809 4.335h-.06c-2.854 0-4.702-1.908-4.702-4.33 0-2.47 1.904-4.335 4.817-4.335 2.906 0 4.694 1.862 4.754 4.33h0z" />
        <Path d="M55 59H5a4 4 0 01-4-4V5a4 4 0 014-4h50a4 4 0 014 4v50a4 4 0 01-4 4h0z" />
      </G>
    </Svg>
  );
}

export default SvgLinkedin;

