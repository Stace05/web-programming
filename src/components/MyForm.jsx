import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from './ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MyForm.css'; 


const validationSchema = Yup.object({
  firstName: Yup.string()
    .max(15, 'First Name must be 15 characters or less')
    .matches(/^[A-Za-z]+$/, 'First Name must contain only letters')
    .required('First Name is a required field'),
  lastName: Yup.string()
    .max(20, 'Last Name must be 20 characters or less')
    .matches(/^[A-Za-z]+$/, 'Last Name must contain only letters')
    .required('Last Name is a required field'),
  email: Yup.string()
    .email('Email is incorrect')
    .required('Email is a required field'),
  phoneNumber: Yup.string()
    .matches(
      /^(\+?\d{1,3}[- ]?)?\d{10}$/,
      'Phone Number must be a valid 10-digit number'
    )
    .notRequired(),
  age: Yup.number()
    .typeError('Age must be a number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be at most 120')
    .required('Age is a required field'),
});

const MyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    age: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log('Form Data', values);
      
      toast.success('Form submitted successfully!');
      navigate('/success');
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="my-form">
          {/* Поля форми */}
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <Field name="firstName" type="text" />
            {touched.firstName && errors.firstName && (
              <ErrorMessage message={errors.firstName} />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <Field name="lastName" type="text" />
            {touched.lastName && errors.lastName && (
              <ErrorMessage message={errors.lastName} />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            {touched.email && errors.email && (
              <ErrorMessage message={errors.email} />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <Field name="phoneNumber" type="text" />
            {touched.phoneNumber && errors.phoneNumber && (
              <ErrorMessage message={errors.phoneNumber} />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="age">Age</label>
            <Field name="age" type="number" />
            {touched.age && errors.age && (
              <ErrorMessage message={errors.age} />
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default MyForm;
