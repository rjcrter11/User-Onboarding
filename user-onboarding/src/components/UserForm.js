import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

function UserForm({ values, errors, touched, status }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("status has changed", status);
    status && setUsers((users) => [...users, status]);
  }, [status]);

  return (
    <div className="user-form">
      <Form>
        <label htmlFor="name">Name: </label>
        <Field id="name" type="text" name="name" placeholder="Add name..." />
        {touched.name && errors.name && <p className="errors">{errors.name}</p>}

        <label htmlFor="email">Email: </label>
        <Field id="email" type="email" name="email" placeholder="email" />
        {touched.email && errors.email && (
          <p className="errors">{errors.email} </p>
        )}

        <label htmlFor="password">Password</label>
        <Field id="password" type="password" name="password" />
        {touched.password && errors.password && (
          <p className="errors">{errors.password}</p>
        )}

        <label htmlFor="tos">Agree to Terms of Service</label>
        <Field id="tos" name="tos" type="checkbox" checked={values.tos} />
        {touched.tos && errors.tos && <p className="errors">{errors.tos}</p>}

        <button type="submit">Submit</button>
      </Form>

      {users.map((user) => (
        <ul key={user.id}>
          <li>Name: {user.name} </li>
          <li>Email: {user.email} </li>
          <li>Password: {user.password} </li>
        </ul>
      ))}
    </div>
  );
}

const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .min(3, "Too short!")
      .required("A name is required!"),
    email: Yup.string()
      .email("Invalid email")
      .required("An email is required"),
    password: Yup.string()
      .min(8, "password must be at least 8 characters")
      .required("password required"),
    tos: Yup.bool()
      .oneOf([true], "Must agree to tos terms")
      .required()
  }),
  handleSubmit(values, { setStatus }) {
    console.log("submitting", values);
    axios
      .post(" https://reqres.in/api/users/", values)
      .then((res) => {
        console.log("success", res);
        setStatus(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
})(UserForm);

export default FormikUserForm;
