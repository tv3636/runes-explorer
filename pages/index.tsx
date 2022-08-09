import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import React from "react";

const DynamicGameRoot = dynamic(() => import("../game/GameRoot"), {
  ssr: false,
});

const Filler = styled.div`
  min-height: 100vh;
`;

const IndexPage = () => (
    <Filler>
      <DynamicGameRoot />
    </Filler>
);

export default IndexPage;
