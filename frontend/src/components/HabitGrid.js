import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card } from "react-bootstrap";

const HabitTracker = () => {
  const [habits, setHabits] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habits")) || {};
    setHabits(storedHabits);
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (date, index) => {
    const updatedHabits = { ...habits };
    if (!updatedHabits[date]) updatedHabits[date] = Array(7).fill(false);
    updatedHabits[date][index] = !updatedHabits[date][index];
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
      const monthGrid = Array.from({ length: weeksInMonth }, () => Array(7).fill(null));

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

  const calendar = generateYearlyCalendar();

  const getHabitColor = (date) => {
    const completed = habits[date] ? habits[date].filter((h) => h).length : 0;
    if (completed === 0) return "#EDEDED";  // Light Gray (No progress)
    if (completed <= 2) return "#A5DAFF";  // Soft Blue
    if (completed <= 4) return "#4FA8FF";  // Medium Blue
    if (completed <= 6) return "#1E90FF";  // Deep Blue
    return "#8A2BE2";  // Vibrant Purple (Full completion)
  };
  

  return (
    <div className="habit-tracker-container">
      {/* Title */}
      <h1 className="title text-center">Habit Tracker</h1>

      <Container className="mt-4 d-flex flex-column align-items-center">
        <Card className="p-4 shadow-lg habit-card">
          {/* Calendar Grid */}
          <div className="d-flex flex-wrap justify-content-center">
            {calendar.map((month, monthIndex) => (
              <div key={monthIndex} className="d-flex flex-column align-items-center mx-2">
                {/* Month Name */}
                <span className="fw-bold mt-3">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthIndex]}
                </span>

                {month.map((week, weekIndex) => (
                  <div key={weekIndex} className="d-flex">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        title={
                          day
                            ? new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : ""
                        }
                        className="habit-day"
                        style={{
                          width: "12px",
                          height: "12px",
                          margin: "2px",
                          backgroundColor: day ? getHabitColor(day.date) : "transparent",
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

        {/* Today's Habits Section */}
        <Card className="p-4 shadow-lg mt-4 habits-section">
          <h5 className="text-center">Today's Habits</h5>
          <div className="d-flex justify-content-center flex-wrap">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="form-check mx-3 my-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`habit-${i}`}
                  checked={habits[today] ? habits[today][i] : false}
                  onChange={() => toggleHabit(today, i)}
                />
                <label className="form-check-label ms-2 habit-label" htmlFor={`habit-${i}`}>
                  Habit {i + 1}
                </label>
              </div>
            ))}
          </div>
        </Card>
      </Container>

      {/* CSS Styling */}
      <style>
  {`
    .habit-tracker-container {
      background: linear-gradient(135deg, #89CFF0, #8A2BE2); /* Light Blue to Vibrant Purple */
      min-height: 100vh;
      padding: 40px 0;
    }
    .title {
      font-size: 2.5rem;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .habit-card {
      background: white;
      border-radius: 15px;
      max-width: 90%;
    }
    .habits-section {
      background: white;
      border-radius: 15px;
      max-width: 70%;
    }
    .habit-label {
      font-size: 1.1rem;
      font-weight: 500;
    }
    .habit-day:hover {
      transform: scale(1.2);
      transition: 0.2s;
    }
  `}
</style>

    </div>
  );
};

export default HabitTracker;
