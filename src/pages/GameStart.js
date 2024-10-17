import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row } from "react-bootstrap";
import "../style/global.scss";

export default function GameStart() {
  const API_URL = `http://localhost:8000`;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedMessage, setDisplayedMessage] = useState("");

  const cpuSound = new Audio("cpu_answer_noise1.mp3");

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
    if (!loading && message) {
      let currentIndex = -1;
      cpuSound.play();
      const displayInterval = setInterval(() => {
        currentIndex++; //(currentIndex = currentIndex + 1)
        if (currentIndex < message.length) {
          setDisplayedMessage((prev) => prev + message[currentIndex]);
        } else {
          clearInterval(displayInterval);
          cpuSound.pause();
          cpuSound.currentTime = 0;
        }
      }, 100);
      return () => clearInterval(displayInterval);
    }
  }, [loading, message]);

  return (
    <Container>
      <Row className="fs-1 text-left mt-5">
        {loading ? <p>Loading...</p> : <p>{displayedMessage}</p>}
      </Row>
    </Container>
  );
}
