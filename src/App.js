import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const ITEMS_URL = 'http://192.168.1.22:4567/items.json'

export const App = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todoItem, setTodoItem] = useState("");
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    let subscribed = false;
    if (!subscribed) {
      fetch(ITEMS_URL)
        .then((response) => response.json())
        .then((items) => {
          setItems(items);
          setIsLoading(false);
        })
        .catch((e) => setError(e));

      window.addEventListener("online", () => setIsOffline(!isOffline));
      window.addEventListener("offline", () => setIsOffline(!isOffline));
    }
    return () => {
      subscribed = true;
    };
  }, [isOffline]);

  const handleAddItem = (e) => {
    e.preventDefault()
    fetch(ITEMS_URL, {
      method: "POST",
      body: JSON.stringify({ item: todoItem }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((items) => {
        if (items.error) {
          alert(items.error);
        } else {
          setItems(items);
        }
      });

    setTodoItem("");
  };

  const handleDeleteItem = (itemId) => {
    fetch(ITEMS_URL, {
      method: "DELETE",
      body: JSON.stringify({ id: itemId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((items) => {
        if (items.error) {
          alert(items.error);
        } else {
          setItems(items);
        }
      });
  };

  if (error) console.warn(error);

  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">
          <img src={logo} className="App-logo" alt="logo" />
          My Todo List
        </span>
        {isOffline && <span className="badge badge-danger my-3">Offline</span>}
      </nav>

      <div className="px-3 py-2">
        <form className="form-inline my-3" onSubmit={handleAddItem}>
          <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
            <input
              className="form-control col-12"
              placeholder="What do you need to do?"
              value={todoItem}
              onChange={(e) => setTodoItem(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mb-2 col-4 col-sm-2">
            Add
          </button>
        </form>

        {isLoading && <p>Loading...</p>}

        {!isLoading && items.length === 0 && (
          <div className="alert alert-secondary">No items - all done!</div>
        )}

        {!isLoading && items && (
          <table className="table table-striped">
            <tbody>
              {items.map((item, i) => {
                return (
                  <tr key={item.id} className="row">
                    <td className="col-1">{i + 1}</td>
                    <td className="col-10">{item.item}</td>
                    <td className="col-1">
                      <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
