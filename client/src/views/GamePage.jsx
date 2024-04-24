import Game from "../components/Game";

const GamePage = () => {
  return (
    <section className="w-full grow flex flex-row justify-center items-center">
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
    </section>
  );
};

export default GamePage;
