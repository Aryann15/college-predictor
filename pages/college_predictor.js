import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getConstants from "../constants";
import PredictedCollegesTable from "../components/PredictedCollegeTables";
import Navbar from "../components/navbar";

const CollegePredictor = () => {
  const router = useRouter();
  const {
    rank,
    category,
    roundNumber,
    exam,
    gender = "",
    stateName = "",
  } = router.query;
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let exam_fol;
        if (exam === "JEE Main" || exam === "JEE Advanced") {
          exam_fol = "JEE";
        } else exam_fol = "NEET";
        const response = await fetch(
          "/data/" + exam_fol + "/" + category + ".json"
        );
        const data = await response.json();

        // Filter the data based on round number
        const dataForGivenQuery = data.filter((item) => {
          const itemRound = parseInt(item["Round"], 10);
          const itemExam = item["Exam"];
          if (exam === "JEE Main" || exam === "JEE Advanced") {
            const itemGender = item["Gender"];
            const itemState = item["State"];
            const itemQuota = item["Quota"];
            const checkForState =
              itemState == stateName ||
              stateName == "All India" ||
              itemQuota == "OS" ||
              itemQuota == "AI";
            return (
              itemRound == roundNumber &&
              itemGender == gender &&
              itemExam == exam &&
              checkForState
            );
          } else if (exam === "NEET") {
            return itemRound == roundNumber;
          }
        });

        // Filter the data based on closing rank
        const filteredData = dataForGivenQuery.filter((item) => {
          const closingRank = parseInt(item["Closing Rank"], 10);
          return closingRank > parseInt(rank, 10);
        });

        // Sort the filteredData in ascending order of college rank
        // for same college (with same rank), sort with opening rank
        filteredData.sort((a, b) => {
          const rankA = a["College Rank"];
          const rankB = b["College Rank"];

          if (rankA !== rankB) {
            return rankA - rankB;
          } else {
            const openingRankA = a["Opening Rank"];
            const openingRankB = b["Opening Rank"];
            return openingRankA - openingRankB;
          }
        });

        setFilteredData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    if (rank) {
      setIsLoading(true);
      fetchData();
    }
  }, [rank]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="max-w-6xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">{getConstants().TITLE}</h1>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            {exam !== "NEET" ? "Your Category Rank: " : "Your Rank: "}
            <span className="text-indigo-600">{rank}</span>
          </h2>
          <h3 className="text-gray-700">Chosen Round Number: {roundNumber}</h3>
          <h3 className="text-gray-700">Chosen Exam: {exam}</h3>
          {exam !== "NEET" && (
            <>
              <h3 className="text-gray-700">Chosen Gender: {gender}</h3>
              <h3 className="text-gray-700">Chosen Home State: {stateName}</h3>
            </>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-4 text-center">Predicted colleges and courses for you</h3>
        {isLoading ? (
          <div className="flex items-center justify-center flex-col mt-8">
            <div className="border-t-2 border-transparent border-indigo-600 rounded-full w-10 h-10 animate-spin mb-4"></div>
            <p className="text-gray-700">Loading...</p>
          </div>
        ) : (
          <div>
            <PredictedCollegesTable data={filteredData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegePredictor;