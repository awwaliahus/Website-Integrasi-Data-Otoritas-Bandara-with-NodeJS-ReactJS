import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Footer from '../components/Footer';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import RegisterBody from '../components/RegisterBody';

function Register() {
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
    <>
      {unit === "Admin" && (
        <div className="hold-transition sidebar-mini layout-fixed">
          <div className="wrapper">
            {auth ? (
              <>
                <Sidebar nama={nama} nip={nip} unit={unit} />
                <Header />
                <RegisterBody />
                <Footer />
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Register;