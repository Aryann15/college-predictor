import React, { useState } from "react";
import Script from "next/script";
import Dropdown from "../components/dropdown";
import { useRouter } from "next/router";

import getConstants from "../constants";

const HomePage = () => {
  const categoryOptions = getConstants().CATEGORY_OPTIONS;

  const genderOptions = getConstants().GENDER_OPTIONS;

  const roundNumberOptions = getConstants().ROUND_NUMBER_OPTIONS;

  const examOptions = getConstants().EXAM_OPTIONS;

  const stateOptions = getConstants().STATE_OPTIONS;

  const [rank, setRank] = useState(0);
  const [roundNumber, setRoundNumber] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [exam, setExam] = useState("");
  const [stateName, setStateName] = useState("");
  const router = useRouter();

  const handleCategoryDropdownChange = (selectedOption) => {
    setCategory(selectedOption.label);
  };

  const handleRoundNumberDropdownChange = (selectedOption) => {
    setRoundNumber(selectedOption.label);
  };

  const handleGenderDropdownChange = (selectedOption) => {
    setGender(selectedOption.label);
  };

  const handleExamDropdownChange = (selectedOption) => {
    setExam(selectedOption.label);
  };

  const handleStateNameDropdownChange = (selectedOption) => {
    setStateName(selectedOption.label);
  };

  const handleRankChange = (event) => {
    const enteredRank = event.target.value;
    setRank(enteredRank);
  };

  const handleSubmit = () => {
    if (exam == "NEET") {
      router.push(
        `/college_predictor?rank=${rank}&category=${category}&roundNumber=${roundNumber}&exam=${exam}`
      );
    } else {
      router.push(
        `/college_predictor?rank=${rank}&category=${category}&roundNumber=${roundNumber}&exam=${exam}&gender=${gender}&stateName=${stateName}`
      );
    }
  };

  const isCategoryInOptions = categoryOptions.some(
    (option) => option.label === category
  );
  const isRoundNumberInOptions = roundNumberOptions.some(
    (option) => option.label == roundNumber
  );
  const isGenderInOptions = genderOptions.some(
    (option) => option.label === gender
  );
  const isExamInOptions = examOptions.some((option) => option.label === exam);
  const isStateNameInOptions = stateOptions.some(
    (option) => option.label === stateName
  );

  const isSubmitDisabled =
    rank <= 0 ||
    !isCategoryInOptions ||
    !isRoundNumberInOptions ||
    (exam !== "NEET" &&
      (!isGenderInOptions || !isExamInOptions || !isStateNameInOptions));

  return (
    <div className="flex flex-col h-screen ">
      <div className="flex justify-center items-center flex-col flex-grow px-10">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FHGVRT52L7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-FHGVRT52L7');
      `}
        </Script>
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 ">
          <h1 className="text-2xl font-bold text-center mb-6">
            {getConstants().TITLE}
          </h1>
          <form>
            <div className="mb-4">
              <label className="mt-4 w-full block text-md font-semibold text-gray-700 m-2">
                {getConstants().EXAM_LABEL}
              </label>
              <Dropdown
                id="exam"
                options={examOptions}
                onChange={handleExamDropdownChange}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700 font-semibold mb-2"
              >
                {getConstants().CATEGORY_LABEL}
              </label>
              <Dropdown
                id="category"
                options={categoryOptions}
                onChange={handleCategoryDropdownChange}
                className="w-full"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="rank"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  {exam === "NEET"
                    ? getConstants().NEET_RANK_LABEL + "(" + exam + "):"
                    : getConstants().RANK_LABEL + "(" + exam + "):"}
                </label>
                <input
                  id="rank"
                  type="number"
                  value={rank}
                  onChange={handleRankChange}
                  className="border border-gray-300 rounded w-full py-2 px-3"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="roundNumber"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  {getConstants().ROUND_NUMBER_LABEL}
                </label>
                <Dropdown
                  id="roundNumber"
                  options={roundNumberOptions}
                  onChange={handleRoundNumberDropdownChange}
                  className="w-full"
                />
              </div>
            </div>
            {exam !== "NEET" && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="gender"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    {getConstants().GENDER_LABEL}
                  </label>
                  <Dropdown
                    id="gender"
                    options={genderOptions}
                    onChange={handleGenderDropdownChange}
                    isDisabled={exam === "NEET"}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="state"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    {getConstants().STATE_LABEL}
                  </label>
                  <Dropdown
                    id="state"
                    options={stateOptions}
                    onChange={handleStateNameDropdownChange}
                    isDisabled={exam === "NEET"}
                    className="w-full"
                  />
                </div>
              </>
            )}
            <button
              type="button"
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
