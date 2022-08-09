import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { GameComponent } from "phaser-react-tools";
import config from "./config";
import events from "./events";
import { useEventEmitter, useEventListener } from "phaser-react-tools";
import Head from "next/head";

type Props = {};

export default function GameRoot({}: Props) {
  console.log(config);
  console.log(GameComponent);
  return (
    <>
      <Head>
        <title>Runes Explorer</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GameComponent config={config}>
        <GameWatchers />
        {/* <Overlay> */}
        {/* <FrameCounter></FrameCounter> */}
        {/* <EventEmitterButton></EventEmitterButton> */}
        {/* </Overlay> */}
      </GameComponent>
    </>
  );
}

export function GameWatchers({}: Props) {
  const [width, height] = [1000, 1000];

  const emitResize = useEventEmitter(events.ON_WINDOW_RESIZE);
  useEffect(() => {
    try {
      emitResize({ width, height });
    } catch (err) {
      // console.log("emitResize err:", err);
    }
  }, [width, height]);

  return <React.Fragment />;
}
