import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

export default function DeckForm({
  role,
  createDeck,
  updateDeck,
  reload,
  readDeck,
}) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  let history = useHistory();
  const { deckId } = useParams();

  useEffect(() => {
    if (role === "Edit") {
      const ABORT = new AbortController();
      const retrieveDeck = async () => {
        try {
          const response = await readDeck(deckId, ABORT.signal);
          setFormData(() => response);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log(err);
          } else {
            throw err;
          }
        }
      };

      retrieveDeck();

      return () => {
        ABORT.abort();
      };
    }
    // eslint-disable-next-line
  }, [deckId]);

  const handleChange = (e) => {
    const property = e.target.id;
    const value = e.target.value;
    const newFormData = { ...formData };
    newFormData[property] = value;
    setFormData(() => newFormData);
  };

  const handleSubmit = (e) => {
    const ABORT = new AbortController();
    const submitNewDeck = async () => {
      try {
        e.preventDefault();
        if (role === "Create") {
          await createDeck(formData, ABORT.signal);
        } else {
          await updateDeck(formData, ABORT.signal);
        }
        reload();
        history.push("/");
      } catch (e) {
        if (e.name === "AbortError") {
          console.log(e);
        } else {
          throw e;
        }
      }
    };

    submitNewDeck();

    return () => {
      ABORT.abort();
    };
  };

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">{role} Deck</li>
        </ol>
      </nav>
      <h2>{role} Deck</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            id="name"
            type="text"
            placeholder="Deck Name"
          ></input>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            id="description"
            placeholder="Brief description of the deck"
          ></textarea>
        </div>

        <Link to="/">
          <button className="btn btn-secondary">Cancel</button>
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Submit
        </button>
      </form>
    </React.Fragment>
  );
}
