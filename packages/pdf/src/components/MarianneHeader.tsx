import { ViewProps, View, Image } from "@react-pdf/renderer";
import React from "react";

export const MarianneHeader = ({
  marianneUrl,
  styles,
}: {
  marianneUrl: string;
  styles?: ({ pageNumber }: { pageNumber: number }) => ViewProps["style"];
}) => {
  return (
    <View
      fixed
      render={({ pageNumber }) => (
        <View
          style={{
            position: "absolute",
            top: -36,
            left: 40,
            height: 13,
            width: 34,
            ...styles?.({ pageNumber }),
          }}
          fixed
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            src={marianneUrl}
          />
        </View>
      )}
    />
  );
};
