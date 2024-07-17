import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Chart from "chart.js/auto";

Chart.defaults.font.family = "Poppins, sans-serif";

const month = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function DashboardBody() {
  const theme = useTheme();
  const [jumlahPas, setJumlahPas] = useState(null);
  const [jumlahAkses, setJumlahAkses] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  const fetchJumlahPas = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/pas/jumlah-pas"
      );
      setJumlahPas(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchJumlahAkses = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/activitylog/jumlah-akses"
      );
      setJumlahAkses(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchJumlahAksesBulan = async (month) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/activitylog/jumlah-akses-bulan?bulan=${month}`
      );
      setJumlahAkses(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (month) => {
    setSelectedMonth(month);
    fetchJumlahAksesBulan(month);
  };

  useEffect(() => {
    fetchJumlahPas();
    fetchJumlahAkses();
  }, []);

  const barJumlahPas = {
    labels: ["Jumlah Pas"],
    datasets: [
      {
        label: "Aktif",
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        hoverBackgroundColor: theme.palette.primary.light,
        hoverBorderColor: theme.palette.primary.dark,
        data: [jumlahPas ? jumlahPas.aktif : 0],
      },
      {
        label: "Stop",
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        borderWidth: 1,
        hoverBackgroundColor: theme.palette.secondary.light,
        hoverBorderColor: theme.palette.secondary.dark,
        data: [jumlahPas ? jumlahPas.stop : 0],
      },
      {
        label: "Resign",
        backgroundColor: theme.palette.warning.main,
        borderColor: theme.palette.warning.main,
        borderWidth: 1,
        hoverBackgroundColor: theme.palette.warning.light,
        hoverBorderColor: theme.palette.warning.dark,
        data: [jumlahPas ? jumlahPas.resign : 0],
      },
    ],
  };

  const barJumlahAkses = {
    labels: ["Jumlah Akses"],
    datasets: [
      {
        label: "Diterima",
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        hoverBackgroundColor: theme.palette.primary.light,
        hoverBorderColor: theme.palette.primary.dark,
        data: [jumlahAkses ? jumlahAkses.diterima : 0],
      },
      {
        label: "Ditolak",
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        borderWidth: 1,
        hoverBackgroundColor: theme.palette.secondary.light,
        hoverBorderColor: theme.palette.secondary.dark,
        data: [jumlahAkses ? jumlahAkses.ditolak : 0],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 10,
        },
      },
    },
    layout: {
      padding: {
        left: 30,
        right: 30,
        top: 5,
        bottom: 5,
      },
    },
  };

  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1
                  className="m-0"
                  style={{ fontFamily: theme.typography.fontFamily }}
                >
                  Dashboard
                </h1>
              </div>
              <div className="col-sm-6">
                <ol
                  className="breadcrumb float-sm-right"
                  style={{ fontFamily: theme.typography.fontFamily }}
                >
                  <li className="breadcrumb-item">
                    <Link
                      to="/dashboard"
                      style={{ fontFamily: theme.typography.fontFamily }}
                    >
                      Home
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item active"
                    style={{ fontFamily: theme.typography.fontFamily }}
                  >
                    Dashboard
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-6">
                <div className="card">
                  <div className="card-header">
                    <h3
                      className="card-title"
                      style={{ fontFamily: theme.typography.fontFamily }}
                    >
                      Jumlah Pas Bandara Aktif dan Tidak Aktif
                    </h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "250px" }}>
                      <Bar data={barJumlahPas} options={options} />
                    </div>
                    <div>
                      {jumlahPas && (
                        <ul>
                          <li>Aktif: {jumlahPas.aktif}</li>
                          <li>Stop: {jumlahPas.stop}</li>
                          <li>Resign: {jumlahPas.resign}</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card">
                  <div className="card-header">
                    <h3
                      className="card-title"
                      style={{ fontFamily: theme.typography.fontFamily }}
                    >
                      Jumlah Akses Masuk Bandara
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="dropdown">
                      <button
                        className="btn btn-info dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {month[selectedMonth - 1] || "Pilih Bulan"}
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("1")}
                          href="#"
                        >
                          Januari
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("2")}
                          href="#"
                        >
                          Februari
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("3")}
                          href="#"
                        >
                          Maret
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("4")}
                          href="#"
                        >
                          April
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("5")}
                          href="#"
                        >
                          Mei
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("6")}
                          href="#"
                        >
                          Juni
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("7")}
                          href="#"
                        >
                          Juli
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("8")}
                          href="#"
                        >
                          Agustus
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("9")}
                          href="#"
                        >
                          September
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("10")}
                          href="#"
                        >
                          Oktober
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("11")}
                          href="#"
                        >
                          November
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => handleChange("12")}
                          href="#"
                        >
                          Desember
                        </a>
                      </div>
                    </div>
                    <div style={{ height: "250px" }}>
                      <Bar data={barJumlahAkses} options={options} />
                    </div>
                    <div>
                      {jumlahAkses && (
                        <ul>
                          <li>Diterima: {jumlahAkses.diterima}</li>
                          <li>Ditolak: {jumlahAkses.ditolak}</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardBody;
