import React, { useEffect, useState } from "react";
import {
  PlusCircleFill,
  JournalBookmarkFill,
  PencilFill,
  TrashFill,
} from "react-bootstrap-icons";
import { Link, useRouteMatch } from "react-router-dom";
import { listCards, readDeck } from "../../utils/api";

export default function CardsDisplay({ handleDeckDelete, handleCardDelete }) {
  const { params } = useRouteMatch();
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState({});

  useEffect(() => {
    const ABORT = new AbortController();
    const getCards = async () => {
      try {
        const response = await listCards(params.deckId, ABORT.signal);
        setCards(() => response);
      } catch (e) {
        if (e.name === "AbortError") {
          console.log(e);
        } else {
          throw e;
        }
      }
    };

    const getDeck = async () => {
      try {
        const response = await readDeck(params.deckId, ABORT.signal);
        setDeck(() => response);
      } catch (e) {
        if (e.name === "AbortError") {
          console.log(e);
        } else {
          throw e;
        }
      }
    };

    getCards();
    getDeck();

    return () => {
      ABORT.abort();
    };
  }, [params.deckId]);

  const deleteAndRefresh = (cardId, deckId) => {
    handleCardDelete(cardId, deckId);
    let newCards = cards.filter(card => card.id !== cardId);
    setCards(() => newCards);
  }

  const cardsForDisplay = cards.map((card) => {
    return (
      <div key={card.id} className="card">
        <div className="card-body">
          <div className="row">
            <div className="col col-6">{card.front}</div>
            <div className="col col-6">{card.back}</div>
          </div>

          <div className="d-flex" style={{ marginTop: "10px" }}>

            <Link to={`/decks/${params.deckId}/cards/${card.id}/edit`} className="ml-auto">
              <button className="btn btn-secondary" type="button">
                {" "}
                <PencilFill />
                &nbsp; Edit
              </button>
            </Link>
            <button
              style={{ marginLeft: "10px" }}
              className="btn btn-danger"
              type="button"
              onClick={() => deleteAndRefresh(card.id, params.deckId)}
            >
              {" "}
              <TrashFill />
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">
            {deck.name}
          </li>
        </ol>
      </nav>
      <h3>{deck.name}</h3>
      <p>{deck.description}</p>
      <div className="d-flex" style={{ marginBottom: "20px" }}>
        <Link to={`/decks/${deck.id}/edit`}>
          <button className="btn btn-secondary" type="button">
            {" "}
            <PencilFill />
            &nbsp; Edit
          </button>
        </Link>
        <Link to={`/decks/${deck.id}/study`}>
          <button
            className="btn btn-primary"
            style={{ marginLeft: "10px" }}
            type="button"
          >
            {" "}
            <JournalBookmarkFill />
            &nbsp; Study
          </button>
        </Link>
        <Link to={`/decks/${deck.id}/cards/new`}>
          <button
            className="btn btn-primary"
            style={{ marginLeft: "10px" }}
            type="button"
          >
            {" "}
            <PlusCircleFill />
            &nbsp; Add Cards
          </button>
        </Link>
        <button
          style={{ marginLeft: "10px" }}
          className="btn btn-danger ml-auto"
          type="button"
          onClick={() => handleDeckDelete(params.deckId)}
        >
          {" "}
          <TrashFill />
        </button>
      </div>
      <h2>Cards</h2>
      <div id="cardsGroup" style={{marginBottom: "50px"}}>{cardsForDisplay}</div>
    </React.Fragment>
  );
}
