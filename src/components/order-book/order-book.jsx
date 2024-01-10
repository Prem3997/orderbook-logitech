import React, { useEffect, useState } from "react";
import { Bar, Icon, Panel, Side, Sides, Tools } from "./styles";
import {
  MdZoomIn,
  MdZoomOut,
  MdSettingsApplications,
  MdNotifications,
  MdAdd,
  MdRemove,
} from "react-icons/md";
import { connect } from "react-redux";
import {
  formatAsks,
  formatBids,
  getMaximumAsksTotal,
  getMaximumBidsTotal,
} from "../../helpers";
import { throttle } from "lodash";
import * as Actions from "./actions";
import { wsconnect } from "../web-sockets/ws-connect";
import TableHeader from "./table/table-header";
import TableBody from "./table/table-body";
import Loader from "../loader";
import _ from "lodash";

const PRECESION = ["P0", "P1"];

const OrderBook = connect((s) => ({
  book: s.orderbook,
}))((props) => {
  const { book } = props;
  const { bids, asks } = book;

  const saveBook = throttle((b) => props.dispatch(Actions.saveBook(b)), 500);

  const [precesion, setPrecision] = useState(0);
  const [scale, setScale] = useState(1.0);

  const decPrecision = () => {
    precesion > 0 &&
      setPrecision((precesion + PRECESION.length - 1) % PRECESION.length);
  };

  const incPrecision = () => {
    precesion < 4 && setPrecision((precesion + 1) % PRECESION.length);
  };

  const decScale = () => setScale(scale + 0.1);
  const incScale = () => setScale(scale - 0.1);

  const [connectionStatus, setConnectionStatus] = useState(true);

  const startConnection = () => !connectionStatus && setConnectionStatus(true);
  const stopConnection = () => connectionStatus && setConnectionStatus(false);

  const prec = precesion % PRECESION.length;

  useEffect(() => {
    wsconnect({ book, saveBook, setConnectionStatus, connectionStatus });
  }, [connectionStatus, book, saveBook]);

  const _asks = formatAsks(asks);
  const maxAsksTotal = getMaximumAsksTotal(_asks);

  const _bids = formatBids(bids);
  const maxBidsTotal = getMaximumBidsTotal(_bids);

  return (
    <div>
      <Panel>
        <Bar>
          <h3>
            Order Book <span>BTC/USD</span>
          </h3>
          <Tools>
            {!connectionStatus && (
              <Icon onClick={startConnection}> Connect </Icon>
            )}
            {connectionStatus && (
              <Icon onClick={stopConnection}> Disconnect </Icon>
            )}
            <Icon onClick={incPrecision}>
              <MdAdd />
            </Icon>
            <Icon onClick={decPrecision}>
              <MdRemove />
            </Icon>
            <Icon>
              <MdNotifications />
            </Icon>
            <Icon>
              <MdSettingsApplications />
            </Icon>
            <Icon onClick={decScale}>
              <MdZoomOut />
            </Icon>
            <Icon onClick={incScale}>
              <MdZoomIn />
            </Icon>
          </Tools>
        </Bar>
        <Sides>
          <Side>
            <TableHeader />
            <TableBody
              data={_bids}
              maxTotal={maxBidsTotal}
              prec={prec}
              scale={scale}
              direction="left"
              bgColor="#314432"
            />
          </Side>
          {_.isEmpty(_asks) && _.isEmpty(_bids) && <Loader />}
          <Side>
            <TableHeader rowReverse={true} />
            <TableBody
              data={_asks}
              maxTotal={maxAsksTotal}
              prec={prec}
              scale={scale}
              direction="right"
              bgColor="#402c33"
              rowReverse={true}
            />
          </Side>
        </Sides>
        <span>
          {" "}
          FULL BOOK |{" "}
          <span style={{ color: connectionStatus ? "#314432" : "#402c33" }}>
            ●{" "}
          </span>
          <u>{connectionStatus ? "REAL-TIME" : "OFFLINE"}</u>
        </span>
      </Panel>
    </div>
  );
});

export default OrderBook;
