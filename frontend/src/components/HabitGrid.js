import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Image } from "react-bootstrap";
import "./HabitGrid.css";

const HabitTracker = () => {
  const [habits, setHabits] = useState({});
  const today = new Date().toISOString().split("T")[0];

  // Habit list with images
  const habitList = [
    { name: "Exercise", img: "/exercise.jpg" },
    { name: "Read a book", img: "/read.jpeg" },
    { name: "Drink water", img: "/water.jpg" },
    { name: "Meditate", img: "/meditate.jpg" },
    { name: "Journal", img: "/journal.jpg" },
    { name: "Sleep early", img: "/sleep.jpg" },
    { name: "No junk food", img: "/junk.jpg" },
  ];

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habits")) || {};
    setHabits(storedHabits);
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (index) => {
    const updatedHabits = { ...habits };
    if (!updatedHabits[today]) updatedHabits[today] = Array(7).fill(false);
    updatedHabits[today][index] = !updatedHabits[today][index];
    setHabits(updatedHabits);
  };

  const generateYearlyCalendar = () => {
    const year = new Date().getFullYear();
    const months = [...Array(12)].map((_, monthIndex) => {
      const firstDay = new Date(year, monthIndex, 1);
      const lastDay = new Date(year, monthIndex + 1, 0);
      const monthDays = [];

      let currentDate = new Date(firstDay);
      while (currentDate <= lastDay) {
        monthDays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return monthDays;
    });

    return months.map((monthDays) => {
      let firstWeekday = monthDays[0].getDay();
      firstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1;

      const weeksInMonth = Math.ceil((monthDays.length + firstWeekday) / 7);
      const monthGrid = Array.from({ length: weeksInMonth }, () =>
        Array(7).fill(null)
      );

      let dayCounter = 0;
      for (let i = 0; i < weeksInMonth; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstWeekday) {
            monthGrid[i][j] = null;
          } else if (dayCounter < monthDays.length) {
            const date = monthDays[dayCounter].toISOString().split("T")[0];
            monthGrid[i][j] = { date, index: dayCounter };
            dayCounter++;
          }
        }
      }

      return monthGrid;
    });
  };

  const getHabitColor = (date) => {
    const completed = habits[date] ? habits[date].filter((h) => h).length : 0;
    if (completed === 0) return "#EDEDED"; // Light Gray (No progress)
    if (completed <= 2) return "#A7E8A2"; // Light Green
    if (completed <= 4) return "#5ACB6D"; // Medium Green
    if (completed <= 6) return "#2E8B57"; // Deep Green
    return "#006400"; // Dark Green (Full completion)
  };

  const calendar = generateYearlyCalendar();

  return (
    <div className="habit-tracker-container">
      <h1 className="title text-center" style={{ fontSize: "3.6rem" }}>
        Habit Tracker
      </h1>
      <h5 className="quote text-center" style={{ fontStyle: "italic" }}>
        ——— Small habits, big results. Start TODAY! ———
      </h5>
      <Container className="mt-4 d-flex flex-column align-items-center">
        {/* Calendar Section */}
        <Card className="p-4 shadow-lg mt-4 habit-calendar">
          <div className="d-flex flex-wrap justify-content-center">
            {calendar.map((month, monthIndex) => (
              <div
                key={monthIndex}
                className="d-flex flex-column align-items-center mx-2"
              >
                <span className="fw-bold mt-3">
                  {
                    [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ][monthIndex]
                  }
                </span>

                {month.map((week, weekIndex) => (
                  <div key={weekIndex} className="d-flex">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        title={
                          day
                            ? new Date(day.date).toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : ""
                        }
                        className="habit-day"
                        style={{
                          width: "16px",
                          height: "16px",
                          margin: "2px",
                          backgroundColor: day
                            ? getHabitColor(day.date)
                            : "transparent",
                          borderRadius: "50%",
                          cursor: day ? "pointer" : "default",
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
        {/* Today's Habits Section with Cards */}
        <Card className=" mt-4 habits-section">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            {habitList.map((habit, index) => (
              <Card key={index} className="habit-card shadow-sm">
                <Image
                  src={habit.img}
                  className="habit-image"
                  alt={habit.name}
                  fluid
                />
                <Card.Body className="text-center">
                  <label className="form-check-label habit-label">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={habits[today] ? habits[today][index] : false}
                      onChange={() => toggleHabit(index)}
                    />
                    <span>{habit.name}</span>
                  </label>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default HabitTracker;
