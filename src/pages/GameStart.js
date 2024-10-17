import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Row } from "react-bootstrap";
import "../style/global.scss";

export default function GameStart() {
  const API_URL = `http://localhost:8000`;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const cpuSound = useRef(new Audio("cpu_answer_noise1.mp3"));

  const fetchMessage = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      const message = response.data.message;
      setMessage(message);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  const playSound = () => {
    if (cpuSound.current.paused) {
      cpuSound.current.play().catch((err) => console.log("Play error: ", err));
    }
  };

  // Function to stop the sound
  const stopSound = () => {
    cpuSound.current.pause();
    cpuSound.current.currentTime = 0;
  };

  const doneWithSound = () => {
    stopSound();
    console.log("Done with sound!");
  };

  useEffect(() => {
    if (!loading && message && !isPaused) {
      playSound();

      const displayNextChar = () => {
        if (currentIndex < message.length) {
          const currentChar = message[currentIndex];
          setDisplayedMessage((prev) => prev + currentChar);
          setCurrentIndex((prevIndex) => prevIndex + 1);

          if (currentChar === ">") {
            stopSound();
            setIsPaused(true);
            return;
          }

          if (currentIndex + 1 === message.length) {
            setIsPaused(true);
            doneWithSound();
            console.log("currentIndex is too big!");
          }
        }
      };

      const charDisplayInterval = setInterval(() => {
        if (!isPaused) {
          displayNextChar();
        }
      }, 100);

      return () => {
        clearInterval(charDisplayInterval);
      };
    }
  }, [loading, message, isPaused, currentIndex]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (isPaused) {
        setIsPaused(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPaused]);

  return (
    <Container>
      <Row className="fs-1 text-left mt-5">
        {loading ? <p>Loading...</p> : <p>{displayedMessage}</p>}
      </Row>
    </Container>
  );
}
