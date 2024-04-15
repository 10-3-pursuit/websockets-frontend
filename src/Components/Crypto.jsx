import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3003");

const Crypto = () => {
  const [cryptos, setCryptos] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    socket.on("cryptoUpdates", (cryptoUpdates) => {
      setCryptos(cryptoUpdates.data.tokens);
      setToggle(!toggle);
    });

    return () => {
      socket.off("cryptoUpdates");
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <h1>Crypto Stats</h1>
      <h2
        style={{
          marginBottom: "50px",
          marginTop: 10,
          backgroundColor: toggle ? "yellow" : "lime",
          padding: 5,
        }}
      >
        Last Updated: {new Date().toLocaleTimeString()}
      </h2>
      {console.log(cryptos)}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          rowGap: 40,
        }}
      >
        {cryptos.length > 0 &&
          cryptos.map((crypto) => (
            <div key={crypto.address}>
              <img src={`${crypto.logoURI}`} alt={crypto.name} />
              <h3>Name: {crypto.name}</h3>
              <p>Liquidity: {crypto.liquidity}</p>
              <p>Change: {crypto.v24hChangePercent}</p>
              <p>Price: {crypto.v24hUSD}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Crypto;
