import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Button, Image } from "react-bootstrap";
import "../style/global.scss";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="HomePage">
        <Row className="w-100">
          <div className="mt-2 ms-3 fs-1 text-center">
            Welcome to my Coder's Profile game
          </div>
        </Row>
        <Row
          className="p-0 m-0"
          style={{ position: "relative", width: "100%" }}
        >
          <Image
            src="old_computer.jpg"
            alt="oh oh...not found!"
            className="background"
            style={{ width: "100%", height: "auto" }}
          />
          <div
            onClick={() => {
              navigate("./start");
            }}
            style={{
              position: "absolute",
              top: "10%",
              left: "37%",
              width: "32%",
              height: "44%",
              cursor: "pointer",
              // backgroundColor: "grey",
              backgroundColor: "rgba(0,0,0,0)",
            }}
          ></div>
          <div
            onClick={() => {
              navigate("./start");
            }}
            style={{
              position: "absolute",
              top: "57%",
              left: "38%",
              width: "4%",
              height: "4%",
              cursor: "pointer",
              // backgroundColor: "purple",
              backgroundColor: "rgba(0,0,0,0)",
            }}
          ></div>
        </Row>
      </div>
    </>
  );
}
