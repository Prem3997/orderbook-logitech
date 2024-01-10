import React from "react";
import { Col, Row } from "../styles";

const TableHeader = ({ rowReverse = false }) => {
  return (
    <thead>
      <Row style={{ flexDirection: rowReverse && "row-reverse" }}>
        <Col className="count">Count</Col>
        <Col>Amount</Col>
        <Col className="total">Total</Col>
        <Col>Price</Col>
      </Row>
    </thead>
  );
};

export default TableHeader;
