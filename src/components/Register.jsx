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
    .min(6, 'Password must be at least 6 characters')
    .required('Password is a required field'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/register', {
        email: values.email,
        password: values.password,
      });
      if (response.data.success) {
        toast.success('Registration successful! Please log in.');
        resetForm();
        navigate('/login');
      } else {
        toast.error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-form-container">
      <h2>Register</h2>
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

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field name="confirmPassword" type="password" />
              {touched.confirmPassword && errors.confirmPassword && (
                <ErrorMessage message={errors.confirmPassword} />
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
