import React from "react";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import {
  Container,
  Row,
  Button,
  Col,
  Card,
  CardHeader,
  Form,
} from "react-bootstrap";
import "../style/global.scss";

export default function HomePage() {
  //   const API_URL = `http://localhost:8000`;

  //   const dispatch = useDispatch();
  const navigate = useNavigate();

  // const fetchMessage = () => {
  //   return async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}`);
  //       const message = response.data.message;
  //       console.log(message);
  //       await Promise.all([]);
  //     } catch (e) {
  //       console.log(e.message);
  //       throw e;
  //     }
  //   };
  // };

  return (
    <>
      <Container>
        <Row className="fs-1 text-center mt-3 mb-5">
          Welcome to my Coder's Adventure game
        </Row>
        <Row>
          <Button
            variant="warning"
            className="fs-3 mt-5 ms-5 me-5"
            onClick={() => {
              navigate("./start");
            }}
          >
            Play
          </Button>
        </Row>
      </Container>
    </>
  );
}
