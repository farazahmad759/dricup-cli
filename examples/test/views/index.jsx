import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Contrived example to show how one might use Flow type annotations
function countTo(n) {
  var a = [];
  for (var i = 0; i < n; i++) {
    a.push(i + 1);
  }
  return a.join(", ");
}

function Index(props) {
  const [page, setPage] = useState("loading");
  console.log("haha");
  useEffect(() => {
    console.log("haha");
    axios
      .get("localhost:3000/users")
      .then((res) => {
        setPage("page loaded");
      })
      .catch((err) => {
        setPage("page error");
      });
  }, []);
  return (
    <div title={props.title}>
      <h1>{page}</h1>
      <p>Welcome to {props.title}</p>
      <p>
        I can count to 10:
        {countTo(10)}
      </p>
    </div>
  );
}

Index.propTypes = {
  title: PropTypes.string,
};

module.exports = Index;
