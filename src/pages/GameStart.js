import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Row, Form } from "react-bootstrap";
import "../style/global.scss";

export default function GameStart() {
  const API_URL = `http://localhost:8000`;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [command, setCommand] = useState("");

  const cpuSound = useRef(new Audio("cpu_answer_noise1.mp3"));
  //--------------Async functions------------------------------------
  const fetchMessage = async () => {
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
  };

  const fetchGameData = async (com) => {
    try {
      const response = await axios.post(`${API_URL}/command`, { command: com });
      console.log(response.data);
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
  };
  //---------Sound functions---------------------------------------
  const playSound = () => {
    if (cpuSound.current.paused) {
      cpuSound.current.play().catch((err) => console.log("Play error: ", err));
    }
  };
  const stopSound = () => {
    cpuSound.current.pause();
    cpuSound.current.currentTime = 0;
  };
  //----------Dpendencies--------------------------------------------

  useEffect(() => {
    fetchMessage();
  }, []);

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
  }, [loading, message, isPaused, currentIndex]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (isPaused && !isCompleted) {
        setIsPaused(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      setCommand("");
    };
  }, [isPaused]);

  return (
    <Container>
      <Row className="fs-3 text-left mt-5">
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
          </div>
        )}
      </Row>
    </Container>
  );
}
