import React, { useState, useEffect } from "react";
import avatar from "assets/img/avatars/Imagem WhatsApp 2025-03-24 às 13.51.21_62a4ceab.jpg";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";


const Banner = () => {
  const [funcionarioId, setfuncionarioId] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('userData');
    if (token) {
      const userData = JSON.parse(token);
      const postoId = userData;
      console.log(userData);
      if (postoId) {
        setfuncionarioId(postoId);
      }
    }
  }, []);

  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img className="h-full w-full rounded-full" src={avatar} alt="" />
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {funcionarioId.username}
        </h4>
        <p className="text-base font-normal text-gray-600">{funcionarioId.email || '@@@'}</p>
      </div>

    </Card>
  );
};

export default Banner;
