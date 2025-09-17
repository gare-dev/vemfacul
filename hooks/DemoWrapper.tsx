'use client';

import React, { useState } from "react";
import { useSnack } from "./SnackProvider";
import { ContinuousCalendar } from "@/components/Calendar";
import PopupType from "@/types/data";

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface props {
  eventos: PopupType[]
  popUpClick?: (e?: React.MouseEvent<HTMLDivElement>) => void
  popupFilterClick?: () => void
  isEditable: boolean
  onDateClick?: (day: number, month: number, year: number) => void
}
export default function DemoWrapper(props: props) {

  return (
    <div className="relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center pb-10 mb-10">
      <div className="relative h-full overflow-auto">
        <ContinuousCalendar isEditable={props.isEditable} onClick={props.onDateClick} eventos={props.eventos} popUpClick={props.popUpClick} popupFilterClick={props.popupFilterClick} />
      </div>
    </div>
  );
}
