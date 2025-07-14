const { useState, useEffect, useRef } = React;

function Clock25plus5() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState("Session");

  const intervalRef = useRef(null);
  const beepAudioRef = useRef(null);

  useEffect(() => {
    if (!isRunning && timerLabel === "Session") {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength, isRunning, timerLabel]);

  useEffect(() => {
    if (!isRunning && timerLabel === "Break") {
      setTimeLeft(breakLength * 60);
    }
  }, [breakLength, isRunning, timerLabel]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const changeLength = (type, operation) => {
    if (isRunning) return;

    if (type === "break") {
      if (operation === "inc" && breakLength < 60) {
        setBreakLength(breakLength + 1);
      } else if (operation === "dec" && breakLength > 1) {
        setBreakLength(breakLength - 1);
      }
    } else if (type === "session") {
      if (operation === "inc" && sessionLength < 60) {
        setSessionLength(sessionLength + 1);
      } else if (operation === "dec" && sessionLength > 1) {
        setSessionLength(sessionLength - 1);
      }
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            beepAudioRef.current.play();
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
    beepAudioRef.current.pause();
    beepAudioRef.current.currentTime = 0;
  };

  return (
    <div className="clock-container">
      <h1>25 + 5 Clock</h1>
      <div className="length-controls">
        <div className="length-control">
          <h2 id="break-label">Break Length</h2>
          <div className="buttons">
            <button
              id="break-decrement"
              onClick={() => changeLength("break", "dec")}
            >
              -
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-increment"
              onClick={() => changeLength("break", "inc")}
            >
              +
            </button>
          </div>
        </div>
        <div className="length-control">
          <h2 id="session-label">Session Length</h2>
          <div className="buttons">
            <button
              id="session-decrement"
              onClick={() => changeLength("session", "dec")}
            >
              -
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              id="session-increment"
              onClick={() => changeLength("session", "inc")}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <span id="time-left">{formatTime(timeLeft)}</span>
      </div>

      <div className="timer-controls">
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      <audio
        id="beep"
        preload="auto"
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        ref={beepAudioRef}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Clock25plus5 />);
