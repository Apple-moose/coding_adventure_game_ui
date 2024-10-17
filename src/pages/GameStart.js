import React, { useState, useEffect } from "react";
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

  const cpuSound = new Audio("cpu_answer_noise1.mp3");
  const playSound = () => {
    cpuSound.play();
  };
  const stopSound = () => {
    cpuSound.pause();
    cpuSound.currentTime = 0;
  };

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

  useEffect(() => {
    if (soundPlaying) {
      if (cpuSound.paused) {
        cpuSound.play();
      }
    } else {
      cpuSound.pause();
      cpuSound.currentTime = 0;
    }
  }, [soundPlaying]);

  useEffect(() => {
    if (!loading && message && !isPaused) {
      setSoundPlaying(true);
      
      const displayNextChar = () => {
        if (currentIndex < message.length) {
          const currentChar = message[currentIndex];
          setDisplayedMessage((prev) => prev + currentChar);
          setCurrentIndex((prevIndex) => prevIndex + 1);

          if (currentChar === ">") {
            setSoundPlaying(false);
            setIsPaused(true);
            return;
          }

          if (currentIndex >= message.length - 1) {
            setSoundPlaying(false);
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
        setSoundPlaying(false);
      };
    }
  }, [loading, message, isPaused, currentIndex]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (isPaused) {
        setIsPaused(false);
        if (!soundPlaying) {
          setSoundPlaying(true);
        }
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
