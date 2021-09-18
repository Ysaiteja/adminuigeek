import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(10);
  const [isPreviousButtonDisable, setPreviousButtonDisable] = useState(false);
  const [isNextButtonDisable, setNextButtonDisable] = useState(true);
  const [activeButton, setActiveButton] = useState(true);
  const [isSelectedAll, setCheck] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          let datalist = data;
          datalist.map((obj) => (obj["selection"] = false));
          setMembers(datalist);
        });
    };

    fetchMembers();
  }, []);

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const presentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  const prev = "<";
  const moveFirst = "<<";
  const moveLast = ">>";
  const next = ">";
  const pageNumber = [];
  const totalMembers = members.length;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const editMember = (id) => console.log("Edited");
  const deleteMember = (id) => console.log("Deleted");

  const previousPage = () => {
    console.log(currentPage);
    if (currentPage > 1 && currentPage <= pageNumber[pageNumber.length - 1]) {
      //newPageNumber = currentPage - 1;
      setCurrentPage(currentPage - 1);
      if (currentPage - 1 > 1) {
        setPreviousButtonDisable(true);
        setNextButtonDisable(true);
      } else {
        setPreviousButtonDisable(false);
        setNextButtonDisable(true);
      }
    }
    //return setCurrentPage(newPageNumber);
  };

  const nextPage = () => {
    console.log(currentPage);
    console.log(pageNumber[5 - 1]);
    if (currentPage < pageNumber[pageNumber.length - 1] || currentPage === 1) {
      //newPageNumber = currentPage + 1;
      setCurrentPage(currentPage + 1);
      console.log(pageNumber[pageNumber.length - 1]);
      if (currentPage + 1 >= pageNumber[pageNumber.length - 1]) {
        setNextButtonDisable(false);
        setPreviousButtonDisable(true);
      } else {
        setNextButtonDisable(true);
        setPreviousButtonDisable(true);
      }
    }
  };

  const checkAll = () => {
    if (isSelectedAll) {
      setCheck(false);
      let pageList = [...presentMembers];
      pageList.map((obj) => (obj.selection = false));
    } else {
      setCheck(true);
      console.log(members);
      let pageList = [...presentMembers];
      pageList.map((obj) => (obj.selection = true));
    }
  };
  const handleCheckChange = (e, id) => {
    let list = [...members];
    console.log(id);
    list.map((obj) => {
      if (obj.id === id) {
        obj["selection"] = !obj["selection"];
      }
      return obj;
    });
    setMembers(list);
  };

  for (let i = 1; i <= Math.ceil(totalMembers / membersPerPage); i++) {
    pageNumber.push(i);
  }
  return (
    <div className="App">
      <input
        type="text"
        className="searchElement"
        placeholder="Search by name, email or role"
      />
      <table>
        <tr>
          <th>
            <input type="checkbox" onClick={() => checkAll()} />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        {presentMembers.map((eachMember) => (
          <tr key={`key- _ ${eachMember.id}`}>
            <td>
              <input
                type="checkbox"
                checked={eachMember.selection}
                key={eachMember.id}
                onChange={(e) => {
                  handleCheckChange(e, eachMember.id);
                }}
              />
            </td>
            <td className="name">{eachMember.name}</td>
            <td className="email">{eachMember.email}</td>
            <td className="role">{eachMember.role}</td>
            <td>
              <button onClick={() => editMember(eachMember.id)}>
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => deleteMember(eachMember.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </table>
      <div className="d-flex flex-row">
        <button className="deleteAllButton">DeleteAll</button>
        <button
          className={
            isPreviousButtonDisable || currentPage > 1
              ? "activeButton"
              : "inactiveButton"
          }
          onClick={() => paginate(1)}
        >
          {moveFirst}
        </button>
        <button
          className={
            isPreviousButtonDisable || currentPage > 1
              ? "activeButton"
              : "inactiveButton"
          }
          onClick={() => previousPage()}
        >
          {prev}
        </button>

        {pageNumber.map((number) => (
          <button
            className={
              activeButton && currentPage === number
                ? "presentButton"
                : "activeButton"
            }
            key={number}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => nextPage()}
          className={
            isNextButtonDisable &&
            currentPage < pageNumber[pageNumber.length - 1]
              ? "activeButton"
              : "inactiveButton"
          }
        >
          {next}
        </button>
        <button
          onClick={() => paginate(pageNumber.length)}
          className={
            isNextButtonDisable &&
            currentPage < pageNumber[pageNumber.length - 1]
              ? "activeButton"
              : "inactiveButton"
          }
        >
          {moveLast}
        </button>
      </div>
    </div>
  );
}

export default App;
