const LeaderBoard = () => {
  return (
    <section className="w-full grow flex flex-col p-4 gap-4">
      <div className="overflow-auto w-3/4 mx-auto border-2 border-accent">
        <table className="table table-fixed w-full h-full">
          <thead>
            <tr className="bg-accent text-black">
              <th>Player Name</th>
              <th>Win</th>
              <th>Total Match</th>
              <th>MMR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Afif</td>
              <td>1</td>
              <td>99</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LeaderBoard;
