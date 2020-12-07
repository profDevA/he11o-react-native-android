import * as React from "react";
import Svg, { G, Path } from "react-native-svg";

function SvgFacebook(props) {
  return (
    <Svg height={60} width={60} {...props}>
      <G stroke="#000" strokeWidth={2} fill="none" fillRule="evenodd">
        <Path d="M40.043 59V36.696h7.203l1.074-8.693h-8.277v-5.549c0-2.514.67-4.229 4.144-4.229l4.427-.006V10.45c-.767-.108-3.394-.348-6.453-.348-6.383 0-10.753 4.055-10.753 11.494v6.407h-7.226v8.693h7.226V59h8.635z" />
        <Path
          d="M55 59H5a4 4 0 01-4-4V5a4 4 0 014-4h50a4 4 0 014 4v50a4 4 0 01-4 4h0z"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

export default SvgFacebook;

