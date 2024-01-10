import styled from "styled-components";

export const Panel = styled.div`
  background-color: #1b262d;
  flex-grow: 0;
  display: flex;
  flex-flow: column;
  width: 645px;
  margin: 5px;
  padding: 5px;
  box-sizing: border-box;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const Sides = styled.div`
  display: flex;
  flex-basis: 100%;
  flex-flow: row nowrap;
`;
export const Side = styled.table`
  border-spacing: 0px;
  flex-basis: 50%;
  width: calc(50% - 2px);
  box-sizing: border-box;
  margin: 0px 1px;
  thead {
    td {
      text-transform: uppercase;
      font-size: 12px;
      color: #aaa !important;
    }
  }
`;

export const Row = styled.tr`
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  td.count {
    text-align: center;
  }
`;
export const Col = styled.td`
  color: #f0f0f0;
  padding: 1px 10px;
  flex: 1;
  font: normal 14px Arial;
  text-align: right;
`;

export const Bar = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: start;
  border-bottom: 1px solid #555;
  height: 30px;
  padding-bottom: 5px;
  margin-bottom: 10px;
  h3 {
    padding: 10px 0px 0px 20px;
    margin: 0px;
    font: normal 16px Arial !important;
    font-weight: normal;
    justify-self: flex-start;
    span {
      color: #888;
      font-size: 16px;
    }
  }
`;
export const Tools = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
`;
export const Icon = styled.div`
  display: flex;
  flex-grow: 0;
  padding: 10px;
  font: normal 15px Arial;
  svg {
    font-size: 20px;
  }
  cursor: pointer;
`;
