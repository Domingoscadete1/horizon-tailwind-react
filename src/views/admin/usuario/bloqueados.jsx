import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Card from 'components/card';


const UsuariosBloqueados = () => {

    return (
        <div className="p-4">
            <Card extra="w-full h-full sm:overflow-auto p-6">
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Usuários Bloqueados
                    </div>

                </header>

                <div className="mt-5">

                </div>
            </Card>
        </div>
    );
};

export default UsuariosBloqueados;