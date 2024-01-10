import "./App.css";
import configureStore from "./store";
import { Provider } from "react-redux";
import OrderBook from "./components/order-book";
function App() {
  const store = configureStore();
  return (
    <Provider store={store}>
      <div className="App">
        <OrderBook/>
      </div>
    </Provider>
  );
}

export default App;
