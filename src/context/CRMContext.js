import React, {useState, createContext, useContext} from 'react';


const CRMContext = createContext([{}, () => {}]);

const CRMProvider = ({children}) => {

    // definir el state inicial
    const [auth, guardarAuth] = useState({
        token: '', 
        auth: false
    });

    return (
        <CRMContext.Provider value={[auth, guardarAuth]}>
            {children}
        </CRMContext.Provider>
    );
}

export { CRMContext, CRMProvider }
