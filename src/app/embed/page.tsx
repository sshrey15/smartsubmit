"use client"
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [base64, setBase64] = useState('');

  useEffect(() => {
    // Fetch the base64 string from your API
    fetch('/api/upload')
      .then(response => response.json())
      .then(data => setBase64(data.base64));
  }, []);

  return (
    <embed src={`data:application/pdf;base64,${base64}`} width="500" height="500" type="application/pdf" />
  );
}

export default Page;