import React from "react";

import * as S from "./BookingBar.styles";

const BookingBar = ({ children, leftBtn, rightBtn, setIsBookingOpen, leftBtnOnClick, rightBtnOnClick }) => {
  return (
    <>
      <S.Outer onClick={() => setIsBookingOpen(false)} />
      <S.BookingBarContainer>
        {children}
        <S.BookingBtns>
          <S.BookingCancel onClick={leftBtnOnClick}>{leftBtn}</S.BookingCancel>
          <S.BookingGo onClick={rightBtnOnClick}>{rightBtn}</S.BookingGo>
        </S.BookingBtns>
      </S.BookingBarContainer>
    </>
  );
};

export default BookingBar;
