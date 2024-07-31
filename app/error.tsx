"use client";

import Error from "next/error";
import { useEffect } from "react";

// TODO: Add more meaningful info and style it
const ErrorPage = ({ error }: { error: Error }) => {
  useEffect(() => console.error(error));
  return <h1>Something went wrong.</h1>;
};

export default ErrorPage;
