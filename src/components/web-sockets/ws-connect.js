import CRC from "crc-32";
import _ from "lodash";
import { PAIR, WEB_SOCKET_URL } from "../../constants";

const pair = PAIR;

const conf = {
  wshost: WEB_SOCKET_URL,
};

let BOOK = {};
let connected = false;
let connecting = false;
let cli;
let seq = null;
let channels = {};
function wsconnect({ saveBook, setConnectionStatus, connectionStatus }) {
  if (!connecting && !connected)
    cli = new WebSocket(conf.wshost, "protocolOne");
  if (!connectionStatus) {
    cli.close();
    return;
  }
  if (connecting || connected) return;
  connecting = true;

  cli.onopen = function open() {
    console.log("WS open");

    connecting = false;
    connected = true;

    setConnectionStatus(true);

    BOOK.bids = {};
    BOOK.asks = {};
    BOOK.psnap = {};
    BOOK.mcnt = 0;

    cli.send(JSON.stringify({ event: "conf", flags: 65536 + 131072 }));

    cli.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: pair,
        prec: "P0",
        len: 25,
        freq: "F0",
      })
    );
  };

  cli.onclose = function open() {
    seq = null;
    console.log("WS close");
    connecting = false;
    connected = false;
    setConnectionStatus(false);
  };

  cli.onmessage = function (message_event) {
    var msg = message_event.data;
    msg = JSON.parse(msg);

    if (msg.event === "subscribed") {
      channels[msg.channel] = msg.chanId;
      console.log({ channels });
    }

    if (msg.event) return;

    if (msg[0] === channels["book"]) {
      if (msg[1] === "hb") {
        seq = +msg[2];
        return;
      } else if (msg[1] === "cs") {
        seq = +msg[3];

        let checksum = msg[2];
        let csdata = [];
        let bids_keys = BOOK.psnap["bids"];
        let asks_keys = BOOK.psnap["asks"];

        for (let i = 0; i < 25; i++) {
          if (bids_keys[i]) {
            let price = bids_keys[i];
            let pp = BOOK.bids[price];
            csdata.push(pp.price, pp.amount);
          }
          if (asks_keys[i]) {
            let price = asks_keys[i];
            let pp = BOOK.asks[price];
            csdata.push(pp.price, -pp.amount);
          }
        }

        let cs_str = csdata.join(":");
        let cs_calc = CRC.str(cs_str);

        if (cs_calc !== checksum) {
          console.error("CHECKSUM_FAILED");
        }
        return;
      }

      if (BOOK.mcnt === 0) {
        _.each(msg[1], function (pp) {
          pp = { price: pp[0], cnt: pp[1], amount: pp[2] };
          let side = pp.amount >= 0 ? "bids" : "asks";
          pp.amount = Math.abs(pp.amount);
          BOOK[side][pp.price] = pp;
        });
      } else {
        let cseq = +msg[2];
        msg = msg[1];

        if (!seq) {
          seq = cseq - 1;
        }

        if (cseq - seq !== 1) {
          console.error("OUT OF SEQUENCE", seq, cseq);
        }

        seq = cseq;

        let pp = { price: msg[0], cnt: msg[1], amount: msg[2] };

        if (!pp.cnt) {
          if (pp.amount > 0) {
            if (BOOK["bids"][pp.price]) {
              delete BOOK["bids"][pp.price];
            }
          } else if (pp.amount < 0) {
            if (BOOK["asks"][pp.price]) {
              delete BOOK["asks"][pp.price];
            }
          }
        } else {
          let side = pp.amount >= 0 ? "bids" : "asks";
          pp.amount = Math.abs(pp.amount);
          BOOK[side][pp.price] = pp;
        }
      }

      _.each(["bids", "asks"], function (side) {
        let sbook = BOOK[side];
        let bprices = Object.keys(sbook);

        let prices = bprices.sort(function (a, b) {
          if (side === "bids") {
            return +a >= +b ? -1 : 1;
          } else {
            return +a <= +b ? -1 : 1;
          }
        });

        BOOK.psnap[side] = prices;
      });

      BOOK.mcnt++;
      saveBook(BOOK);
    }
  };
}

export { connected, wsconnect };
