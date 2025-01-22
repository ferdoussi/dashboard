import React, { useState, useEffect } from 'react';
import { BiShowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { PiCalendarBold } from 'react-icons/pi';
import axios from 'axios';
import { GoArrowDown } from 'react-icons/go';
import './style.css';
import Profile from '../../assets/images/user/logo1.png';
const BasicButton = () => {
  const [prestations, setPrestations] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPrestation, setCurrentPrestation] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  // État pour gérer la visibilité du paragraphe

  const [visibleRows, setVisibleRows] = useState({});
  // Fonction pour basculer la visibilité
  const toggleVisibility = (id) => {
    setVisibleRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Update the value when the user selects a technical:
  const handleTechnicianChange = (e) => {
    setSelectedTechnician(e.target.value);
  };
  //geting prestation data
  useEffect(() => {
    const fetchPrestations = async () => {
      try {
        console.log('Fetching data from API...');
        const response = await axios.get(`http://localhost:8000/api/send-prestations`);
        console.log('Response received:', response);

        if (response.status === 200) {
          const data = response.data;
          console.log('Fetched Data:', data); // Check the data in the console

          if (Array.isArray(data.data)) {
            // Access the "data" array
            setPrestations(data.data);
          } else {
            console.error('Data is not an array:', data);
          }
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (error) {
        console.error('Error fetching prestations:', error);
      }
    };

    fetchPrestations();
  }, []);

  //technicien api
  useEffect(() => {
    // Fetch technicians from API using axios
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/techniciens');
        console.log('list tech', response.data);
        setTechnicians(response.data);
      } catch (err) {
        console.error('Error fetching technicians:', err);
      }
    };

    fetchTechnicians();
  }, []);

  // Filter technicians dynamically based on selected date and specialty
  useEffect(() => {
    if (selectedDate && selectedSpecialty) {
      const filtered = technicians.filter((technician) => technician.disponible === 1 && technician.specialite === selectedSpecialty);
      setFilteredTechnicians(filtered);
    } else {
      setFilteredTechnicians([]);
    }
  }, [selectedDate, selectedSpecialty, technicians]);

  const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);

    // Date part
    const day = date.getDate();
    const month = date.getMonth() + 1; // months are zero-indexed
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

    // Time part
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

    return `${formattedDate} ${formattedTime}`;
  };
  // Function to format only the date without time
  const formatTime = (dateString) => {
    const date = new Date(dateString);

    // Manually adjust the time if needed (e.g., by subtracting 2 hours)
    date.setHours(date.getHours() + 2); // Adjust for timezone difference

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Return the formatted time
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  // Handle showing detailed information for a prestation
  const handleViewDetails = (prestation) => {
    setCurrentPrestation(prestation);
    setShowDetails(true);
  };

  const handleSendData = (prestation) => {
    // Assume that selectedDate contains the value selected by the user
    const dataToSend = {
      vistID: prestation.vistID,
      title: prestation.title,
      prix: prestation.prix,
      adress: prestation.adress,
      telephone: prestation.telephone,
      surface: prestation.surface,
      description: prestation.description,
      userName: prestation.userName,
      user_id: selectedTechnician, // Set the selected technician ID here.
      date_prestation: selectedDate
    };

    console.log('Sending data:', dataToSend);

    axios
      .post('http://localhost:8000/api/prestations_techniciens', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log('Data sent successfully:', response.data);
        alert('Data sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending data:', error);
        alert('An error occurred while sending data.');
      });
  };

  const handleClick = () => {
    const width = window.innerWidth * 0.6; // 59% of screen width
    const height = window.innerHeight * 0.45; // 45% of screen height

    // Get the specific button's position
    const button = document.querySelector('button');
    if (button) {
      const buttonRect = button.getBoundingClientRect();
      const left = buttonRect.left + 150; // Adjust as needed
      const top = buttonRect.bottom + 200; // Adjust as needed

      const url = 'https://calendar.google.com/calendar/u/0?cid=technician';

      // Open the new window with fixed size and position
      window.open(
        url,
        'CalendarWindow',
        `  width=${width},height=${height},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,left=${left},top=${top}`
      );
    }
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Demande Prestation :</h3>
      <div style={{ overflowX: 'auto', marginTop: '20px' }} className="table-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }} className="styled-table">
          <thead>
            <tr style={{ backgroundColor: '#203165', color: '#fff' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Devis N°</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Creation Date</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date Client</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Technician Specialite</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Technician</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {prestations.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{ fontSize: '20px' }}>{item.vistID}</span>

                  <button
                    onClick={() => handleViewDetails(item)}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: '#203165',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '2px 5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s, color 0.3s' // Smooth transition for hover effects
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1a254d'; // Darker shade on hover
                      e.target.style.color = '#e0e0e0'; // Lighter text color on hover
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#203165'; // Original background color
                      e.target.style.color = '#fff'; // Original text color
                    }}
                  >
                    <BiShowAlt />
                  </button>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(item.created_at).toLocaleDateString('en-GB')}</td>

                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <select
                    style={{
                      width: '200px',
                      padding: '5px',
                      color: '#fff',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#203165',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      position: 'relative',
                      transition: 'background-color 0.3s, color 0.3s',
                      backgroundImage:
                        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQuMjkgNkw4IDExLjI5TDEuNzEgNiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==)',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      backgroundSize: '10px 10px'
                    }}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate}
                  >
                    <option value="">Select Date & Time</option>
                    <option value={item.date1}>
                      {formatDateAndTime(item.date1)} | {formatTime(item.date1)}
                    </option>
                    <option value={item.date2}>
                      {formatDateAndTime(item.date2)} | {formatTime(item.date1)}
                    </option>
                    <option value={item.date2}>
                      {formatDateAndTime(item.date3)} | {formatTime(item.date1)}
                    </option>
                    <option value={item.date2}>
                      {formatDateAndTime(item.date4)} | {formatTime(item.date1)}
                    </option>
                  </select>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <select
                    style={{
                      width: '200px',
                      padding: '5px',
                      color: '#fff',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#203165',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      position: 'relative',
                      transition: 'background-color 0.3s, color 0.3s',
                      backgroundImage:
                        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQuMjkgNkw4IDExLjI5TDEuNzEgNiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==)',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      backgroundSize: '10px 10px'
                    }}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    <option value="">Select Specialite</option>
                    {technicians.map((technician) => (
                      <option key={technician.id} value={technician.specialite}>
                        {technician.specialite}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <select
                    style={{
                      width: '150px',
                      padding: '5px',
                      color: '#fff',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#203165',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      position: 'relative',
                      transition: 'background-color 0.3s, color 0.3s',
                      backgroundImage: 'url(data:image/svg+xml;base64,...)',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      backgroundSize: '10px 10px'
                    }}
                    onChange={handleTechnicianChange}
                    disabled={!selectedDate || !selectedSpecialty} // تعطيل إذا لم يتم اختيار التاريخ أو التخصص
                  >
                    <option value="">Select Technician</option>
                    {filteredTechnicians.map((technician) => (
                      <option key={technician.id} value={technician.id}>
                        {technician.nom} {technician.prenom}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleClick}
                    style={{
                      position: 'relative',
                      left: '10px',
                      backgroundColor: '#203165',
                      width: '50px',
                      color: '#fff',
                      padding: '5px',
                      borderRadius: '5px',
                      border: 'none',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'background-color 0.3s, color 0.3s',
                      cursor: 'pointer' // Added for better UX
                    }}
                  >
                    <PiCalendarBold style={{ width: '20px', height: '20px' }} />
                  </button>
                  <button
                    onClick={() => handleSendData(item)}
                    style={{
                      position: 'relative',
                      left: '10px',
                      backgroundColor: '#203165',
                      width: '50px',
                      color: '#fff',
                      padding: '5px',
                      borderRadius: '5px',
                      border: 'none',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'background-color 0.3s, color 0.3s', // Smooth transition for hover effects
                      marginLeft: '10px'
                    }}
                    disabled={!selectedDate || !selectedTechnician} // Disable button if no date or technology is specified
                  >
                    Send
                  </button>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <Link
                    onClick={() => toggleVisibility(item.id)}
                    className="show"
                    style={{
                      transform: visibleRows[item.id] ? 'rotate(180deg)' : 'none'
                    }}
                  >
                    <GoArrowDown size={24} color="white" />
                  </Link>
                  {/* Paragraphe caché/visible */}
                  {visibleRows[item.id] && (
                    <div className="modalColor">
                      <div className="modalColor2">
                        <div className="close">
                          <IoClose onClick={() => toggleVisibility(item.id)} />
                        </div>
                        <strong className="status">
                          Status :{' '}
                          <span
                            style={{
                              color: item.status === 'en cours' ? 'orange' : item.status === 'planifier' ? 'blue' : 'black'
                            }}
                          >
                            {item.status || 'No Status'}
                          </span>
                        </strong>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDetails && currentPrestation && (
        <div className="modalColor">
          <div className="modalColor2">
            <div className="close">
              <IoClose onClick={() => setShowDetails(false)} />
            </div>
            <div className="container">
              <div className="header">
                <img src={Profile} alt="Imagee" />
                <h1>Demande Prestation {currentPrestation.vistID}</h1>
              </div>

              <div className="info">
                <p>
                  <strong>INOVTEAM</strong>
                </p>
                <p>10 Bd de la Liberté, Casablanca 20120</p>
                <p>+212 652963481</p>
                <p>Email@gmail.com</p>
              </div>

              <table className="table">
                <tr>
                  <th className="th">Title</th>
                  <th className="th">Price</th>
                  <th className="th">Address</th>
                  <th className="th">Phone</th>
                  <th className="th">Surface</th>
                  <th className="th">Client Name</th>
                </tr>
                <tr>
                  <td>{currentPrestation.title}</td>
                  <td>{currentPrestation.prix}DH</td>
                  <td>{currentPrestation.adress}</td>
                  <td>{currentPrestation.telephone}</td>
                  <td>{currentPrestation.surface}</td>
                  <td>{currentPrestation.user.name}</td>
                </tr>
              </table>

              <div className="total">
                Total HT: <span className="prix">1400.00 DH</span>
              </div>
              <h4>Description :</h4>
              <div className="description-container">{currentPrestation.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicButton;
