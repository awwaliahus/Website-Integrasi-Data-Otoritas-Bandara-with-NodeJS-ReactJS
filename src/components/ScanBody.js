import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const images = [
  "/arrival_logo.jpeg",
  "/boarding-lounge_logo.jpeg",
  "/check-in_logo.jpeg",
  "/kade_logo.jpeg",
  "/in-kade_logo.jpeg",
  "/main-power-house_logo.jpeg",
  "/meteorology-facility_logo.jpeg",
  "/navigation-telecommunication_logo.jpeg",
  "/fuel-supply_logo.jpeg",
  "/apron-area_logo.jpeg",
  "/radar-hall_logo.jpeg",
  "/tower_logo.jpeg",
  "/baggage-makeup-airside_logo.jpeg",
  "/vital-area_logo.jpeg",
  "/scanning.jpeg"
];

const imageCaptions = [
  "Arrival (A)",
  "Boarding Lounge (B)",
  "Check-In (C)",
  "Kade (F)",
  "In Kade (G)",
  "Main Power House (L)",
  "Meteorology Facility (M)",
  "Navigation and Telecommunication (N)",
  "Fuel Supply (O)",
  "Apron Area (P)",
  "Radar Hall (R)",
  "Tower (T)",
  "Baggage Make-Up Airside (U)",
  "Vital Area (V)",
  "All Area(All)"
];

const kodeArea = [
  "A",
  "B",
  "C",
  "F",
  "G",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "T",
  "U",
  "V",
  "All"
];

const ScanValidationPage = ({ nama, nip }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedKodeArea, setSelectedKodeArea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/pas"
        );

        // Sort data based on pas_expired_date in descending order
        response.data.sort((a, b) => new Date(b.pas_expired_date) - new Date(a.pas_expired_date));

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      // Jika searchTerm kosong, atur data modal menjadi kosong
      return; // Keluar dari useEffect karena tidak perlu melanjutkan proses pencarian
    }
  
    const filteredData = userData.filter((user) => {
      return (
        user.pendaftaran_id === searchTerm || user.pas_number === searchTerm
      );
    });
  
    if (filteredData.length > 0) {
      setFilteredUserData(filteredData); // Mengatur data modal hanya jika ada hasil pencarian
      setSearchError(false);
      const currentUser = filteredData[0];
      let message = "";
      if (currentUser.pas_aktif === "aktif" && currentUser.kode_area.includes(kodeArea[selectedKodeArea])) {
        message = "Diterima";
      } else if (currentUser.pas_aktif === "aktif" && selectedKodeArea === images.length - 1) {
        message = "Pas Aktif";
      } else if (currentUser.pas_aktif === "aktif" && !currentUser.kode_area.includes(kodeArea[selectedKodeArea])) {
        message = "Ditolak";
      } else {
        message = "Pas Nonaktif";
      }
      try {
        axios.post(process.env.REACT_APP_API_URL + "/activitylog", {
          pendaftaran_id: currentUser.pendaftaran_id,
          pas_status: currentUser.pas_status,
          pas_number: currentUser.pas_number,
          kode_area: currentUser.kode_area,
          nama_lengkap: currentUser.nama_lengkap,
          kode_area_access: kodeArea[selectedKodeArea],
          access_message: message,
          admin_name: nama,
          admin_nip: nip,
        });
      } catch (error) {
        console.error("Error saving data to activitylog:", error);
      }
    } else {
      setFilteredUserData([]); // Jika tidak ada hasil pencarian, atur data modal menjadi kosong
      setSearchError(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (deleting) {
      setTimeout(() => {
        setSearchTerm("");
        setDeleting(false);
      }, 1000);
    }
  }, [deleting]);

  const handleClick = (index) => {
    setSelectedImageIndex(index);
    setSelectedKodeArea(index);
    setShowModal(true);
    setSearchError(false);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setDeleting(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImageIndex(null);
    setSearchTerm("");
    setFilteredUserData([]);
  };

  useEffect(() => {
    if (showModal) {
      // Focus input after modal is shown
      inputRef.current.focus();
    }
  }, [showModal]);

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Scan Pas Bandara</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Scan Pas Bandara</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {images.map((image, index) => (
              <div
                key={index}
                className="col-xs-6 col-sm-4 col-md-3 col-lg-2 mb-3 d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src={image}
                  alt={imageCaptions[index]}
                  className="img-fluid"
                  onClick={() => handleClick(index)}
                  style={{ cursor: "pointer", width: "100px", height: "91px" }}
                />
                <figcaption className="mt-2 text-center">
                  {imageCaptions[index]}
                </figcaption>
              </div>
            ))}
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
          className="modal-dialog modal-lg modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {imageCaptions[selectedImageIndex]}
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by Pendaftaran ID or Pas Number"
                value={searchTerm}
                ref={inputRef}
                onChange={handleSearchInputChange}
              />
              {searchError && (
                <p className="text-danger">No matching records found.</p>
              )}
              <div className="user-list">
                {filteredUserData.map((user) => (
                  <div className="border p-3 mb-3">
                    <div className="mb-4" style={{ textAlign: "center" }}>
                      <img
                        src={`data:image/jpeg;base64,${user.pas_photo}`}
                        alt={user.nama_lengkap}
                      />
                    </div>
                    <div className="mb-4" style={{ textAlign: "center" }}>
                      {user.pas_aktif === "aktif" ? (
                        <div
                          style={{
                            backgroundColor: "green",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          Pas Aktif
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          Pas Non-Aktif
                        </div>
                      )}
                    </div>
                    {user.pas_aktif === 'aktif' && selectedKodeArea !== images.length - 1 && (
                      <div className="mb-4" style={{ textAlign: 'center' }}>
                        {user.kode_area.includes(kodeArea[selectedKodeArea]) ? (
                          <div style={{ backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Diterima</div>
                        ) : (
                          <div style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Ditolak</div>
                        )}
                      </div>
                    )}
                    <strong>Pendaftaran ID:</strong> {user.pendaftaran_id}
                    <br />
                    <strong>Kode Kartu:</strong> {user.kode_kartu}
                    <br />
                    <strong>Pas Terbit:</strong> {user.pas_terbit}
                    <br />
                    <strong>Pas Aktif:</strong> {user.pas_aktif}
                    <br />
                    <strong>Pas Status:</strong> {user.pas_status}
                    <br />
                    <strong>Pas Number:</strong> {user.pas_number}
                    <br />
                    <strong>Pas Expired Value:</strong> {user.pas_expired_value}
                    <br />
                    <strong>Pas Expired Date:</strong> {user.pas_expired_date}
                    <br />
                    <strong>Kode Area:</strong> {user.kode_area}
                    <br />
                    <strong>Instansi Name:</strong> {user.instansi_name}
                    <br />
                    <strong>Nama Lengkap:</strong> {user.nama_lengkap}
                    <br />
                  </div>
                ))}
              </div>
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

export default ScanValidationPage;
