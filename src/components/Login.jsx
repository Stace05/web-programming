import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from './ErrorMessage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyForm.css'; 

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email is incorrect')
    .required('Email is a required field'),
  password: Yup.string()
    .required('Password is a required field'),
});

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/login', {
        email: values.email,
        password: values.password,
      });
      if (response.data.success) {
        toast.success('Login successful!');
        resetForm();
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('userEmail', response.data.email); 
        navigate('/'); 
      } else {
        toast.error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-form-container">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="my-form">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" />
              {touched.email && errors.email && (
                <ErrorMessage message={errors.email} />
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" />
              {touched.password && errors.password && (
                <ErrorMessage message={errors.password} />
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
