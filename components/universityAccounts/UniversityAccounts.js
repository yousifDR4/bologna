import { useState, useEffect, useRef } from "react";
import classes from "./UniversityAccounts.module.css";
import uob from "../../Images/UniversityofBaghdad.png";
import search from "../../Images/search.png";
import AddUniversity from "./AddUniversity";
import { db, auth } from "../../store/fire";
import { getDocs, where, collection, query, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import Loader from "../UI/Loader/Loader";
import { usePaginationFetch } from "../../hooks/usePaginationFetch";
const universities = [];

const UniversityAccounts = () => {
  const [university, setUniversity] = useState(universities);
  const [loading, setLoading] = useState(true);
  const [showAddUniversity, setShowAddUniversity] = useState(false);
  const [initalUniversityValue, setInitialUniversityValue] =
    useState(universities);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const accountType = useSelector((state) => state.auth.accountType);
  const [nextdoc, setnextdoc] = useState(null);
  const fetchRef = useRef(true);
  const { data, load: myload } = usePaginationFetch(nextdoc, fetchRef.current);

  useEffect(() => {
    const f = async () => {
      try {
        if (data.length > 0) {
          console.log(myload);

          const s = data.map((doc) => {
            return {
              ...doc.data(),
              img: doc.data().profilePicture ? doc.data().profilePicture : uob,
              name: doc.data().name ? doc.data().name : "un",
            };
          });

          setUniversity((prev) => {
            return [...prev, ...s];
          });
          setInitialUniversityValue((prev) => {
            return [...prev, ...s];
          });

          fetchRef.current = false;
          if (data[4]) setnextdoc(data[4]);
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    f();
    setLoading(false);
  }, [data]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchValue(searchValue), 1000);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    performSearch(debouncedSearchValue);
  }, [debouncedSearchValue]);
  const performSearch = (value) => {
    console.log(11);
    if (value) {
      console.log("enter");
      if (value.trim() !== "") {
        setUniversity(
          initalUniversityValue.filter((university) =>
            university.name.toLowerCase().match(value.toLowerCase())
          )
        );
      } else {
        console.log(university);
      }
    } else {
      setUniversity(initalUniversityValue);
    }
  };
  const searchChangeHandler = (e) => {
    setSearchValue(e.target.value);
  };
  if (false) {
    return <Loader />;
  } else {
    return (
      <main className={classes.main}>
        {accountType === "Admin" && (
          <div
            className={`${classes.addUniversity} ${
              showAddUniversity === true ? classes.active : ""
            }`}
          >
            <AddUniversity />
          </div>
        )}
        {showAddUniversity && (
          <div
            className={classes.backDrop}
            onClick={() => setShowAddUniversity(false)}
          />
        )}
        {accountType === "Admin" && (
          <button
            className={classes.addUniversityButton}
            onClick={() => setShowAddUniversity(true)}
          >
            +
          </button>
        )}
        <div className={classes.universities}>
          <div className={classes.searchBar}>
            {" "}
            <div>
              <img src={search} />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={searchChangeHandler}
              placeholder="search university..."
            ></input>{" "}
          </div>
          <ul>
            {university.map((university) => (
              <li key={university.uid}>
                <img src={university.img} alt="" />
                <div>
                  <p>{university.name}</p> <span></span> <br />
                </div>
              </li>
            ))}
            {myload && <Loader />}
          </ul>
        </div>
      </main>
    );
  }
};
export default UniversityAccounts;
