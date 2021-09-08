import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

export default function CardForm({
  role,
  readDeck,
  readCard,
  updateCard,
  createCard,
  triggerRerender,
}) {
  const [formData, setFormData] = useState({ front: "", back: "" });
  const [deckInfo, setDeckInfo] = useState({});
  const { deckId, cardId } = useParams();
  const history = useHistory();

  // fetch deckInfo based on the id of the current deck
  useEffect(() => {
    const ABORT = new AbortController();
    const getDeck = async () => {
      const response = await readDeck(deckId, ABORT.signal);
      setDeckInfo(() => response);
    };
    getDeck();

    if (cardId) {
      const getCard = async () => {
        const response = await readCard(cardId, ABORT.signal);
        console.log(response);
        setFormData(() => response);
      };
      getCard();
    }

    return () => {
      ABORT.abort();
    };
  }, [deckId, readDeck, cardId, readCard]);

  const handleChange = (e) => {
    const property = e.target.id;
    const value = e.target.value;
    const newFormData = { ...formData };
    newFormData[property] = value;
    setFormData(() => newFormData);
  };

  const handleSubmit = (e) => {
    const ABORT = new AbortController();
    if (role === "Add") {
      const runCreateFunction = async () => {
        try {
          const response = await createCard(deckId, formData, ABORT.signal);
          console.log("Card Created", response);
        } catch (e) {
          if (e.name === "AbortError") {
            console.log(e);
          } else {
            throw e;
          }
        }
      };
      runCreateFunction();
      history.push(`/decks/${deckId}`);
      triggerRerender(true);

      return () => {
        ABORT.abort();
      };
    } else {
      const runUpdateFunction = async () => {
        try {
          const response = await updateCard(formData, ABORT.signal);
          console.log("Card Updated", response);
        } catch (e) {
          if (e.name === "AbortError") {
            console.log(e);
          } else {
            throw e;
          }
        }
      };
      runUpdateFunction();
      history.push(`/decks/${deckId}`);

      return () => {
        ABORT.abort();
      };
    }
  };

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckInfo.id}`}>{deckInfo.name}</Link>
          </li>
          <li className="breadcrumb-item active">
            {role} Card {cardId}
          </li>
        </ol>
      </nav>
      <h2>
        {deckInfo.name}: {role} Card
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="front">Front</label>
          <textarea
            value={formData.front}
            onChange={handleChange}
            className="form-control"
            rows="3"
            id="front"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="back">Back</label>
          <textarea
            value={formData.back}
            onChange={handleChange}
            className="form-control"
            rows="3"
            id="back"
          ></textarea>
        </div>

        <Link to={`/decks/${deckInfo.id}`}>
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
