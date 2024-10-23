import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Container, Row, Form, Button } from "react-bootstrap";
import "../style/global.scss";

export default function GameStart() {
  //Local
  //   const API_URL = `http://localhost:8000`;
  //Online
  const API_URL = `https://coding-adventurepipenv-run-uvicorn-main.onrender.com`;

  const [isOn, setIsOn] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [command, setCommand] = useState("");
  const [isCursorHidden, setIsCursorHidden] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [countdownActive, setCountdownActive] = useState(false);

  const cpuSound = useRef(new Audio("cpu_answer_noise1.mp3"));
  const oldCpu = useRef(new Audio("old_cpu_sound.mp3"));
  const click_beep = useRef(new Audio("click_beep.mp3"));

  //------------Button On-Off logic------------------------------
  const toggleButton = () => {
    setIsOn((prev) => !prev);
  };

  //--------------Async functions------------------------------------
  const fetchMessage = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      const message = response.data.message;
      setMessage(message);
      setDisplayedMessage([]);
      setCurrentIndex(0);
      setIsPaused(false);
      setIsCompleted(false);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  }, [API_URL]);

  const fetchGameData = useCallback(
    async (com) => {
      try {
        const response = await axios.post(`${API_URL}/command`, {
          command: com,
        });
        const message = response.data.situation || response.data.message;
        setMessage(message);
        setDisplayedMessage([]);
        setCurrentIndex(0);
        setIsPaused(false);
        setIsCompleted(false);
        setLoading(false);
      } catch (e) {
        console.log(e.message);
        setLoading(false);
      }
    },
    [API_URL]
  );
  //---------Sound functions---------------------------------------
  const playSound = useCallback(() => {
    if (cpuSound.current.paused) {
      cpuSound.current.play().catch((err) => console.log("Play error: ", err));
    }
  }, []);
  const stopSound = () => {
    cpuSound.current.pause();
    cpuSound.current.currentTime = 0;
  };

  const playOldCpuSound = () => {
    oldCpu.current.volume = 0.05;
    oldCpu.current.loop = true;
    oldCpu.current.play();
  };

  const stopOldCpuSound = () => {
    oldCpu.current.pause();
    oldCpu.current.currentTime = 0;
  };

  const playBeep = () => {
    click_beep.current.play();
  };
  //-----------Cursor control logic-------------------------------
  const toggleCursor = (hide) => {
    document.body.style.cursor = hide ? "none" : "default";
  };

  useEffect(() => {
    const handleKeyCombination = (event) => {
      if (event.ctrlKey && event.key === "q") {
        setIsCursorHidden((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyCombination);
    return () => {
      window.removeEventListener("keydown", handleKeyCombination);
    };
  }, []);

  useEffect(() => {
    if (isOn) {
      toggleCursor(isCursorHidden);
    } else {
      toggleCursor(!isCursorHidden);
    }
  }, [isOn, isCursorHidden]);

  //----------Dpendencies--------------------------------------------
  useEffect(() => {
    if (isOn) {
      playOldCpuSound();
    } else {
      stopOldCpuSound();
    }
  }, [isOn]);

  useEffect(() => {
    if (isOn) {
      fetchMessage();
    }
  }, [isOn, fetchMessage]);

  useEffect(() => {
    if (!loading && message && !isPaused && !isCompleted) {
      playSound();

      const displayNextChar = () => {
        if (currentIndex < message.length) {
          const currentChar = message[currentIndex];
          setCurrentIndex((prevIndex) => prevIndex + 1);

          if (currentChar === "$") {
            setDisplayedMessage((prev) => [
              ...prev,
              <br key={`line-b-key-${currentIndex}`} />,
            ]);
            stopSound();
            setIsPaused(true);
            return;
          }
          if (currentChar === "§") {
            setDisplayedMessage((prev) => [
              ...prev,
              <br key={`line-b-key-${currentIndex}`} />,
            ]);
            return;
          }

          if (currentChar === "@") {
            setDisplayedMessage((prev) => [...prev, ""]);
            setCountdown(10);
            setCountdownActive(true);
            setIsCompleted(true);
            stopSound();
            return;
          }

          setDisplayedMessage((prev) => [...prev, currentChar]);

          if (currentIndex + 1 === message.length) {
            setIsPaused(true);
            setIsCompleted(true);
            stopSound();
          }
        }
      };

      const charDisplayInterval = setInterval(() => {
        if (!isPaused) {
          displayNextChar();
        }
      }, 10);

      return () => {
        clearInterval(charDisplayInterval);
      };
    }
  }, [loading, message, isPaused, currentIndex, isCompleted, playSound]);

  // Countdown----------------------------
  useEffect(() => {
    let countdownInterval;

    if (isOn) {
      if (countdownActive && countdown > 0) {
        countdownInterval = setInterval(() => {
          setCountdown((t) => t - 1);
        }, 1000);
      } else if (countdown === 0) {
        setIsOn(false);
        setCountdownActive(false);
      }
    } else {
      setCountdown(10);
      setCountdownActive(false);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdownActive, countdown, isOn]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (isPaused && !isCompleted) {
        setIsPaused(false);
      }
    };
    //-------Key listener--------------------

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      setCommand("");
    };
  }, [isPaused, isCompleted]);

  //---------RENDER----------------------------------

  return (
    <Container fluid className="GameBasic" style={{ padding: "0 1 rem" }}>
      <Row className="fs-2 text-left">
        <div style={{ marginTop: "1rem" }}>
          <Button
            onClick={() => {
              toggleButton();
              playBeep();
            }}
            variant={isOn ? "success" : "danger"}
            style={{
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              marginRight: "1rem",
              transition: "background-color 0.9s ease",
            }}
          ></Button>
          <span>{!isOn ? "Off" : "On"}</span>
        </div>
      </Row>
      {isOn ? (
        <Row className="fs-3 text-left mt-4 ms-5 me-1">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {displayedMessage}
              {command}
              <b className="cursor">_</b>
              <Form.Control
                id="command"
                name="command"
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isCompleted) {
                    fetchGameData(command);
                    setCommand("");
                  }
                }}
                autoFocus
                autoComplete="off"
              />
              {countdownActive && (
                <div className="countdown-display">
                  Extinction in{""} {countdown}
                </div>
              )}
            </div>
          )}
        </Row>
      ) : (
        <></>
      )}
    </Container>
  );
}
