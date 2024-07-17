import React, { useState, useEffect } from "react";
import axios from "axios";

const PersonalDataBody = () => {
  const [personalData, setPersonalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    nama: "",
    nip: "",
    password: "",
  });

  const fetchPersonalData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/user");
      setPersonalData(response.data);
    } catch (error) {
      console.error("Error fetching personal data:", error);
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredRows = personalData.filter((entry) => {
    return (
      (selectedFilter === "All" || entry.unit === selectedFilter) &&
      (entry.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.unit.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Set currentPage kembali ke 1 saat filter berubah
  };

  const handleUpdate = (nip) => {
    setShowModal(true);
    setModalTitle("Update");
    const userToUpdate = currentRows.find((entry) => entry.nip === nip);
    setSelectedUser(userToUpdate);
    setUpdateFormData({
      ...updateFormData,
      nama: userToUpdate.nama,
      nip: userToUpdate.nip,
    });
  };

  const handleDelete = (nip) => {
    setShowModal(true);
    setModalTitle("Delete");
    const userToDelete = currentRows.find((entry) => entry.nip === nip);
    setSelectedUser(userToDelete);
  };

  const deleteUser = (nipToDelete) => {
    axios
      .delete(process.env.REACT_APP_API_URL + `/user/${nipToDelete}`)
      .then((response) => {
        alert(response.data.message);
        setShowModal(false);
        fetchPersonalData();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      });
  };

  const updateUser = (nipToUpdate, event) => {
    event.preventDefault();

    axios
      .put(
        process.env.REACT_APP_API_URL + `/user/${nipToUpdate}`,
        updateFormData
      )
      .then((response) => {
        alert(response.data.message);
        setShowModal(false);
        fetchPersonalData();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user");
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Data Personal</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Data Personal</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-md-12 mb-2">
              <div className="dropdown d-inline-block">
                <button
                  className="btn btn-info dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {selectedFilter ? selectedFilter : "Filter Unit"}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <a
                    className="dropdown-item"
                    onClick={() => handleFilter("All")}
                    href="#"
                  >
                    All
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleFilter("Admin")}
                    href="#"
                  >
                    Admin
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleFilter("Avsec")}
                    href="#"
                  >
                    Avsec
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-12 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name or NIP"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <table
                className="table"
                style={{ backgroundColor: "white" }}
                bordered
              >
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>NIP</th>
                    <th>Unit</th>
                    <th>Last Login</th>
                    <th>Last Logout</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.nama}</td>
                      <td>{entry.nip}</td>
                      <td>{entry.unit}</td>
                      <td>{entry.last_login}</td>
                      <td>{entry.last_logout}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mr-2 mb-2"
                          onClick={() => handleUpdate(entry.nip)}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm mb-2"
                          onClick={() => handleDelete(entry.nip)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from(
                    {
                      length: Math.min(
                        Math.ceil(filteredRows.length / rowsPerPage),
                        2
                      ),
                    },
                    (_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  )}
                  {currentPage <
                    Math.ceil(filteredRows.length / rowsPerPage) && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  )}
                  {currentPage <
                    Math.ceil(filteredRows.length / rowsPerPage) && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() =>
                          paginate(Math.ceil(filteredRows.length / rowsPerPage))
                        }
                      >
                        Last
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-l modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button
                type="button"
                className="close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {modalTitle === "Update" && (
                <form>
                  <div className="form-group">
                    <label>Nama</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Lengkap"
                      value={updateFormData.nama}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          nama: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>NIP</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="NIP"
                      value={updateFormData.nip}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          nip: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.unit}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={updateFormData.password}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => updateUser(selectedUser.nip, e)}
                  >
                    Submit
                  </button>
                </form>
              )}
              {modalTitle === "Delete" && (
                <div>
                  <div className="alert alert-danger" role="alert">
                    Apakah Anda yakin ingin menghapus pengguna dengan NIP{" "}
                    {selectedUser.nip} ?
                  </div>
                  <div className="ml-1">
                    <p>Nama: {selectedUser.nama}</p>
                    <p>NIP: {selectedUser.nip}</p>
                    <p>Unit: {selectedUser.unit}</p>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(selectedUser.nip)}
                  >
                    Delete User
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDataBody;
