import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // لتوجيه المستخدم
import { Alert, Button, Spinner } from 'react-bootstrap'; // Import Spinner for loading state
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

const API_LOGIN_ENDPOINT = 'http://localhost:8000/api/login';

const JWTLogin = () => {
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // للتوجيه
  const [credentials, setCredentials] = useState(null); // القيم المرسلة إلى API

  // دالة تسجيل الدخول
  const login = async ({ email, password }) => {
    setApiError('');
    setApiSuccess('');
    setLoading(true); // Set loading to true when starting the request

    try {
      const response = await axios.post(API_LOGIN_ENDPOINT, {
        email,
        password
      });

      const user = response.data.user; // بيانات المستخدم
      const token = response.data.token; // رمز الوصول

      // التحقق من دور المستخدم
      if (user.role !== 'superviseur') {
        setApiError('Access denied. Only Superviseurs can log in.');
        setLoading(false); // Set loading to false on error
        return;
      }

      setApiSuccess('Login successful!');
      console.log('User Info:', user);
      console.log('Token:', token);

      // حفظ رمز الوصول في localStorage
      localStorage.setItem('authToken', token);

      // توجيه المستخدم إلى لوحة القيادة
      navigate('/app/dashboard/analytics');
      setLoading(false); // Set loading to false when request completes
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed');
      setLoading(false); // Set loading to false on error
    }
  };

  // استخدام useEffect لمراقبة البيانات المرسلة إلى API
  useEffect(() => {
    if (credentials) {
      login(credentials);
    }
  }, [credentials]);

  return (
    <div>
      <h4 className="mb-3 f-w-400" style={{ color: '#203165', fontSize: '30px' }}>
        Sign in
      </h4>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          setCredentials(values); // إرسال القيم إلى useEffect
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                placeholder="Email address"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
              />
              {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                placeholder="Password"
              />
              {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
            </div>

            {apiError && <Alert variant="danger">{apiError}</Alert>}
            {apiSuccess && <Alert variant="success">{apiSuccess}</Alert>}

            <Button
              className="btn-block mb-4"
              type="submit"
              style={{ backgroundColor: '#203165' }}
              disabled={loading} // Disable button during loading
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Sign in'} {/* Show spinner while loading */}
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default JWTLogin;
