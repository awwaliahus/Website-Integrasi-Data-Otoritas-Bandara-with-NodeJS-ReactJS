import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

function DataPasBody() {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filterPas, setFilterPas] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');

  const fetchDbStatus = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/databaseLogs"
      );
      setDbStatus(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/pas"
      );
      setData(response.data);
      setFilterPas(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchDbStatus();
    fetchData();
  }, [loading]);

  const handleUpdateDatabase = async () => {
    try {
      setLoading(true);

      // Mengirim permintaan ke API
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/databaseUpdate"
      );

      // Menangani respons dari API jika perlu
      console.log("Respons dari API:", response.data);

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const exportToPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const headers = [
      [
        "Pendaftaran ID",
        "Kode Kartu",
        "Pas Terbit",
        "Pas Aktif",
        "Pas Status",
        "Pas Number",
        "Pas Expired Value",
        "Pas Expired Date",
        "Kode Area",
        "Instansi Name",
        "Nama Lengkap",
        "Pas Photo",
      ],
    ];
    const numColumns = 12;
    const pageWidth = 515;
    const cellWidth = pageWidth / numColumns;

    // Tambahkan judul
    let title = "All Pas List"; // Default title
    if (selectedFilter === "Aktif") {
      title = "Pas Aktif List";
    } else if (selectedFilter === "Non Aktif") {
      title = "Pas Stop List";
    } else {
      title = "All Pas List"
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

    // Fungsi untuk menambahkan gambar ke sel
    const addImageToCell = (dataURI, cell) => {
      const imgWidth = 25;
      const imgHeight = 25;
      doc.addImage(dataURI, "JPEG", cell.x, cell.y, imgWidth, imgHeight);
    };

    doc.autoTable({
      startY: tableStartY, // Start the table from the specified Y position
      head: headers,
      body: data.map((item) => {
        // Convert "pas_photo" value to an image if available
        return Object.entries(item).map(([key, value]) => {
          if (key === "pas_photo") {
            return { content: "", image: value };
          } else {
            return value;
          }
        });
      }),
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
        10: { cellWidth: cellWidth },
        11: { cellWidth: cellWidth },
      },
      didDrawCell: (data) => {
        // If the cell contains an image, add the image to the cell
        if (
          data.row.index >= 0 &&
          data.column.index === 11 &&
          data.cell.raw.image
        ) {
          addImageToCell(data.cell.raw.image, data.cell);
        }
      },
    });

    doc.save("data_pas.pdf");
  };

  const handleFilterPas = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    let filteredPas = filterPas;

    filteredPas = filterPas.filter((row) => {
      return Object.entries(row).some(
        ([key, value]) =>
          key !== "pas_photo" &&
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm)
      );
    });

    // Ubah objek kembali menjadi array untuk ditampilkan di tabel
    const newData = Object.values(filteredPas);
    setData(newData);
  };

  const handleFilterPasAll = () => {
    setData(filterPas);
    setSelectedFilter('All');
  };

  const handleFilterPasAktif = () => {
    let filteredPas = filterPas;

    filteredPas = filterPas.filter((row) => {
      return row.pas_aktif.toLowerCase() === "aktif";
    });

    // Ubah objek kembali menjadi array untuk ditampilkan di tabel
    const newData = Object.values(filteredPas);

    setData(newData);
    setSelectedFilter('Aktif');
  };

  const handleFilterPasNonaktif = () => {
    let filteredPas = filterPas;

    filteredPas = filterPas.filter((row) => {
      return (
        row.pas_aktif.toLowerCase() === "stop" ||
        row.pas_aktif.toLowerCase() === "resign"
      );
    });

    // Ubah objek kembali menjadi array untuk ditampilkan di tabel
    const newData = Object.values(filteredPas);

    setData(newData);
    setSelectedFilter('Non Aktif');
  }

  const handleFilterPasBlacklist = () => {
    let filteredPas = filterPas;

    filteredPas = filterPas.filter((row) => {
      return (
        row.pas_aktif.toLowerCase() === "blacklist"
      );
    });

    // Ubah objek kembali menjadi array untuk ditampilkan di tabel
    const newData = Object.values(filteredPas);

    setData(newData);
    setSelectedFilter('Blacklist');
  }

  const columns = [
    {
      name: "ID",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.pendaftaran_id}
        </div>
      ),
    },
    {
      name: "Kode Kartu",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.kode_kartu}
        </div>
      ),
    },
    {
      name: "Pas Terbit",
      selector: (row) => row.pas_terbit,
      sortable: true,
    },
    {
      name: "Pas Aktif",
      selector: (row) => row.pas_aktif,
      sortable: true,
    },
    {
      name: "Pas Status",
      selector: (row) => row.pas_status,
      sortable: true,
    },
    {
      name: "Pas Number",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.pas_number}
        </div>
      ),
    },
    {
      name: "Pas Expired",
      selector: (row) => row.pas_expired_value,
      sortable: true,
    },
    {
      name: "Pas Expired Date",
      selector: (row) => row.pas_expired_date,
      sortable: true,
    },
    {
      name: "Kode Area",
      selector: (row) => row.kode_area,
      sortable: true,
    },
    {
      name: "Nama Instansi",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.instansi_name}
        </div>
      ),
    },
    {
      name: "Nama Lengkap",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.nama_lengkap}
        </div>
      ),
    },
    {
      name: "Pas Foto",
      selector: (row) => (
        <img
          width={50}
          height={50}
          src={`data:image/jpeg;base64,${row.pas_photo}`}
          alt=""
        />
      ),
    },
  ];

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Data Pas Bandara</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">Data Pas Bandara</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div
                  className="card-body overflow-auto"
                  style={{ maxHeight: "100vh" }}
                >
                  <div className="d-flex flex-row">
                    <div className="m-2">
                      <button
                        className="btn btn-primary mr-auto"
                        onClick={exportToPdf}
                      >
                        Export to PDF
                      </button>
                    </div>
                    <div className="m-2">
                      <button
                        className="btn btn-primary"
                        onClick={handleUpdateDatabase}
                        disabled={loading}
                      >
                        {loading ? "Memproses..." : "Update Database"}
                      </button>
                    </div>
                    <div className="mt-3 ml-1">
                      <ul className="list-inline">
                        <li className="list-inline-item">Last Updated :</li>
                        {dbStatus ? (
                          <li className="list-inline-item">
                            {dbStatus[0].event_time}
                          </li>
                        ) : (
                          <li className="list-inline-item text-muted">
                            {" "}
                            Loading...
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="dropdown m-2">
                      <button
                        className="btn btn-info dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {selectedFilter || "Filter Pas"}
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a
                          className="dropdown-item"
                          onClick={handleFilterPasAll}
                          href="#"
                        >
                          All
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={handleFilterPasAktif}
                          href="#"
                        >
                          Aktif
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={handleFilterPasNonaktif}
                          href="#"
                        >
                          Non Aktif
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={handleFilterPasBlacklist}
                          href="#"
                        >
                          Blacklist
                        </a>
                      </div>
                    </div>
                    <div className="ml-auto p-2">
                      <input
                        className="px-2 py-1"
                        type="text"
                        placeholder="Search..."
                        onChange={handleFilterPas}
                      />
                    </div>
                  </div>
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 20, 40]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DataPasBody;
