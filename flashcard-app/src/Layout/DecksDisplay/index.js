import React from "react";
import {
  EyeFill,
  JournalBookmarkFill,
  TrashFill,
  PlusCircleFill,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function DecksDisplay({ decks, handleDelete }) {

  const decksForDisplay = decks.map((deck, idx) => {
    return (
      <div className="card" key={idx}>
        <div className="card-body">
          <div className="d-flex">
            <h5 className="card-title">{deck.name}</h5>
            <p className="text-muted ml-auto">{deck.cards.length} cards</p>
          </div>
          
          <p className="card-text">{deck.description}</p>

          <div className="d-flex">
            <Link to={`/decks/${deck.id}`}>
              <button className="btn btn-secondary" type="button">
                {" "}
                <EyeFill /> &nbsp; View
              </button>
            </Link>
            <Link to={`/decks/${deck.id}/study`}>
              <button
                className="btn btn-primary"
                type="button"
                style={{ marginLeft: "10px" }}
              >
                {" "}
                <JournalBookmarkFill />
                &nbsp; Study
              </button>
            </Link>
            <button name={deck.id} onClick={() => handleDelete(deck.id)} className="btn btn-danger ml-auto" type="button">
              {" "}
              <TrashFill name={deck.id}/>
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <Link to="/decks/new">
        <button
          className="btn btn-secondary"
          style={{ marginBottom: "25px" }}
          type="button"
        >
          {" "}
          <PlusCircleFill />
          &nbsp; Create Deck
        </button>
      </Link>
      <div id="decksContainer" style={{ marginBottom: "50px" }}>
        {decksForDisplay}
      </div>
    </React.Fragment>
  );
}
