import * as yup from 'yup';

export const userSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .max(50, 'Name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  age: yup
    .number()
    .required('Age is required')
    .min(0, 'Age cannot be negative')
    .max(150, 'Age cannot be more than 150')
    .typeError('Age must be a number'),
});