import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Container, Row, Image } from "react-bootstrap";
import "../style/global.scss";

export default function GameStartMobile() {
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
  const [countdown, setCountdown] = useState(10);
  const [countdownActive, setCountdownActive] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const [optionBuffer, setOptionBuffer] = useState("");

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
      const response = await axios.get(`${API_URL}/mobile`);
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
        const response = await axios.post(`${API_URL}/mobile/command`, {
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
          if (currentChar === "[") {
            setIsOption(true);
            setOptionBuffer("");
            return;
          }
          if (currentChar === "]") {
            setIsOption(false);
            const option = optionBuffer;

            setDisplayedMessage((prev) => [
              ...prev,
              <span
                key={`clickable-${currentIndex}`}
                onClick={() => fetchGameData(option)}
              >
                {option}
              </span>,
            ]);
            setOptionBuffer("");
            return;
          }

          if (isOption) {
            setOptionBuffer((prev) => prev + currentChar);
          } else {
            setDisplayedMessage((prev) => [...prev, currentChar]);
          }
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
  }, [loading, message, isPaused, currentIndex, isCompleted, playSound,
    fetchGameData, isOption, optionBuffer
  ]);

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

  //-------Key listener--------------------
  useEffect(() => {
    const handleInteraction = () => {
      if (isPaused && !isCompleted) {
        setIsPaused(false);
      }
    };

    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("touchstart", handleInteraction);
      setCommand("");
    };
  }, [isPaused, isCompleted]);

  //---------RENDER----------------------------------

  return (
    <Container fluid className="GameBasicMobile alt-font" style={{ padding: "0 1 rem" }}>
      <Row className="fs-1 text-left align-items-center">
        <div style={{ marginTop: "1rem" }}>
          <div
            style={{ position: "relative", width: "45px", height: "auto" }}
            onClick={() => {
              toggleButton();
              playBeep();
            }}
          >
            <Image
              src="on_button3.png"
              alt="on"
              className="button"
              style={{
                position: "absolute",
                width: "100%",
                height: "auto",
                opacity: isOn ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            />
            <Image
              src="off_button3.png"
              alt="off"
              className="button"
              style={{
                position: "absolute",
                width: "100%",
                height: "auto",
                opacity: isOn ? 0 : 1,
                transition: "opacity 1s ease-in-out",
              }}
            />
          </div>
          <div
            style={{
              display: "inline-block",
              position: "relative",
              top: "0rem",
              left: "3.5rem",
            }}
          >
            {!isOn ? "Off" : "On"}
          </div>
        </div>
      </Row>
      {isOn ? (
        <Row className="fs-5 text-left mt-4 ms-5 me-1">
          {loading ? (
            <div>Waking up server. Hold on a minute...</div>
          ) : (
            <div>
              {displayedMessage}
              {command}
              <b className="cursor">_</b>
           
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
