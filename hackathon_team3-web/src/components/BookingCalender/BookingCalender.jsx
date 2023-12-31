import React, { useEffect, useState } from "react";
import BookingBar from "../BookingBar/BookingBar";
import BookingMember from "./BookingMember";
import Calendar from "react-calendar";
import "./Calendar.css";
import moment from "moment";

import * as S from "./BookingCalender.styles";
import BookingTime from "./BookingTime";
import { getTime } from "../../apis/bookingApi";
import BookingCheck from "../BookingCheck/BookingCheck";

const BookingCalender = ({ store, storeId, setIsBookingOpen }) => {
  const [isNext, setIsNext] = useState(false);

  const numberOfMembers = 20;
  const [selectedMember, setSelectedMember] = useState(0);

  const [isSelected, setIsSelected] = useState(false)
  const [times, setTimes] = useState();

  const [lunchStart, setLunchStart] = useState();
  // const [lunchEnd, setLunchEnd] = useState();
  // const [dinnerStart, setDinnerStart] = useState();
  const [dinnerEnd, setDinnerEnd] = useState();
  const [num, setNum] = useState();
  const [timeComponents, setTimeComponents] = useState();

  const [term, setTerm] = useState();
  const [peopleNum, setPeopleNum] = useState(1);

  const [selectedTime, setselectedTime] = useState(); 
  const [timesArray, setTimesArray] = useState([]); 

  // const setReservationPeopleNum = useState(
  //   (state) => state.setReservationPeopleNum
  // );

  const setMembers = (member) => {
    setSelectedMember(member);
    setIsSelected((prev) => !prev)
    console.log(isSelected)
  };

  const memberComponents = Array.from(
    { length: numberOfMembers },
    (_, index) => (
      <BookingMember
        isSelected={isSelected}
        key={index}
        text={`${index + 1}`}
        onClick={() => setMembers(index + 1)}
      />
    )
  );

  // const timeComponents = Array.from({ length: 10 }, (_, index) => (
  //   <BookingTime
  //     key={index}
  //     text={`${index + 1}`}
  //     onClick={() => setMembers(index + 1)}
  //   />
  // ));

  const [value, onChange] = useState(new Date());
  const [nowDate, setNowDate] = useState("날짜");
  const [nowDay, setNowDay] = useState("요일");

  const getTime = async (storeId) => {
    try {
      const response = await fetch(
        `http://52.79.169.113:8080/restaurants/${storeId}/reservations?timestamp=2023-12-21`
      );
      const data = await response.json();
      // console.log(data)

      setselectedTime(data.result);

      setLunchStart(new Date(new Date(data.result.lunchStart) - 32400000));
      // setLunchEnd(new Date(data.result.lunchEnd))
      // setDinnerStart(new Date(data.result.dinnerStart))
      setDinnerEnd(new Date(new Date(data.result.dinnerEnd) - 32400000));
      setTerm((dinnerEnd - lunchStart) / (1000 * 60));
      // console.log(lunchStart)
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  };

  const updateBooking = async (storeId, date, countPeople) => {
    // const totalPrice = menus.reduce((acc, menu) => acc + menu.price * menu.cnt, 0);

    try {
      const response = await fetch(
        `http://52.79.169.113:8080/restaurants/${storeId}/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            time: date,
            countPeople,
          }),
        }
      );

      if (!response.ok) {
        // Handle error if the response status is not OK (e.g., 4xx or 5xx)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Handle the data as needed

      return data;
    } catch (error) {
      console.error("Error during updateBooking:", error);
      // Handle errors here, e.g., show an error message to the user
    }
  };

  const handlerDateChange = (selectedDate) => {
    onChange(selectedDate);
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    setNowDay(daysOfWeek[selectedDate.getDay()]);
    setNowDate(moment(selectedDate).format("MM월 DD일"));
  };

  const setToday = () => {
    const today = new Date();
    onChange(today);
  };

  // const setTime = (startTime) => {
  //   setTimes(startTime);
  // };

  useEffect(() => {
    getTime(storeId);
    getTimeGap();

    const interval = 30;
    setNum(term / interval);

    const timeIntervals = Array.from({ length: num }, (_, index) => {
      const startTime = moment(lunchStart)
        .add(index * interval, "minutes")
        .format("HH:mm");
      // console.log(lunchStart)
      const endTime = moment(lunchStart)
        .add((index + 1) * interval, "minutes")
        .format("HH:mm");
      return { startTime, endTime };
    });

    const components = timeIntervals.map((timeInterval, index) => (
      <BookingTime
        key={index}
        startTime={timeInterval.startTime}
        onClick={() => setselectedTime(timeInterval.startTime)}
      />
    ));

    setTimeComponents(components);
  }, [storeId, term, lunchStart, dinnerEnd]);

  const handleRightBtnClick = () => {
    setIsNext(true);
    console.log(isNext)
  }

  const handlePeopleButton = (index) => {
    const peopleCount = index + 1;
    setPeopleNum(peopleCount);
  }

  const getTimeGap = async () => {
    try {
      const response = await fetch(
        `http://52.79.169.113:8080/restaurants/${storeId}/reservations?timestamp=2023-12-19`
      );
      const data = await response.json();

      setTimesArray(data.result.availableTime);
      
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  }

  const handleTimeButton = (index) => {
    setselectedTime(timesArray[index]);
  }
  
  return (
    !isNext ? 
      (<BookingBar leftBtn={"취소"} rightBtn={"확인"} setIsBookingOpen={setIsBookingOpen} rightBtnOnClick={() => handleRightBtnClick()}
        leftBtnOnClick={() => setIsBookingOpen(false)}>
        <S.BookingCalenderHeader>
          <S.BookingCalenderToday onClick={() => setToday()}>오늘</S.BookingCalenderToday>
        </S.BookingCalenderHeader>
        <S.CalendarContainer>
          <Calendar
            className={"calendar"}
            onChange={handlerDateChange}
            value={value}
            formatDay={(locale, date) => date.getDate()}
            next2Label={null}
            prev2Label={null}
          >
          /</Calendar>
        </S.CalendarContainer>
        <div style={{
          display: 'flex',
          background: '#D9D9D9',
          height: '2px',
          width: '90%',
          marginTop: '20px',
          marginLeft: '20px'
        }}></div>
      <S.BookingMemberContainer>
        <S.ReservationPeople>
          {[...Array(20)].map((_, index) => (
            <S.PeopleButton
            key={index}
            onClick={
              () => {
                handlePeopleButton(index);
                // setReservationPeopleNum(index+1);
              }
            }
            isActive={peopleNum === index + 1}>
              {index + 1}명
            </S.PeopleButton>
          ))}
        </S.ReservationPeople>
      </S.BookingMemberContainer>
      <S.BookingTimeContainer>
        {/* {timeComponents} */}
        <S.ReservationTime>
          {timesArray.map((_, index) => (
            <S.TimeButton
            key={index}
            onClick={
              () => {
                handleTimeButton(index);
              }
            }
            isActive={selectedTime === timesArray[index]}>
              {timesArray[index]}
            </S.TimeButton>
          ))}
        </S.ReservationTime>
      </S.BookingTimeContainer>
    </BookingBar>)
    : (<BookingCheck store={store} nowDate={nowDate} nowDay={nowDay} setIsBookingOpen={setIsBookingOpen} selectedMember={peopleNum} time={selectedTime}></BookingCheck>)
  );
   
};

export default BookingCalender;
