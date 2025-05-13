'use client';

import React, { useState } from "react";
import { useSnack } from "./SnackProvider";
import { ContinuousCalendar } from "@/components/Calendar";
import PopupType from "@/types/data";

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface props {
  eventos: PopupType[]
  popUpClick?: () => void

}
export default function DemoWrapper(props: props) {
  const { createSnack } = useSnack();

  const onClickHandler = (day: number, month: number, year: number) => {
    const snackMessage = `Clicked on ${monthNames[month]} ${day}, ${year}`
    createSnack(snackMessage, 'success');
  }

  return (
    <div className="relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center">
      <div className="relative h-full overflow-auto">
        <ContinuousCalendar onClick={onClickHandler} eventos={props.eventos} popUpClick={props.popUpClick} />
      </div>
    </div>
  );
}
