import { useEffect, useState } from "react";
import socket from "../socket";
import Game from "../components/Game";
import axios from "axios";
import { useParams } from "react-router-dom";

const GamePage = () => {
  const { id } = useParams();
  const [orientation, setOrientation] = useState("");
  const [loading, setLoading] = useState(false);
  const [room, SetRoom] = useState(undefined);
  // console.log(id);

  //FETCH ROOM
  const fetchRoom = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/room/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.access_token}` },
      });
      SetRoom(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  if (loading) {
    return (
      <>
        <div>
          <h1>Loading</h1>
        </div>
      </>
    );
  }
  return (
    <section className="w-full grow flex flex-row justify-center items-center">
      {loading ? (
        ""
      ) : (
        <>
          <div className="w-1/4 h-full flex flex-col justify-end items-center pb-12">
            <div>
              <img src="" alt="" />
            </div>
            <div>
              <p>Player Name</p>
              <p>Win Rate</p>
              <p>MMR</p>
            </div>
          </div>
          <div className="w-2/5">
            <Game />
          </div>
          <div className="w-1/4 h-full flex flex-col justify-start items-center pt-12 ">
            <div>
              <img src="" alt="" />
            </div>
            <div>
              <p>Opponent Name</p>
              <p>Win Rate</p>
              <p>MMR</p>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default GamePage;
