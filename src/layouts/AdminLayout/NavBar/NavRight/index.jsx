import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListGroup, Dropdown } from 'react-bootstrap';
import axios from 'axios';

// الأصول
import avatar1 from '../../../../assets/images/user/profile_icon.png';

const NavRight = () => {
  const [userData, setUserData] = useState({ name: '' });
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate(); // useNavigate hook
  // جلب بيانات المستخدم
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setUserData({ name: response.data.name });
    } catch (error) {
      setApiError('Failed to fetch user data.');
    }
  };
  const logout = () => {
    // Redirect to the login page
    navigate('/auth/signin-1', { replace: true });
  };

  useEffect(() => {
    fetchUserData();
  }, []); // استدعاء البيانات عند تحميل المكون
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const iconStyle = {
    backgroundColor: isHovered ? '#203165' : 'inherit', // Change icon color to red on hover
    color: isHovered ? 'white' : 'inherit'
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <img src={avatar1} className="img-radius wid-30" alt="User Profile" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head " style={{ backgroundColor: '#203165' }}>
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>{userData.name || 'User Name'}</span>
                <button onClick={logout} className="dud-logout" title="Logout" style={{ backgroundColor: '#203165', border: 'none' }}>
                  <i className="feather icon-log-out" />
                </button>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body" style={{ backgroundColor: 'white', fontSize: '20px' }}>
                <ListGroup.Item bsPrefix=" ">
                  <button
                    onClick={logout}
                    className="dropdown-item  text-start "
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={iconStyle}
                  >
                    <i className="feather icon-log-out hover-icon" style={iconStyle} /> Logout
                  </button>
                </ListGroup.Item>
              </ListGroup>
              {apiError && <p className="text-danger text-center mt-2">{apiError}</p>}
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavRight;
