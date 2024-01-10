import React from "react";
import { Col, Row } from "../styles";
import { numberWithCommas } from "../../../helpers";

const TableBody = ({
  data,
  maxTotal,
  scale,
  prec,
  direction,
  bgColor,
  rowReverse = false,
}) => {
  return (
    <tbody>
      {data &&
        Object.keys(data).map((k) => {
          const item = data[k];
          const { cnt, amount, price, total } = item;
          const percentage = (total * 100) / (maxTotal * scale);
          return (
            <Row
              key={`book-${cnt}${amount}${price}${total}`}
              style={{
                backgroundImage: `linear-gradient(to ${direction}, ${bgColor} ${percentage}%, #1b262d 0%)`,
                flexDirection: rowReverse && "row-reverse",
              }}
            >
              <Col className="count">{cnt}</Col>
              <Col>{amount.toFixed(2)}</Col>
              <Col className="total">{total.toFixed(2)}</Col>
              <Col>{numberWithCommas(price.toFixed(prec))}</Col>
            </Row>
          );
        })}
    </tbody>
  );
};

export default TableBody;
