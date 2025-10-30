import React from "react";
import { Card, Row } from "antd";
import "./styles.css";
import Button from "../Button";

const Cards = ({showIncomeModal , showExpenseModal , income , expense , currentBalance}) => {
  return (
    <div>
      <Row className="my-row">
        <Card bordered={true} title="Current Balance" className="my-card">
          <p>₹{currentBalance}</p>
          <Button text="Reset Balance" blue={true} />
        </Card>

        <Card  bordered={true} title="Total Income" className="my-card" onClick={showIncomeModal}>
          <p>₹{income}</p>
          <Button text="Reset Balance" blue={true} />
        </Card>

        <Card bordered={true} title="Total Expenses" className="my-card" onClick={showExpenseModal}>
          <p>₹{expense}</p>
          <Button text="Reset Balance" blue={true} />
        </Card>
      </Row>
    </div>
  );
};

export default Cards;
