import { useEffect, useState } from "react";
import api from "../Services/api";

function BackendTest() {
  const [message, setMessage] = useState("Connecting...");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/test")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError(
          "Unable to connect to NIRVA backend."
        );
      });
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>NIRVA Backend Connection</h2>

      {error ? (
        <p style={{ color: "red" }}>
          {error}
        </p>
      ) : (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default BackendTest;