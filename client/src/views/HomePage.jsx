import axios from "axios";
import { useEffect, useState } from "react";

const HomePage = ({ url }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState("");

  const fetchRoom = async () => {
    try {
      const { data } = await axios.get(`${url}/rooms`, {
        headers: { Authorization: `Bearer ${localStorage.access_token}` },
      });
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRoom();
  }, []);

  if (isLoading) {
    return (
      <>
        <div>
          <h1>Loading...</h1>
        </div>
      </>
    );
  }
  return (
    <section className="w-full grow flex flex-col p-4 gap-4">
      <div className="w-full flex justify-start px-8">
        <div className="btn btn-outline btn-primary">Create new game</div>
      </div>
      <div className="overflow-auto border-2 border-accent">
        <table className="table table-fixed w-full h-full">
          <thead>
            <tr className="bg-accent text-black">
              <th>Name</th>
              <th>Status</th>
              <th>Host</th>
              <th>Guest</th>
              <th>Winner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms?.map((el) => {
              console.log(el);
              return (
                <tr>
                  <td>{el.name}</td>
                  <td>{el.status}</td>
                  <td>{el.FirstUser.username}</td>
                  <td>{el.SecondUser ? el.SecondUser.username : ""}</td>
                  <td>{el.winner}</td>
                  <td className="flex justify-center">
                    {el.status == "Finished" ? (
                      <>
                        <button
                          className="btn btn-sm btn-primary w-18"
                          disabled
                        >
                          Finished
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-primary w-18">
                          Join
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HomePage;
