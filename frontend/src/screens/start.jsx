import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const Start = () => {
    const navigate=useNavigate();
  const fullTexta = "MAAKE A FRIEND CIRCLE WITH ";
  const fullTextb = "AII FOR PROOJECTS";
  const [texta, setTexta] = useState('');
  const [textb, setTextb] = useState('');
  const speeda = 100;
  const speedb=300; // typing speed in ms

  useEffect(() => {
  let index = 0;

  // Show first character instantly
  setTexta(fullTexta.charAt(index));
  index++;

  const timer = setInterval(() => {
    setTexta((prev) => prev + fullTexta.charAt(index));
    index++;
    if (index === fullTexta.length) clearInterval(timer);
  }, speeda);

  return () => clearInterval(timer);
}, []);

useEffect(() => {
  let index = 0;

  // Show first character instantly
  setTextb(fullTextb.charAt(index));
  index++;

  const timer = setInterval(() => {
    setTextb((prev) => prev + fullTextb.charAt(index));
    index++;
    if (index === fullTextb.length){ clearInterval(timer);
    navigate("/login");}
  }, speedb);

  return () => clearInterval(timer);
}, []);


  return (
    <div className="w-full bg-amber-800 p-4 text-white text-5xl font-bold flex flex-col h-screen items-center justify-center">
      <div>{texta}</div>
      <div>{textb}</div>
    </div>
  );
};

export default Start;