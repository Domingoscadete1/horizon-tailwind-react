import React, { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import avatar from "assets/img/avatars/Imagem WhatsApp 2025-03-24 às 13.51.21_62a4ceab.jpg";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";

const Banner = () => {
  const [funcionarioId, setFuncionarioId] = useState({});
  const [profileImage, setProfileImage] = useState(avatar);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('userData');
    if (token) {
      const userData = JSON.parse(token);
      setFuncionarioId(userData);
      
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, []);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfileImage(imageUrl);
        
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img className="h-full w-full rounded-full object-cover" src={profileImage} alt="Profile" />
          
          <button 
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
          >
            <MdEdit className="text-blue-500" size={14} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {funcionarioId.username || 'Usuário'}
        </h4>
        <p className="text-base font-normal text-gray-600">
          {funcionarioId.email || '@@@'}
        </p>
      </div>
    </Card>
  );
};

export default Banner;