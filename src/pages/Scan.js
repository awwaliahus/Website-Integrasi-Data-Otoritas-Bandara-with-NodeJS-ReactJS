import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Footer from '../components/Footer';
import Header from '../components/Header';
import ScanBody from '../components/ScanBody';
import Sidebar from '../components/Sidebar';

function Scan() {
  const [auth, setAuth] = useState(false)
  const [message, setMessage] = useState('')
  const [nama, setNama] = useState('')
  const [nip, setNip] = useState('')
  const [unit, setUnit] = useState('')

  axios.defaults.withCredentials = true
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL)
    .then(res => {
      if (res.data.Status === "Success") {
        setAuth(true)
        setNama(res.data.nama)
        setNip(res.data.nip)
        setUnit(res.data.unit)
      } else {
        setAuth(false)
        setMessage(res.data.Error)
      }
    })
  }, [])
  
  return (
    <body class="hold-transition sidebar-mini layout-fixed">
      <div className="wrapper">
        {
          auth ?
          <><Sidebar nama={nama} nip={nip} unit={unit} /><Header /><ScanBody nama={nama} nip={nip} /><Footer /></>
          :
          <div>
          </div>
        }
      </div>
    </body>
  );
}

export default Scan;