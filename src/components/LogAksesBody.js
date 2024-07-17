import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const LogAksesBody = () => {
  const [logData, setLogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null); // Define selectedMonth state
  const [month] = useState([
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]);

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/activitylog"
        );
        setLogData(response.data);
      } catch (error) {
        console.error("Error fetching log akses:", error);
      }
    };

    fetchLogData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Logika filter berdasarkan status akses yang dipilih
  const filteredRows = logData.filter((entry) => {
    const entryDate = new Date(entry.tanggal_waktu);
    return (
      (filterStatus === "All" ||
        entry.access_message.toLowerCase() === filterStatus.toLowerCase()) &&
      (selectedMonth === null ||
        (entryDate.getFullYear() === new Date().getFullYear() && // Filter berdasarkan tahun yang sama
          entryDate.getMonth() === selectedMonth - 1)) && // Filter berdasarkan bulan yang dipilih
      (entry.pas_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.pendaftaran_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });


  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setSelectedFilter(status);
  };

  const handleChange = (selectedMonth) => {
    setSelectedMonth(selectedMonth);
    setCurrentPage(1); // Set currentPage kembali ke 1 saat mengubah bulan
  };


  const exportToPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const headers = [
      [
        "Petugas",
        "NIP",
        "Nama Lengkap",
        "ID Pendaftaran",
        "Pas Number",
        "Kode Area",
        "Pas Status",
        "Akses Kode Area",
        "Akses",
        "Tanggal & Waktu",
      ],
    ];
    const numColumns = 10;
    const pageWidth = 515;
    const cellWidth = pageWidth / numColumns;

    // Tambahkan judul
    let title = "Log Akses Terminal"; // Default title
    if (selectedFilter === "Diterima") {
      title = "Log Akses Terminal (Diterima)";
    } else if (selectedFilter === "Ditolak") {
      title = "Log Akses Terminal (Ditolak)";
    } else {
      title = "Log Akses Terminal";
    }
    const titleFontSize = 14;
    const titlePositionX = 600 / 2; // Horizontal center of the page
    const titlePositionY = 70; // Vertical position of the title
    // Set font menjadi Cambria
    doc.setFont("Cambria");
    doc.setFontSize(titleFontSize);
    doc.text(title, titlePositionX, titlePositionY, { align: "center" });

    // Tambahkan logo
    const logoUrl = "ap_logo.png";
    const logoWidth = 115;
    const logoHeight = 33;
    const logoPositionX = doc.internal.pageSize.getWidth() - logoWidth - 37; // Geser logo ke kiri
    const logoPositionY = 25;
    doc.addImage(
      logoUrl,
      "PNG",
      logoPositionX,
      logoPositionY,
      logoWidth,
      logoHeight
    );

    // Tentukan posisi tabel
    const tableStartY = logoPositionY + logoHeight + 30; // Jarak vertikal antara logo dan tabel

    doc.autoTable({
      startY: tableStartY, // Start the table from the specified Y position
      head: headers,
      body: filteredRows.map((entry) => [
        entry.admin_name,
        entry.admin_nip,
        entry.nama_lengkap,
        entry.pendaftaran_id,
        entry.pas_number,
        entry.kode_area,
        entry.pas_status,
        entry.kode_area_access,
        entry.access_message,
        entry.tanggal_waktu,
      ]),
      didParseCell: (data) => {
        data.cell.styles.fontSize = 8; // Set font size for all cells
        data.cell.styles.cellPadding = 1.5; // Set padding for all cells
      },
      columnStyles: {
        0: { cellWidth: cellWidth },
        1: { cellWidth: cellWidth },
        2: { cellWidth: cellWidth },
        3: { cellWidth: cellWidth },
        4: { cellWidth: cellWidth },
        5: { cellWidth: cellWidth },
        6: { cellWidth: cellWidth },
        7: { cellWidth: cellWidth },
        8: { cellWidth: cellWidth },
        9: { cellWidth: cellWidth },
      },
    });

    doc.save("log_data.pdf");
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Log Akses</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Log Akses</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-md-12 mb-2">
              <button
                className="btn btn-primary mr-3 mb-3"
                onClick={exportToPdf}
              >
                Export to PDF
              </button>
              <button
                className="mr-3 mb-3 btn btn-info dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {selectedFilter || "Filter Akses"}
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
                  onClick={() => handleFilter("Diterima")}
                  href="#"
                >
                  Diterima
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => handleFilter("Ditolak")}
                  href="#"
                >
                  Ditolak
                </a>
              </div>
              {/* Tambahkan button "Pilih Bulan" */}
              <div className="dropdown d-inline-block mt-2">
                <button
                  className="btn btn-info dropdown-toggle mb-3"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {selectedMonth !== null ? month[selectedMonth - 1] : "Pilih Bulan"}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {month.map((monthName, index) => (
                    <a
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleChange(index + 1)}
                      href="#"
                    >
                      {monthName}
                    </a>
                  ))}
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Pendaftaran ID, Pas Number, or Full Name"
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
                    <th>Admin Name</th>
                    <th>Admin NIP</th>
                    <th>Nama Lengkap</th>
                    <th>ID Pendaftaran</th>
                    <th>Pas Number</th>
                    <th>Kode Area Pas</th>
                    <th>Pas Status</th>
                    <th>Akses Kode Area</th>
                    <th>Akses</th>
                    <th>Tanggal dan Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.admin_name}</td>
                      <td>{entry.admin_nip}</td>
                      <td>{entry.nama_lengkap}</td>
                      <td>{entry.pendaftaran_id}</td>
                      <td>{entry.pas_number}</td>
                      <td>{entry.kode_area}</td>
                      <td>{entry.pas_status}</td>
                      <td>{entry.kode_area_access}</td>
                      <td>{entry.access_message}</td>
                      <td>{entry.tanggal_waktu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
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
                        className={`page-item ${currentPage === index + 1 ? "active" : ""
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
    </div>
  );
};

export default LogAksesBody;
