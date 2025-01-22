import React from 'react';
import { NavLink } from 'react-router-dom';

// react-bootstrap
import { Card } from 'react-bootstrap';

// // third party
// import { CopyToClipboard } from 'react-copy-to-clipboard';

// project import
//import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import AuthLogin from './JWTLogin';

// assets
import logoDark from '../../../assets/images/user/logo1.png';

// ==============================|| SIGN IN 1 ||============================== //

const Signin1 = () => {
  return (
    <React.Fragment>
      {/* <Breadcrumb /> */}
      <div className="auth-wrapper ">
        <div className="auth-content">
          <Card className="borderless text-center">
            <Card.Body>
              <img src={logoDark} alt="" className="img-fluid mb-4" style={{ width: '150px', height: '100px' }} />
              <AuthLogin />
              <p className="mb-2 text-muted">
                Forgot password?{' '}
                <NavLink to="/auth/reset-password-1" className="f-w-400" style={{ color: '#203165' }}>
                  Reset
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Don’t have an account?{' '}
                <NavLink to="/auth/signup-1" className="f-w-400" style={{ color: '#203165' }}>
                  Signup
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
