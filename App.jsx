import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]);

  const handleClick = (val) => {
    if (input === "0" && val !== ".") {
      setInput(val);
      return;
    }
    setInput(input + val);
  };

  const clearAll = () => {
    setInput("0");
    setExpression("");
  };

  const clearEntry = () => setInput("0");

  const backspace = () => {
    if (input.length === 1) setInput("0");
    else setInput(input.slice(0, -1));
  };

  const calculate = () => {
    try {
      const expr = input;
      const result = eval(expr);
      setExpression(`${expr} =`);
      setHistory([`${expr} = ${result}`, ...history]);
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const percentage = () => {
    setInput((parseFloat(input) / 100).toString());
  };

  const square = () => {
    setExpression(`sqr(${input})`);
    setInput((parseFloat(input) ** 2).toString());
  };

  const sqrt = () => {
    setExpression(`√(${input})`);
    setInput(Math.sqrt(parseFloat(input)).toString());
  };

  const inverse = () => {
    setExpression(`1/(${input})`);
    setInput((1 / parseFloat(input)).toString());
  };

  const toggleSign = () => {
    setInput((parseFloat(input) * -1).toString());
  };

  return (
    <div className="app">
      <div className="content">

        <section className="calculator">
          <div className="topbar">
            <span className="menu">☰</span>
            <span className="title">Standard</span>
          </div>

          <div className="result-wrap">
            <div className="expression">{expression || "\u00a0"}</div>
            <div className="result">{input}</div>
          </div>

          <div className="memory-row">
            <button className="memory-btn">MC</button>
            <button className="memory-btn">MR</button>
            <button className="memory-btn active-memory">M+</button>
            <button className="memory-btn">M−</button>
            <button className="memory-btn">MS</button>
          </div>

          <div className="buttons">
            <button className="light" onClick={percentage}>%</button>
            <button className="light" onClick={clearEntry}>CE</button>
            <button className="light" onClick={clearAll}>C</button>
            <button className="light op" onClick={backspace}>⌫</button>

            <button className="light" onClick={inverse}>⅟x</button>
            <button className="light" onClick={square}>x²</button>
            <button className="light" onClick={sqrt}>²√x</button>
            <button className="light op" onClick={() => handleClick("/")}>÷</button>

            <button onClick={() => handleClick("7")}>7</button>
            <button onClick={() => handleClick("8")}>8</button>
            <button onClick={() => handleClick("9")}>9</button>
            <button className="light op" onClick={() => handleClick("*")}>×</button>

            <button onClick={() => handleClick("4")}>4</button>
            <button onClick={() => handleClick("5")}>5</button>
            <button onClick={() => handleClick("6")}>6</button>
            <button className="light op" onClick={() => handleClick("-")}>−</button>

            <button onClick={() => handleClick("1")}>1</button>
            <button onClick={() => handleClick("2")}>2</button>
            <button onClick={() => handleClick("3")}>3</button>
            <button className="light op" onClick={() => handleClick("+")}>+</button>

            <button onClick={toggleSign}>+/-</button>
            <button onClick={() => handleClick("0")}>0</button>
            <button onClick={() => handleClick(".")}>.</button>
            <button className="equal" onClick={calculate}>=</button>
          </div>
        </section>

        <aside className="history">
          <div className="history-header">
            <span className="active">History</span>
            <span>Memory</span>
          </div>

          <div className="history-list">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-expression">
                  {item.split("=")[0]}=
                </div>
                <div className="history-value">
                  {item.split("=")[1]}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;
