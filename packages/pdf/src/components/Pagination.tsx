import { View, Text } from "@react-pdf/renderer";
import React from "react";

export const Pagination = () => {
  return (
    <View fixed style={{ position: "absolute", bottom: 40, right: 40, fontSize: 10 }}>
      <Text
        render={({ pageNumber, totalPages }) => (
          <Text style={{ fontSize: 8 }}>
            Page {pageNumber} sur {totalPages}
          </Text>
        )}
      />
    </View>
  );
};
